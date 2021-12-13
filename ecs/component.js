import Orb, { override } from "../data/primitive.js";
const { fromEntries, entries, defineProperty } = Object;

export let id = 0;
/** **Declare** ECS Component */
export default (SoA, size = 255) => {
  Component.id = ++id, SoA = entries(SoA);
  let struct = {}, mapSoA = (handler) => fromEntries(SoA.map(handler));
  function Component($) {
    return $ == null
      ? { // reusable iterable array of struct
        *[Symbol.iterator]() {
          for (let $ = 0; $ < size; $++) {
            yield mapSoA(([key, Type]) => [
              key,
              (struct[key] ??= new Type(size))[$],
            ]);
          }
        },
      }
      : mapSoA(([key, Type]) => [
        key,
        new.target
          ? new Type($) // where $ is array size, return a brand new struct of array
          : ((array) =>
            defineProperty(Orb(array[$]), $data, { // where $ is entity id, return struct of orb at current entity id
              get: () => array[$],
              set(value) {
                array[$] = value;
              },
              configurable: false,
            }))(struct[key] ??= new Type(size)),
      ]);
  }
  return Component;
};

// alias
export const i8 = Int8Array,
  u8 = Uint8Array,
  i16 = Int16Array,
  u16 = Uint16Array,
  i32 = Int32Array,
  u32 = Uint32Array,
  i64 = BigInt64Array,
  u64 = BigUint64Array,
  f32 = Float32Array,
  f64 = Float64Array;