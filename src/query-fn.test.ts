import { queryFn as _queryFn } from "./query-fn"

describe("#queryfn", () => {
  const queries = {
    request: {
      fn: jest.fn(),
      decoder: (res) => res,
      transformationFn: jest.fn(),
    },

    request2: {
      fn: (res: any) => res,
      decoder: (res) => res,
      transformationFn: (res) => res,
    },

    request3: {
      fn: (res: any) => res,
      decoder: jest.fn(),
      transformationFn: (res) => res,
    },
  }

  const queryFn = _queryFn(queries)
  it("Should return response ", async () => {
    queries.request.fn.mockResolvedValueOnce("request response")
    queries.request.transformationFn.mockImplementationOnce((res) => res)

    const query = await queryFn("request")
    expect(query).toEqual("request response")
  })

  it("Should return response modified response", async () => {
    queries.request.transformationFn.mockResolvedValueOnce(
      "request response modified"
    )
    const query = await queryFn("request")
    expect(query).toEqual("request response modified")
  })

  it("Should return param sent into queryFn", async () => {
    const query = await queryFn("request2", "param")
    expect(query).toEqual("param")
  })

  it("Should throw error if decoder fails", async () => {
    queries.request3.decoder.mockImplementationOnce(() => {
      throw Error("decoder error")
    })
    await expect(queryFn("request3")).rejects.toThrow("decoder error")
  })
})
