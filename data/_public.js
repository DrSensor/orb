import * as S from "../_internal/symbols.js"
export const
  is = (o, f) => f ? o instanceof f[S.species] : !!o[S.toPrimitive](),
  get = (o, ...m) => o[S.toPrimitive](...m)
