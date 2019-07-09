import bodyParser from 'body-parser'
import promise from 'bluebird'
import formidable from 'formidable'
import fs from 'fs-extra'
import fsNode from 'fs'
import ms from 'ms'
import path from 'path'
import uuid from 'uuid'
import zipFolder from 'zip-folder'

import config from 'infrastructure/config'
import cache from 'services/cache'
import overlayImage from 'services/overlay-image'

const TEMP_PATH = {
  item: config.uploadimageDir,
  watermark: config.uploadWatermarkDir
}

export default {
  post: [
    async (req, res, next) => {
      const { id, filetype, gravity } = req.headers

      const form = new formidable.IncomingForm()

      await fs.ensureDir(`${ TEMP_PATH[ filetype ] }/${ id }`)

      form.parse(req, async (err, fields, files) => {
        if (err) return next(err)

        const basename = fields.name.toLowerCase()
        const ext = path.extname(basename)

        let storePath ;

        const tempPath = files.file.path

        if (filetype === 'item') {
          storePath = path.resolve(`${ TEMP_PATH[ filetype ] }/${ id }`, `${ uuid.v4(basename) }${ ext }`)
          // upload images to s3
          await cache.put(`${ id }/images/${ uuid.v4() }`, tempPath)
        } else {
          storePath = path.resolve(`${ TEMP_PATH[ filetype ] }/${ id }`, `${ id }${ ext }`)
          // upload  watermark to s3
          await cache.put(`${ id }/watermark/${ uuid.v4() }`, tempPath)
        }

        const rs = fs.createReadStream(tempPath)
        const ws = fs.createWriteStream(storePath, { flags: 'a' })

        ws.on('close', async (err) => {
          if (err) return next(err)
          await fs.ensureDir(`${ config.zipResultDir }/${ id }`)

          const folderZipResult = await path.resolve(`${ config.zipResultDir }/${ id }`)

          fs.unlinkSync(tempPath)

          if (filetype === 'item') {
            await fs.ensureDir(`${ config.imageResultDir }/${ id }`)

            let imageResult

            await fsNode.readdirSync(path.resolve(`${ TEMP_PATH[ filetype ] }/${ id }`)).forEach(async (file) => {
              const filePath = path.resolve(`${ TEMP_PATH[ 'item' ] }/${ id }`, file)

              const watermarkFile = fsNode.readdirSync(path.resolve(`${ TEMP_PATH[ 'watermark' ] }/${ id }`))[0]

              const watermarkPath = path.resolve(`${ TEMP_PATH[ 'watermark' ] }/${ id }`, watermarkFile)

              const onputFilePath = await path.resolve(`${ config.imageResultDir }/${ id }/${ file }`)

              imageResult = await overlayImage(filePath, watermarkPath, onputFilePath, gravity)
            })

            const folderImangeResult = path.resolve(`${ config.imageResultDir }/${ id }`)

            zipFolder(folderImangeResult, `${ folderZipResult }/${ id }.zip`, (err) => {
              if(err) {
                  console.log('Zip error', err)
              } else {
                  console.log('Zip done')
              }
            })
          }

          return res.sendStatus(200)
        })

        ws.on('error', err => next(err))

        rs.pipe(ws)
      })
    },
    (error, req, res, next) => {
      console.log('error', error);
      res.sendStatus(500)
    }
  ]
}
