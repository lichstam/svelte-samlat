export type ValidateQueries<T extends QueryRecord> = {
  [K in keyof T]: T[K]
}

export type QueryRecord = Record<
  string,
  {
    fn: (...args: any[]) => Promise<any>
    decoder: (...args: any[]) => any
    transformationFn: (...args: any[]) => any
  }
>
