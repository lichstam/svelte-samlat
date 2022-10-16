import type { QueryRecord, ValidateQueries } from './_types'

export const _queryFn =
  <K extends QueryRecord>(q: ValidateQueries<K>) =>
  async <T extends keyof K>(
    api: T,
    params?: Parameters<K[T]['fn']>[0]
  ): Promise<ReturnType<K[T]['transformationFn']>> => {
    const { fn, decoder, transformationFn } = q[api]
    const response = await fn(params)
    try {
      const decoded = decoder(response)
      return transformationFn(decoded)
    } catch (e: any) {
      throw Error(e.message)
    }
  }
