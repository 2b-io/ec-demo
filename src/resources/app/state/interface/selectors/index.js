import { selectors } from 'app/state/ducks'

// TODO add warning about duplicate selector name
export default {
  ...Object.entries(selectors || {}).reduce(
    (combine, [ node, selectors ]) => ({
      ...combine,
      ...Object.entries(selectors || {}).reduce(
        (combine, [ name, func ]) => ({
          ...combine,
          [name]: (state, ...args) => func(state[node], ...args)
        }),
        {}
      )
    }),
    {}
  )
}
