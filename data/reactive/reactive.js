import {
  $data,
  defineProperties,
  isAsync,
  isFunction,
  iterator,
  toPrimitive,
} from "./_internal.js";

export function* sequential(effects) {
  for (const effect of effects) yield [, effect];
}

// BUG: concurrent mode only works on effect as Async IIFE but not as Async Function
// logically `orb.effect.add((async () => {})())` executed concurrently while `orb.effect.add(async () => {})` are executed in sequence
export async function* concurrent(effects) {
  for (const { status, reason, value } of await Promise.allSettled(effects)) {
    yield [status, value ?? reason];
  }
}

export async function* concurrentFailFast(effects) {
  for (const effect of await Promise.all(effects)) yield [, effect];
}

export default function Reactive(
  self,
  effectResolver = sequential,
  afterEffectResolver = effectResolver,
) {
  const get = () => orb[$data], // get current orb value
    orb = (transform) => cascade((set) => (value) => set(transform(value))), // cascading transformed orb
    set = (value) => ( // change current orb value
      orb[$data] !== value && effect(value), orb[$data] = value
    );

  let onchange, errors;
  const context = this ?? {},
    effects = new Set(), // PERF: beware of dangling object (unused memory)
    throwAll = (e) => {
      if (errors) errors.forEach((reject) => reject(e));
      else throw e; // pass it to stack trace
    };

  const effect = async (value) => {
    const errorPool = [], queueError = (e) => errorPool.push(e);
    try { // INFO: it's impossible to have `f = tryAwait(f)` without invoking `await` in sequential mode
      let finalize = onchange?.call(context, value), status, effect;
      const isError = () => errors && status === "rejected", after = [];
      if (isAsync(finalize)) finalize = await finalize;
      for ([status, effect] of effectResolver(effects)) {
        isError() ? queueError(effect) : isFunction(
          isAsync(effect = effect.call(context, value))
            ? effect = await effect
            : effect,
        ) &&
          after.push(effect);
      }
      value = orb[$data];
      for ([status, effect] of afterEffectResolver(after)) {
        isError()
          ? queueError(effect)
          : isAsync(effect = effect(value)) && await effect;
      }
      if (isFunction(finalize)) {
        if (isAsync(finalize = finalize(value))) await finalize;
      }
    } catch (error) {
      throwAll(error);
    }
    errorPool.length > 0 && throwAll(errorPool);
    return value;
  };

  const cascade = (mkEffect) => {
    const orb$ = Reactive.call(context, orb[$data]);
    effects.add(mkEffect(orb$.set));
    return defineProperties(orb$, { inherit: { value: orb } });
  };

  orb[$data] = self;
  return defineProperties(orb, {
    effect: { get: () => effects, set: (cb) => onchange = cb },
    initial: { value: self },
    let: { set, get },
    set: { value: set },
    [toPrimitive]: { value: get },
    then: { // await orb effect before returning current orb value
      value(r) { // it's possible to do `await orb.then(value)` to await orb effect then change current orb value
        const isGet = isFunction(r), resolve = isGet ? r : () => orb[$data] = r;
        return effect(isGet ? orb[$data] : r).then(resolve);
      },
    },
    catch: { value: (reject) => (errors ??= new Set()).add(reject) },
    [iterator]: { // cascading orb
      *value() {
        yield cascade((set) => set);
      },
    },
  });
}
