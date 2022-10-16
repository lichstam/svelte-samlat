import { _querySvelte } from './_query-svelte'

describe('#_query-svelte', () => {
  it('Should return attributes', () => {
    const { data, loading, error, get } = _querySvelte((key: string) => key)(
      'foo'
    )
    expect(data).toBeDefined()
    expect(loading).toBeDefined()
    expect(error).toBeDefined()
    expect(get).toBeDefined()
  })

  it('Should return data when get is called', async () => {
    const { data, loading, error, get } = _querySvelte((key: string) => ({
      [key]: 'hello'
    }))('foo')

    await get()

    data.subscribe((res) => {
      expect(res).toEqual({ foo: 'hello' })
    })

    expect(loading).toBeDefined()
    expect(error).toBeDefined()
    expect(get).toBeDefined()
  })

  it('Should set loading to true', () => {
    const { loading, get } = _querySvelte((key: string) => ({
      [key]: 'hello'
    }))('foo')
    get()
    loading.subscribe((res) => {
      if (res) expect(res).toEqual(true)
    })
  })

  it('Should return error', () => {
    const { error, get } = _querySvelte((_: string) => {
      throw new Error('error')
    })('foo')
    get()
    error.subscribe((res) => {
      if (res) expect(res.message).toEqual('error')
    })
  })

  it('Should return response with param', async () => {
    const { data, get } = _querySvelte((key: string, params?: number) => ({
      [key]: params
    }))('foo')
    await get(33)
    data.subscribe((res) => {
      expect(res).toEqual({ foo: 33 })
    })
  })
})
