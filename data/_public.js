import * as S from "../_internal/symbols.js"
export const
  get = (o, ...m) => S.toPrimitive in o ? o[S.toPrimitive](...m) : o,
  is = (o, f) =>
    f ?
      o[S.species]
        ? o[S.species] === f[S.species]
        : o instanceof f[S.species]
      : !!o[S.toPrimitive]()
