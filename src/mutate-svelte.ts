import { readable, writable } from 'svelte/store'

type Query<R> =
  | {
    status: 'idle'
    error: null
    data: undefined
  }
  | {
    status: 'loading'
    error: null
    data: undefined
  }
  | {
    status: 'error'
    error: Error
    data: undefined
  }
  | {
    status: 'success'
    error: null
    data: Awaited<R>
  }

interface Options {
  manual?: boolean
}

export const mutateSvelte =
  <K, P, R>(queryFn: (key: K, params?: P) => R) =>
    (api: K, params?: P, options?: Options) => {
      const _state = writable<Query<R>>({
        status: 'idle',
        error: null,
        data: undefined
      })

      const trigger = async (): Promise<void> => {
        _state.set({
          ..._state,
          status: 'loading',
          error: null,
          data: undefined
        })

        try {
          const result = await queryFn(api, params)
          _state.set({
            status: 'success',
            error: null,
            data: result
          })
        } catch (e) {
          _state.set({
            status: 'error',
            error: e as Error,
            data: undefined
          })
        }
      }

      const state = readable<Query<R>>(
        {
          status: 'idle',
          error: null,
          data: undefined
        },
        (set) =>
          _state.subscribe((nextState) => {
            set(nextState)
          })
      )

      if (options?.manual !== true) {
        void trigger()
      }

      return { trigger, state }
    }
