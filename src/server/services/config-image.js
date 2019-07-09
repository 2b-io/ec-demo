import ConfigImageModel from 'models/config-image'

const create = async (bucket, s3Key, config = {}) => {

  const configImage = await new ConfigImageModel({
    bucket,
    s3Key,
    config,
  }).save()

  const { _id: configId } = configImage

  return configId
}
export default {
  create
}
