import * as S from "../_internal/symbols.js"
export const
  get = (o, ...m) => o[S.toPrimitive](...m),
  is = (o, f) =>
    f ?
      o[S.species]
        ? o[S.species] === f[S.species]
        : o instanceof f[S.species]
      : !!o[S.toPrimitive]()
