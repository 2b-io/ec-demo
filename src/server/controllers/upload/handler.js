import fsNode from 'fs'
import fs from 'fs-extra'
import path from 'path'
import uuid from 'uuid'
import zipFolder from 'zip-folder'
import shorthash from 'shorthash'

import config from 'infrastructure/config'
import configImage from 'services/config-image'
import overlayImage from 'services/overlay-image'

import s3Cache from 'services/cache'
import cacheRequest from 'services/cache-request'

const TEMP_PATH = {
  item: config.uploadimageDir,
  watermark: config.uploadWatermarkDir,
  download: config.s3DownloadDir
}

export default {
  post: [
    async (req, res, next) => {
      const { requestid: requestId } = req.params

      // create zip folder path
      await fs.ensureDir(`${ config.zipResultDir }/${ requestId }`)

      const folderZipResult = await path.resolve(`${ config.zipResultDir }/${ requestId }`)

      await fs.ensureDir(`${ config.imageResultDir }/${ requestId }`)

      const { bucket, s3Key, config: { gravity } } = await configImage.get(requestId)

      const s3KeyOriginImage = cacheRequest.get(requestId).items

      const s3Watermark = cacheRequest.get(requestId).watermark

      await s3Cache.get(s3Watermark, 'watermark', requestId)

      const watermarkFile = fsNode.readdirSync(path.resolve(`${ TEMP_PATH[ 'watermark' ] }/${ requestId }`))[0]

      const watermarkPath = path.resolve(`${ TEMP_PATH[ 'watermark' ] }/${ requestId }`, watermarkFile)

      s3KeyOriginImage.reduce(async (all, key) => {
        const file = await s3Cache.get(key, 'items',requestId)

        const onputFilePath = await path.resolve(`${ config.imageResultDir }/${ requestId }/${ uuid.v4() }`)

        await overlayImage(file, watermarkPath, onputFilePath, gravity)
      },{})
      // const files = await fsNode.readdirSync(path.resolve(`${ TEMP_PATH[ 'item' ] }/${ requestId }`))

      // const _files = cache.stream

      // await files.reduce(async (all, file) => {
      //
      //   const filePath = path.resolve(`${ TEMP_PATH[ 'item' ] }/${ requestId }`, file)
      //
      //   const onputFilePath = await path.resolve(`${ config.imageResultDir }/${ requestId }/${ file }`)
      //
      //   const watermarkFile = fsNode.readdirSync(path.resolve(`${ TEMP_PATH[ 'watermark' ] }/${ requestId }`))[0]
      //
      //   const watermarkPath = path.resolve(`${ TEMP_PATH[ 'watermark' ] }/${ requestId }`, watermarkFile)
      //
      //   await overlayImage(filePath, watermarkPath, onputFilePath, gravity)
      // },{})

      const folderImangeResult = path.resolve(`${ config.imageResultDir }/${ requestId }`)

      zipFolder(folderImangeResult, `${ folderZipResult }/${ requestId }.zip`, (err) => {
        if(err) {
            console.log('Zip error', err)
        } else {
            console.log('Zip done')
        }
      })

      const linkDownload = 'localhost'

      return res.send({ linkDownload })
    }
  ]
}
