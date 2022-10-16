import { makeQueries } from './_make-queries'

describe('#_make-queries', () => {
  it('Should return correct query', () => {
    const expected = {
      fn: () => 'request response',
      decoder: (x: any) => x,
      transformationFn: (x: any) => x
    }
    const queries = makeQueries(expected)

    expect(queries).toEqual(expected)
  })
})
