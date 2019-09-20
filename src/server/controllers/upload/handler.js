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

      await fs.ensureDir(`${ config.imageResultDir }/${ requestId }`)

      const {
        config: {
          gravity,
          padding,
          opacity,
          modeResize,
          heightTemplate,
          widthTemplate,
          percentTemplate,
          heightPercentWatermark,
          widthPercentWatermark
        } } = await configImage.get(requestId)

      const s3KeyOriginImage = cacheRequest.get(requestId).images

      console.log('GET_WATERMARK_FROM_S3...')

      const s3Watermark = cacheRequest.get(requestId).watermark

      const watermarkPathS3 = await s3Cache.get(s3Watermark, 'watermark', requestId)

      console.log('GET_IMAGE_FROM_S3...')

      await Promise.all(s3KeyOriginImage.map(async (key) => {
        const file = await s3Cache.get(key, 'images',requestId)
        const ext = mime.extension(mime.lookup(file))
        const onputFilePath = await path.resolve(`${ config.imageResultDir }/${ requestId }/${ uuid.v4() }.${ ext }`)

        console.log('PROCESS_IMAGE...', file);

        await overlayImage(
          file,
          watermarkPathS3,
          onputFilePath,
          gravity,
          requestId,
          padding,
          opacity,
          modeResize,
          heightTemplate,
          widthTemplate,
          percentTemplate,
          heightPercentWatermark,
          widthPercentWatermark
        )
      }))

      // zip folder image result

      console.log('START_ZIP_FILE_RESULT...')

      await fs.ensureDir(`${ config.zipResultDir }`)

      const folderImangeResult = path.resolve(`${ config.imageResultDir }/${ requestId }`)

      const folderZipResult = await path.resolve(`${ config.zipResultDir }`)

      await zip(folderImangeResult, `${ folderZipResult }/${ requestId }.zip`)

      console.log('ZIP_FILE_DONE...')

      // remove folder temp imange result and s3 download
      await fs.removeSync(folderImangeResult)
      await fs.removeSync(path.resolve(`${ config.s3DownloadDir }/${ requestId }`))

      const linkDownload = `/download/${ requestId }.zip`

      return res.send({ linkDownload })
    }
  ]
}
