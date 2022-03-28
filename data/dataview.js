const O = Object, S = Symbol, { toPrimitive } = S, { defineProperties } = O;

const tag = /* @__PURE__ */ S(), bytes = /* @__PURE__ */ S()
  , float = "Float", uint = "Uint", int = "Int", big = "Big"
  , t = (string, size) => (value) => ({
    [toPrimitive]: () => value,
    [tag]: string + size,
    [bytes]: size / 8,
  });

export const table = {}
  , f64 = /* @__PURE__ */ t(float, 64), f32 = /* @__PURE__ */ t(float, 32)
  , i64 = /* @__PURE__ */ t(big + int, 64), u64 = /* @__PURE__ */ t(big + uint, 64)
  , i32 = /* @__PURE__ */ t(int, 32), i16 = /* @__PURE__ */ t(int, 16), i8 = /* @__PURE__ */ t(int, 8)
  , u32 = /* @__PURE__ */ t(uint, 32), u16 = /* @__PURE__ */ t(uint, 16), u8 = /* @__PURE__ */ t(uint, 8);
let offset = 0;
export let init = (buffer) => init = new DataView(buffer);

export default (value, label) => (
  value = typeof value == "number" ? f64(value) : value,
  label = table[label] ?? (table[label] = offset + value[bytes] - 1),

  ((v, set = v("set"), get = v("get")) =>
    defineProperties({ set, [toPrimitive]: get }, { let: { set, get } })
  )(op => val => init[op + value[tag]](label, val))
)
