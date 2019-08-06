export const mapDispatch = actions => dispatch => {
  return Object.entries(actions).reduce(
    (map, [ name, actionCreator ]) => ({
      ...map,
      [ name ]: (...args) => dispatch(actionCreator(...args))
    }), {}
  )
}

export const mapState = selectors => state => {
  return Object.entries(selectors).reduce(
    (props, [ name, selector ]) => ({
      ...props,
      [ name ]: selector(state)
    }), {}
  )
}
