type Queries<Params, EncodedType, DecodedType, TransformedType> = {
  fn: (params: Params) => EncodedType
  decoder: (arg: Awaited<EncodedType>) => DecodedType
  transformationFn: (arg: Awaited<DecodedType>) => TransformedType
}

export const makeQueries = <Params, EncodedType, DecodedType, TransformedType>(
  queries: Queries<Params, EncodedType, DecodedType, TransformedType>
) => queries
