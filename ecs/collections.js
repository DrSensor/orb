/** **WARNING**: [JavaScript bitwise operators treat their operands as 32 bit integers](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators#binary_bitwise_operators) */
const BITS_PER_ELEMENT = 32, M = Math;

//@internal
export function* BitVector(size, Type = Uint32Array) {
  let max;
  const vec = new Type(
    Array(M.ceil(size / (max = Type.BYTES_PER_ELEMENT * 8 || BITS_PER_ELEMENT)))
      .fill(0),
  );
  const hi = (bit) => M.floor(bit / max), lo = (bit) => bit % max;
  yield /**set*/ (bit) => vec[hi(bit)] | (1 << lo(bit));
  yield /**get*/ (bit) => (vec[hi(bit)] & (1 << lo(bit))) != 0;
  yield /**clear*/ (bit) => vec[hi(bit)] & ~(1 << lo(bit));
}

//@internal
export function* SparseSet(size, Type = Uint8Array) {
  const dense = new Type(size), sparse = new Type(size);
  let index = 0;

  const has = (x) => sparse[x] < dense.length && dense[sparse[x]] === x;
  yield has;

  yield /**add*/ (x) => !has(x) && (dense[index] = x, sparse[x] = index++);

  yield /**delete*/ (x) =>
    has(x) && x !== dense[index - 1] &&
    (sparse[dense[index - 1]] = sparse[x], dense[sparse[x]] = dense[index--]);

  yield /**clear*/ () => index = 0;
}
