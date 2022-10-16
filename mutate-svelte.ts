import { writable } from 'svelte/store'

export const _mutateSvelte =
  <K, P, R>(queryFn: (key: K, params?: P) => R) =>
  (api: K) => {
    const loading = writable(false)
    const error = writable<Error | null>(null)
    const data = writable<Awaited<R>>()

    async function trigger(params?: P) {
      loading.set(true)
      error.set(null)
      try {
        const result = await queryFn(api, params)
        data.set(result)
      } catch (e) {
        error.set(e as Error)
      } finally {
        loading.set(false)
      }
      loading.set(false)
    }
    return { data, loading, error, trigger }
  }
