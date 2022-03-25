export { default as match } from "./helper/match.js";
import { effectMatchTable } from "./_internal.js";

const O = Object, RefSet = Set; // TODO:👈👇 refactor to _internal.js
const {
    assign,
    getOwnPropertyNames,
    defineProperties,
    defineProperty,
    hasOwn,
  } = O,
  isObject = ($) => typeof $ == "object",
  reduce = (array, callback, initial) => array.reduce(callback, initial),
  filter = (array, callback) => array.filter(callback),
  forEach = (array, callback) => array.forEach(callback),
  add = (cache, item) => cache.add(item),
  remove = (cache, item) => cache.delete(item),
  has = (cache, item) => cache.has(item),
  length = ($) => $.length;
const S = Symbol, { toPrimitive } = S, effect = /* @__PURE__ */ S(); // TODO:👈 refactor to _symbol.js

const ops = /* @__PURE__ */ filter(
    getOwnPropertyNames(RefSet.prototype),
    (key) => "size" == key || key == "constructor",
  ),
  oops = /* @__PURE__ */ reduce(ops, ($, key) => ($[key] = undefined, $), {});

const unlink = (fn) => (rvar) => (remove(rvar[effect], fn), rvar),
  link = (fn) =>
    assign((rvar) => (add(rvar[effect], fn), rvar), {
      has: (rvar) => has(rvar[effect], fn),
    });

const register = (fn, cache = new RefSet()) => [
  (rvar) => (add(rvar[effect], fn), add(cache, rvar), rvar),
  (rvar) => (remove(rvar[effect], fn), remove(cache, rvar), rvar),
  () => (forEach(cache, (rvar) => remove(rvar[effect], fn)), cache = null), // cache.clear() )//🤔
];

const trigger = ([fn, n], addEffect, removeEffect) => {
  forEach(n, (rvar) =>
    addEffect(
      rvar,
      n = () => (
        defineProperty(un, "ref", { get: new WeakRef(rvar).deref }),
          removeEffect(rvar, n),
          once()
      ),
    ));
  const once = () => fn(ln, un, clr),
    [ln, un, clr] = length(fn) < 3 ? [link(fn), unlink(fn)] : register(fn);
};

const default_ = (...n) => (
  hasOwn(n[0], effect)
    ? {
      ...reduce(ops, ($, op) => (
        $[op] = (...args) => forEach(n, (rvar) => rvar[effect][op](...args)), $
      ), { ...oops }),
      set let(fn) {
        forEach(n, (rvar) => rvar[effect] = fn);
      },

      get do() {
        return (fn) =>
          trigger(
            [fn, n],
            (rvar, handler) => add(rvar[effect], handler),
            (rvar, handler) => remove(rvar[effect], handler),
          );
      },
      set do(fn) {
        trigger(
          [fn, n],
          (rvar, handler) => rvar[effect] = handler,
          (rvar) => rvar[effect] = null,
        );
      },

      get switch() {
        return (pattern) => {};
      },
      set switch(pattern) {},
    }
    : isObject(n[0]) // TODO: execute effect based on pattern match(...)
    ? (() => {})()
    : (n = length(n = n[0]) < 3 // is function with specific arguments length (remember that function has .length property)
      ? () => n(link(n), unlink(n))
      : () => n(...register(n)))()
);

default_[toPrimitive] = () => effect;
defineProperties(default_, {
  let: {
    set: (fn) =>
      (fn = length(fn) < 3
        ? () => fn(link(fn), unlink(fn))
        : () => fn(...register(fn)))(),
  },
  switch: { set: (pattern) => {} },
});

export { default_ as default, effect };
