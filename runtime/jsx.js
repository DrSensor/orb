/// A jsx-runtime baseline which instantiate any function component

export const TOPLEVEL = 2, AUTOMATIC = 1, CLASSIC = 0;
export const pipeline = (mode, ...jsxFactories) =>
  (element, props, ...args) => {
    const runtime = {}, call = {}, after = [];
    if (mode) {
      var { children, ...props } = props;
      children = children[Symbol.iterator] ? children : [children];
    } else children = args;

    args = [props].concat(children, runtime, args);
    for (let create of jsxFactories) {
      element = create.apply(call, [element].concat(args)) ?? element;
      if (typeof (create = call.effect?.()) == "function") after.push(create);
    }
    for (const effect of after) effect?.();
    return element;
  }; // 👈 effect Map should be evicted here

const O = Object;
export function create(element, props, children, runtime, ...extras) {
  const [key, ...DEV] = extras, [isStaticChildren, source, self] = DEV;
  if (typeof element == "function") {
    const effect = new Map().set(undefined, new Set()); // PERF: beware of dangling object (unused memory)
    this.effect = () =>
      () => {
        for (const [, effects] of effect) { // apply all effect Map at the end of pipeline
          for (const effect of effects) effect();
        }
      }; // 👈 effect Map not yet evicted here
    return element.call(
      O.defineProperties(runtime, {
        effect: {
          get: () =>
            (orbs) => { // WARNING: this is inefficient compared to ECS Archetype approach
              if (typeof orbs == "object") {
                orbs = new Set(O.values(orbs));
                for (const [keys, effects] of effect) {
                  if (Array.from(keys).every(orbs.has)) return effects;
                }
                const effects = new Set();
                effect.set(orbs, effects);
                return effects;
              } else {
                return effect.get(orbs) ?? (
                  (effects) => (effect.set(orbs, effects), effects)
                )(new Set());
              }
            },
          set: (fn) => effect.get().add(fn),
        },
      }),
      props,
      ...children,
    );
  }
}

export const createElement = pipeline(CLASSIC, create);
