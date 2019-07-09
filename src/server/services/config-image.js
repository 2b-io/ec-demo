import ConfigImageModel from 'models/config-image'

const create = async (bucket , s3Key, config = {}) => {
  console.log('bucket', bucket);
  return await new ConfigImageModel({
    bucket,
    s3Key,
    config,
  }).save()
}
export default {
  create
}
