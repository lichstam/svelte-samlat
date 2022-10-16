import { _mutateSvelte } from './_mutate-svelte'

describe('#_query-svelte', () => {
  it('Should return attributes', () => {
    const { data, loading, error, trigger } = _mutateSvelte(
      (key: string) => key
    )('foo')
    expect(data).toBeDefined()
    expect(loading).toBeDefined()
    expect(error).toBeDefined()
    expect(trigger).toBeDefined()
  })

  it('Should return data when trigger is called', async () => {
    const { data, loading, error, trigger } = _mutateSvelte((key: string) => ({
      [key]: 'hello'
    }))('foo')

    await trigger()

    data.subscribe((res) => {
      expect(res).toEqual({ foo: 'hello' })
    })

    expect(loading).toBeDefined()
    expect(error).toBeDefined()
    expect(trigger).toBeDefined()
  })

  it('Should set loading to true', () => {
    const { loading, trigger } = _mutateSvelte((key: string) => ({
      [key]: 'hello'
    }))('foo')
    trigger()
    loading.subscribe((res) => {
      if (res) expect(res).toEqual(true)
    })
  })

  it('Should return error', () => {
    const { error, trigger } = _mutateSvelte((_: string) => {
      throw new Error('error')
    })('foo')
    trigger()
    error.subscribe((res) => {
      if (res) expect(res.message).toEqual('error')
    })
  })

  it('Should return response with param', async () => {
    const { data, trigger } = _mutateSvelte((key: string, params?: number) => ({
      [key]: params
    }))('foo')
    await trigger(33)
    data.subscribe((res) => {
      expect(res).toEqual({ foo: 33 })
    })
  })
})
