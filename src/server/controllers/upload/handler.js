import fsNode from 'fs'
import fs from 'fs-extra'
import path from 'path'
import zipFolder from 'zip-folder'

import config from 'infrastructure/config'
import configImage from 'services/config-image'
import overlayImage from 'services/overlay-image'

const TEMP_PATH = {
  item: config.uploadimageDir,
  watermark: config.uploadWatermarkDir
}

export default {
  post: [
    async (req, res, next) => {
      const { requestid: requestId } = req.params

      await fs.ensureDir(`${ config.zipResultDir }/${ requestId }`)

      const folderZipResult = await path.resolve(`${ config.zipResultDir }/${ requestId }`)

      await fs.ensureDir(`${ config.imageResultDir }/${ requestId }`)

      const { bucket, s3Key, config: { gravity } } = await configImage.get(requestId)

      const files = await fsNode.readdirSync(path.resolve(`${ TEMP_PATH[ 'item' ] }/${ requestId }`))

      await files.reduce(async (all, file) => {

        const filePath = path.resolve(`${ TEMP_PATH[ 'item' ] }/${ requestId }`, file)

        const onputFilePath = await path.resolve(`${ config.imageResultDir }/${ requestId }/${ file }`)

        const watermarkFile = fsNode.readdirSync(path.resolve(`${ TEMP_PATH[ 'watermark' ] }/${ requestId }`))[0]

        const watermarkPath = path.resolve(`${ TEMP_PATH[ 'watermark' ] }/${ requestId }`, watermarkFile)

        await overlayImage(filePath, watermarkPath, onputFilePath, gravity)
      },{})

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
