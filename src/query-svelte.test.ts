import { querySvelte } from "./query-svelte"

describe("#_query-svelte", () => {
  it("Should return attributes", () => {
    const { state, get } = querySvelte((key: string) => key)("foo")
    expect(state).toBeDefined()
    expect(get).toBeDefined()
  })

  it("Should return data when get is called", async () => {
    const { state, get } = querySvelte((key: string) => ({
      [key]: "hello",
    }))("foo")

    await get()
    state.subscribe((res) => {
      expect(res.data).toEqual({ foo: "hello" })
    })

    expect(state).toBeDefined()
    expect(get).toBeDefined()
  })

  it("Should set loading to true", () => {
    const { state, get } = querySvelte((key: string) => ({
      [key]: "hello",
    }))("foo")
    get()
    state.subscribe((res) => {
      if (res.status) expect(res.status).toEqual("loading")
    })
  })

  it("Should return error", () => {
    const { state, get } = querySvelte((_: string) => {
      throw new Error("error")
    })("foo")
    get()
    state.subscribe((res) => {
      if (res) expect(res.status).toEqual("error")
    })
  })

  it("Should return response with param", async () => {
    const { state, get } = querySvelte((key: string, params?: number) => ({
      [key]: params,
    }))("foo", 33)
    await get()
    state.subscribe((res) => {
      expect(res.data).toEqual({ foo: 33 })
    })
  })
})
