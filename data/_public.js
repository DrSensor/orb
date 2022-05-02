import * as S from "../_internal/symbols.js"
export const get = (o, ...m) => o[S.toPrimitive](...m)
