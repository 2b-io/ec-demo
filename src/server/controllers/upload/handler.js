import fsNode from 'fs'
import fs from 'fs-extra'
import mime from 'mime-types'
import path from 'path'
import uuid from 'uuid'
import zipFolder from 'zip-folder'
import shorthash from 'shorthash'
import unzipper from 'unzipper'

import config from 'infrastructure/config'
import configImage from 'services/config-image'
import overlayImage from 'services/overlay-image'

import s3Cache from 'services/cache'
import cacheRequest from 'services/cache-request'

const zip = (pathSource, pathResult) => {
  return new Promise(resolve => zipFolder(pathSource, pathResult, resolve))
}

export default {
  post: [
    async (req, res, next) => {
      const { requestid: requestId } = req.params

      // check exist file zip and unzip
      const zipFile = path.resolve(`${ config.uploadimageDir }/${ requestId }/${ requestId }.zip`)

      if (fsNode.existsSync(zipFile)) {
        console.log('START_UNZIP_FILE...')

        const unzipPath = path.resolve(`${ config.uploadimageDir }/${ requestId }`)
        const zipPathFile = path.resolve(`${ config.uploadimageDir }/${ requestId }/${ requestId }.zip`)

        await fs.createReadStream(zipPathFile).pipe(unzipper.Extract({ path: unzipPath })).promise()
        await fs.removeSync(zipPathFile)

        console.log('UNZIP_FILE_DONE...')
      }

      // upload images to s3
      console.log('START_UPLOAD_IMAGE_TO_S3...')

      const images = await fsNode.readdirSync(path.resolve(`${ config.uploadimageDir }/${ requestId }`))

      await Promise.all(images.map(async (file, index) => {
        const imagePath = path.resolve(`${ config.uploadimageDir }/${ requestId }`, file)
        const contentTypeImage = mime.lookup(imagePath)

        const s3Image = await s3Cache.put(`${ requestId }/images/${ uuid.v4() }`, imagePath, contentTypeImage)

        const { key: s3ImageKey } = s3Image

        const s3Images = cacheRequest.get(requestId).images || []
        s3Images.push(s3ImageKey)

        cacheRequest.update(requestId, 'images', s3Images)
      }))

      console.log('UPLOAD_IMAGE_TO_S3_DONE...')
      // remove folder images
      await fs.removeSync( path.resolve(`${ config.uploadimageDir }/${ requestId }`))

      // upload  watermark to s3
      console.log('START_WATERMARK_TO_S3...')

      const watermarkPath = path.resolve(`${ config.uploadWatermarkDir }/${ requestId }/${ requestId }.png`)

      const contentTypeWatermark = mime.lookup(watermarkPath)

      const watermarkS3 = await s3Cache.put(`${ requestId }/watermark/${ uuid.v4() }`, watermarkPath, contentTypeWatermark)

      const { key: watermarkKey } = watermarkS3

      cacheRequest.update(requestId, 'watermark', watermarkKey)

      console.log('WATERMARK_TO_S3_DONE...')
      // remove folder watermark
      await fs.removeSync( path.resolve(`${ config.uploadWatermarkDir }/${ requestId }`))

      await fs.ensureDir(`${ config.imageResultDir }/${ requestId }`)

      const { bucket, s3Key, config: { gravity } } = await configImage.get(requestId)

      const s3KeyOriginImage = cacheRequest.get(requestId).images

      const s3Watermark = cacheRequest.get(requestId).watermark

      const watermarkPathS3 = await s3Cache.get(s3Watermark, 'watermark', requestId)

      await Promise.all(s3KeyOriginImage.map(async (key) => {
        const file = await s3Cache.get(key, 'images',requestId)
        const ext = mime.extension(mime.lookup(file))
        const onputFilePath = await path.resolve(`${ config.imageResultDir }/${ requestId }/${ uuid.v4() }.${ ext }`)

        await overlayImage(file, watermarkPathS3, onputFilePath, gravity)
      }))

      // zip folder image result

      console.log('START_ZIP_FILE_RESULT...')

      await fs.ensureDir(`${ config.zipResultDir }`)

      const folderImangeResult = path.resolve(`${ config.imageResultDir }/${ requestId }`)

      const folderZipResult = await path.resolve(`${ config.zipResultDir }`)

      await zip(folderImangeResult, `${ folderZipResult }/${ requestId }.zip`)

      console.log('ZIP_FILE_DONE...')

      await fs.removeSync(folderImangeResult)

      const linkDownload = `${ config.endpoint }/download/${ requestId }.zip`

      return res.send({ linkDownload })
    }
  ]
}
