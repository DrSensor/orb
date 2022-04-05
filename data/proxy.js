const S = Symbol, O = Object, R = Reflect
  , { assign } = O, { toPrimitive } = S
  , trap = /* @__PURE__ */ S()
  , off = /* @__PURE__ */ S();

export default (target = {}, handler = {}) => (
  target = Proxy.revocable(target, handler),
  assign(target.proxy, { [off]: target.revoke, [trap]: handler })
);

export const
  revoke = proxy => (
    delete proxy[trap], // tell handler.deleteProperty() that proxy is about to be revoked
    proxy[off]()
  ),
  reflect = (proxy, handler) => {
    for (const method in handler)
      proxy[trap][method] = (...$) =>
        R[method](...$) ?? handler[method](...$);
  };

revoke[toPrimitive] = () => off;
reflect[toPrimitive] = () => trap;
