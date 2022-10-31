import { querySvelte } from "./query-svelte"

describe("#_query-svelte", () => {
  it("Should return attributes", () => {
    const { state, get } = querySvelte((key: string) => key)("foo")
    expect(state).toBeDefined()
    expect(get).toBeDefined()
  })

  it("Should return data on calling query", async () => {
    const { state, get } = querySvelte((key: string) => ({
      [key]: "hello",
    }))("foo")
    state.subscribe((res) => {
      if (res.status === "success") {
        expect(res.data).toEqual({ foo: "hello" })
      }
    })

    expect(state).toBeDefined()
    expect(get).toBeDefined()
  })

  it("Should set loading to true", () => {
    const { state } = querySvelte((key: string) => ({
      [key]: "hello",
    }))("foo")
    state.subscribe((res) => {
      if (res.status) expect(res.status).toEqual("loading")
    })
  })

  it("Should return error", () => {
    const { state } = querySvelte((_: string) => {
      throw new Error("error")
    })("foo")
    state.subscribe((res) => {
      if (res) expect(res.status).toEqual("error")
    })
  })

  it("Should return response with param", async () => {
    const { state } = querySvelte((key: string, params?: number) => ({
      [key]: params,
    }))("foo", 33)
    state.subscribe((res) => {
      if (res.status === "success") {
        expect(res.data).toEqual({ foo: 33 })
      }
    })
  })

  it("Should not trigger fetch when manual is true", async () => {
    const { state, get } = querySvelte((key: string) => ({
      [key]: "hello",
    }))("foo", undefined, { manual: true })

    const unsubscribe = state.subscribe((res) => {
      expect(res.status).toEqual("idle")
    })

    unsubscribe()

    await get()

    state.subscribe((res) => {
      expect(res.status).toEqual("success")
    })
  })
})
