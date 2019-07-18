import ConfigImageModel from 'models/config-image'

const create = async (requestId, bucket, s3Key, config = {}) => {

  return await new ConfigImageModel({
    requestId,
    bucket,
    s3Key,
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
