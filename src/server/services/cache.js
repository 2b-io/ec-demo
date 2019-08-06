import fs from 'fs-extra'
import path from 'path'
import mime from 'mime-types'
import shorthash from 'shorthash'

import s3 from 'infrastructure/s3'
import config from 'infrastructure/config'
import localpath from 'services/localpath'
import uuid from 'uuid'

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

const stream = async (key) => {
  return s3.getObject({
    Bucket: s3.config.bucket,
    Key: cloudPath(key)
  }).createReadStream()
}

const get = async(key, fileType, requestId) => {
  await fs.ensureDir(`${ config.s3DownloadDir }/${ requestId }`)

  const downloadPath = await path.resolve(`${ config.s3DownloadDir }/${ requestId }/${ fileType }/${ shorthash.unique(key) }`)

  const {
    Body: body,
    ContentType: contentType
  } = await s3.getObject({
    Bucket: s3.config.bucket,
    Key: key
  }).promise()

  const ext = mime.extension(contentType)
  const _path = `${ downloadPath }.${ ext }`

  await fs.outputFile(_path, body)

  return _path
}

export default {
  get,
  put,
  stream
}
