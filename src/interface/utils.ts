export type CreateTuple<T, K extends number, List extends T[] = []> = List['length'] extends K
  ? List
  : CreateTuple<T, K, [...List, T]>
