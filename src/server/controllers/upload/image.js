import bodyParser from 'body-parser'
import promise from 'bluebird'
import formidable from 'formidable'
import fs from 'fs-extra'
import fsNode from 'fs'
import ms from 'ms'
import path from 'path'
import uuid from 'uuid'
import zipFolder from 'zip-folder'
import mime from 'mime-types'

import config from 'infrastructure/config'
import cache from 'services/cache'
import configImage from 'services/config-image'
import overlayImage from 'services/overlay-image'

const TEMP_PATH = {
  item: config.uploadimageDir,
  watermark: config.uploadWatermarkDir
}

export default {
  post: [
    async (req, res, next) => {
      let s3OriginImages = []

      const { id, filetype, gravity } = req.headers

      const form = new formidable.IncomingForm()

      await fs.ensureDir(`${ TEMP_PATH[ filetype ] }/${ id }`)

      form.parse(req, async (err, fields, files) => {
        if (err) return next(err)
        const basename = fields.name.toLowerCase()
        const ext = path.extname(basename)

        let storePath

        let contentType

        const tempPath = files.file.path

        const chunk = parseInt(fields.chunk, 10)
        const chunks = parseInt(fields.chunks, 10)

        if (filetype === 'item') {
          storePath = path.resolve(`${ TEMP_PATH[ filetype ] }/${ id }`, `${ uuid.v4(basename) }${ ext }`)

          // upload images to s3
          contentType = mime.lookup(String(storePath))

          const s3OriginImage = await cache.put(`${ id }/images/${ uuid.v4() }`, tempPath, contentType)

        } else {
          storePath = path.resolve(`${ TEMP_PATH[ filetype ] }/${ id }`, `${ id }${ ext }`)
          // upload  watermark to s3
          contentType = mime.lookup(String(storePath))

          const s3Watermark = await cache.put(`${ id }/watermark/${ uuid.v4() }`, tempPath, contentType)

          if (s3Watermark) {
            const { Key, Bucket } = s3Watermark

            const configId = await configImage.create(Bucket, Key, { gravity })

          }
        }

        const rs = fs.createReadStream(tempPath)
        const ws = fs.createWriteStream(storePath, { flags: 'a' })

        ws.on('close', async (err) => {
          if (err) return next(err)
          await fs.ensureDir(`${ config.zipResultDir }/${ id }`)

          const folderZipResult = await path.resolve(`${ config.zipResultDir }/${ id }`)

          if (filetype === 'item') {
            await fs.ensureDir(`${ config.imageResultDir }/${ id }`)

            await fsNode.readdirSync(path.resolve(`${ TEMP_PATH[ filetype ] }/${ id }`)).forEach(async (file) => {
              const filePath = path.resolve(`${ TEMP_PATH[ 'item' ] }/${ id }`, file)

              const onputFilePath = await path.resolve(`${ config.imageResultDir }/${ id }/${ file }`)

              const watermarkFile = fsNode.readdirSync(path.resolve(`${ TEMP_PATH[ 'watermark' ] }/${ id }`))[0]

              const watermarkPath = path.resolve(`${ TEMP_PATH[ 'watermark' ] }/${ id }`, watermarkFile)

              await overlayImage(filePath, watermarkPath, onputFilePath, gravity)
            })

            const folderImangeResult = path.resolve(`${ config.imageResultDir }/${ id }`)

            // zipFolder(folderImangeResult, `${ folderZipResult }/${ id }.zip`, (err) => {
            //   if(err) {
            //       console.log('Zip error', err)
            //   } else {
            //       console.log('Zip done')
            //   }
            // })
          }

          fs.unlinkSync(tempPath)

          return res.sendStatus(200)

        })

        ws.on('error', err => next(err))

        rs.pipe(ws)
      })
    },
    (error, req, res, next) => {
      console.log(error, error)
      res.sendStatus(500)
    }
  ]
}