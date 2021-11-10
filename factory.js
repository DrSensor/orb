const { defineProperties } = Object, { iterator, toPrimitive } = Symbol;
const isFunction = ($) => typeof $ == "function", create = {};

// keep the function.name anonymous
create.orb = function (self) {
  const orb = (...$) => {
    const [$1] = $;
    if (isFunction($1)) { // cascading transformed orb
      return cascade((orb$) => (value) => orb$($1(value)));
    } else { // set/get orb
      if ($.length) {
        if (self !== $1) effect($1);
        self = $1;
      }
      return self;
    }
  };

  const context = this ?? {};
  const effect = async (value) => {
    const finalize = await orb.onchange?.call(context, value), after = [];
    for await (let effect of orb.effect) {
      if (isFunction(effect = effect.call(context, value))) after.push(effect);
    }
    for await (const effect of after) effect();
    await finalize?.();
    return value;
  };

  const cascade = (mkEffect) => {
    const orb$ = create.orb.call(context, self);
    orb.effect.add(mkEffect(orb$));
    return defineProperties(orb$, { inherit: { value: orb } });
  };

  return defineProperties(orb, {
    effect: { value: new Effect(context) },
    initial: { value: self },
    value: { set: orb, get: orb },
    [toPrimitive]: { value: () => self },
    then: {
      value(r) {
        const get = isFunction(r), resolve = get ? r : () => self = r;
        return effect(get ? self : r).then(resolve);
      },
    },
    [iterator]: { // cascading orb
      *value() {
        yield cascade((orb$) => orb$);
      },
    },
  });
};

class Effect extends Set {
  constructor(context) {
    super();
    this.add = (item) => {
      this.onadd?.(context);
      return super.add(item);
    };
    this.delete = (item) => {
      this.ondelete?.(context);
      return super.delete(item);
    };
  }
}

export default create.orb;
