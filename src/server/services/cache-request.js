const CACHE = {}

export default {
  create(requestId) {
    if (!CACHE[ requestId ]) {
      CACHE[ requestId ] = {}
    }
  },
  update(requestId, key, value) {
    CACHE[ requestId ][ key ] =  value
  },
  get(requestId) {
    return CACHE[ requestId ]
  }
}
