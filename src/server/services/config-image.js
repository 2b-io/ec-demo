import ConfigImageModel from 'models/config-image'

const create = async (requestId, config = {}) => {
  return await new ConfigImageModel({
    requestId,
    config
  }).save()
}

const get = async (requestId) => {
  return await ConfigImageModel.findOne({
    requestId
  })
}

export default {
  create,
  get
}
