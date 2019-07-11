import { types } from 'app/state/ducks'

export default Object.entries(types || {}).reduce(
  (combine, [ node, types ]) => ({
    ...combine,
    [ node ]: types,
    ...Object.entries(types || {}).reduce(
      (combine, [ name, value ]) => ({
        ...combine,
        [`${node.toUpperCase()}/${name.toUpperCase()}`]: value
      }),
      {}
    )
  }),
  {}
)
