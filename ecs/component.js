import Orb, { override } from "../data/reactive/opaque.js";
const O = Object, $orbs = Symbol();

/** **Declare** ECS Component */
export default (SoA, size = 255) => {
  let struct, mapSoA = (to) => O.fromEntries(O.entries(SoA).map(to));
  Component[$orbs] = new Map(), Component.entities = new Uint8Array(size); // sparse
  function Component($) {
    return $ == null
      ? new.target
        ? { // return current array of struct for all entity in form of reusable iterable
          *[Symbol.iterator]() {
            for (let eid = 0; eid < size; eid++) {
              yield mapSoA(([key, Type]) => [
                key,
                (struct[key] ??= new Type(size))[eid],
              ]);
            }
          },
        }
        : struct ??= mapSoA(([key, Type]) => [key, new Type(size)]) // return current struct of array for all entity
      : (struct ??= {},
        mapSoA(([key, Type]) => [
          key,
          ((array) => {
            if (array == struct[key]) { // where $ is entity id, return struct of orb at current entity id
              const orb = Orb(array[$]);
              Component[$orbs].set($, orb);
              return override(orb, {
                get: () => array[$],
                set: (value) => array[$] = value,
                configurable: false,
              });
            } else { // where $ is array size, return struct of array, override the current one with specific size while retaining the values
              if (struct[key]?.length < $) array.set(struct[key]); // grow array
              else if (struct[key]?.length); // TODO: shrink array
              return struct[key] = array;
            }
          })(new.target ? new Type($) : struct[key] ??= new Type(size)),
        ]));
  }
  return Component;
};

export { $orbs as $orb };
// alias
export const any = Array,
  i8 = Int8Array,
  u8 = Uint8Array,
  i16 = Int16Array,
  u16 = Uint16Array,
  i32 = Int32Array,
  u32 = Uint32Array,
  i64 = BigInt64Array,
  u64 = BigUint64Array,
  f32 = Float32Array,
  f64 = Float64Array;
