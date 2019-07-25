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

export default {
  post: [
    async (req, res, next) => {
      const { requestid: requestId } = req.params

      const zipFile = path.resolve(`${ config.uploadimageDir }/${ requestId }/${ requestId }.zip`)

      if (fsNode.existsSync(zipFile)) {
        const unzipPath = path.resolve(`${ config.uploadimageDir }/${ requestId }`)
        const zipPathFile = path.resolve(`${ config.uploadimageDir }/${ requestId }/${ requestId }.zip`)
        await fs.createReadStream(zipPathFile).pipe(unzipper.Extract({ path: unzipPath })).promise()
        await fs.removeSync(zipPathFile)
      }

      // upload images to s3
      const files = await fsNode.readdirSync(path.resolve(`${ config.uploadimageDir }/${ requestId }`))

      await Promise.all(files.map(async (file, index) => {
        const filePath = path.resolve(`${ config.uploadimageDir }/${ requestId }`, file)
        const contentTypeFile = mime.lookup(filePath)

        const s3OriginImage = await s3Cache.put(`${ requestId }/images/${ uuid.v4() }`, filePath, contentTypeFile)

        const { key: originImageKey } = s3OriginImage

        const s3Items = cacheRequest.get(requestId).items || []
        s3Items.push(originImageKey)

        cacheRequest.update(requestId, 'items', s3Items)
      }))

      // upload  watermark to s3
      const watermarkPath = path.resolve(`${ config.uploadWatermarkDir }/${ requestId }/${ requestId }.png`)

      const contentTypeWatermark = mime.lookup(watermarkPath)

      const watermarkS3 = await s3Cache.put(`${ requestId }/watermark/${ uuid.v4() }`, watermarkPath, contentTypeWatermark)

      const { key: watermarkKey } = watermarkS3

      cacheRequest.update(requestId, 'watermark', watermarkKey)

      // create zip folder path
      await fs.ensureDir(`${ config.zipResultDir }`)

      await fs.ensureDir(`${ config.imageResultDir }/${ requestId }`)

      const { bucket, s3Key, config: { gravity } } = await configImage.get(requestId)

      const s3KeyOriginImage = cacheRequest.get(requestId).items

      const s3Watermark = cacheRequest.get(requestId).watermark

      const watermarkPathS3 = await s3Cache.get(s3Watermark, 'watermark', requestId)

      await Promise.all(s3KeyOriginImage.map(async (key) => {
        const file = await s3Cache.get(key, 'items',requestId)
        const ext = mime.extension(mime.lookup(file))
        const onputFilePath = await path.resolve(`${ config.imageResultDir }/${ requestId }/${ uuid.v4() }.${ ext }`)

        await overlayImage(file, watermarkPathS3, onputFilePath, gravity)
      }))

      const folderImangeResult = path.resolve(`${ config.imageResultDir }/${ requestId }`)

      const folderZipResult = await path.resolve(`${ config.zipResultDir }`)

      zipFolder(folderImangeResult, `${ folderZipResult }/${ requestId }.zip`, (err) => {
        if(err) {
            console.log('Zip error', err)
        } else {
            console.log('Zip done')
        }
      })

      const linkDownload = `http://localhost:3009/download/${ requestId }.zip`

      return res.send({ linkDownload })
    }
  ]
}
