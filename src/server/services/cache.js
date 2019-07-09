import fs from 'fs-extra'
import s3 from 'infrastructure/s3'

import config from 'infrastructure/config'

const { version = '0.0.1' } = config.aws.s3

export const cloudPath = (key) => `${ version }/${ key }`

const put = async (key, file, contentType, options = {}) => {
  const { expires, meta, ttl } = options

  return await s3.upload({
    Bucket: s3.config.bucket,
    Key: cloudPath(key),
    ContentType: contentType || 'application/octet-stream',
    Body: fs.createReadStream(file),
    Expires: expires ?
      new Date(expires) : (
        ttl ?
          new Date(Date.now() + ttl * 1000) :
          undefined
      ),
    Metadata: meta || {}
  }).promise()
}

export default {
  put
}
