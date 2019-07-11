import uuid from 'uuid'

export default {
  get: [
    async (req, res, next) => {
      const requestId = uuid.v4()
      return res.send({ requestId })
    }
  ]
}
