import * as S from "../_internal/symbols.js"
export const
  is = o => !!o[S.toPrimitive](),
  get = (o, ...m) => o[S.toPrimitive](...m)
