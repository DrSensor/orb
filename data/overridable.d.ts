export interface Writable<T, E extends any[] = any[]> {
  set(value: T, ...extras: E): T
  set let(value: T)
}

type $get = SymbolConstructor["toPrimitive"]
export interface Readable<T, E extends any[] = any[]> {
  [$get](hint: string, ...extras: E): T
}

export const get: <E extends any[], T>(
  o: Overridable<T, E>,
  hint: string,
  ...extras: E,
) => T

export const is: <T, E>(o: Overridable<T, E>) => boolean

export class Cover<G extends () => any, S extends ($: any) => any> {
  constructor(desc: { get?: G, set?: S })
  get: G
  set: S
  let: ReturnType<G | S>
}

///////////////////////////////////////////////////////////////////////////////

export type Overridable<T, E extends any[] = any[]> =
  & (T extends string | number | symbol ? T : Readable<T, E>)
  & ({ get let(): T } & Writable<T, E>)

export const over: <E extends any[] = any[], T>(
  value: T,
) => Overridable<T, E>
export class Over<T> implements Overridable<T, []> {
  constructor(value: T)
}

///////////////////////////////////////////////////////////////////////////////

export interface OverrideDescriptor<T, E extends any[] = any[]> {
  set?(value: T, ...extras: E)
  get?(hint: string, ...extras: E): T
  enumerable?: boolean
  configurable?: boolean
}

export const override: <E extends any[], T>(
  o: Overridable<T, E>,
  descriptor: OverrideDescriptor<T, E>,
) => T

///////////////////////////////////////////////////////////////////////////////

export interface ChainDescriptor<T, E extends any[] = any[]> {
  set?(args: [value: T, ...extras: E], set?: Writable<T, E>["set"])
  get?(args: [hint: string, ...extras: E], get?: Readable<T, E>[$get]): T
  enumerable?: boolean
  configurable?: boolean
}

export const chain: <E extends any[], T>(
  o: Overridable<T, E>,
  descriptor: ChainDescriptor<T, E>,
) => T
