export default (array, property = 'id') => {
  return array.reduce((arr, element) => {
    const key = element[ property ]

    return  { ...arr, [ key ] : element }
  }, {} )
}
