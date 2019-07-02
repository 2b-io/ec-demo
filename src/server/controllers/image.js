import bodyParser from 'body-parser'
import formidable from 'formidable'
import fs from 'fs-extra'
import fsNode from 'fs'
import ms from 'ms'
import path from 'path'
import uuid from 'uuid'
import zipFolder from 'zip-folder'

import config from 'infrastructure/config'
import overlayImage from 'services/overlay-image'

const TEMP_PATH = {
  item: config.uploadimageDir,
  watermark: config.uploadWatermarkDir
}

export default {
  post: [
    async (req, res, next) => {
      const { id, filetype } = req.headers

      const form = new formidable.IncomingForm()

      await fs.ensureDir(`${ TEMP_PATH[ filetype ] }/${ id }`)

      form.parse(req, (err, fields, files) => {
        if (err) return next(err)

        const basename = fields.name.toLowerCase()
        const ext = path.extname(basename)

        let storePath ;

        if (filetype === 'item') {
          storePath = path.resolve(`${ TEMP_PATH[ filetype ] }/${ id }`, `${ uuid.v4(basename) }${ ext }`)
        } else {
          storePath = path.resolve(`${ TEMP_PATH[ filetype ] }/${ id }`, `${ id }${ ext }`)
        }

        const tempPath = files.file.path

        const rs = fs.createReadStream(tempPath)
        const ws = fs.createWriteStream(storePath, { flags: 'a' })

        ws.on('close', async (err) => {
          if (err) return next(err)
          const folderResult = await path.resolve(`${ config.imageResultDir }/${ id }`)

          fs.unlinkSync(tempPath)

          if (filetype === 'item') {
            await fs.ensureDir(`${ config.imageResultDir }/${ id }`)

            await fsNode.readdirSync(path.resolve(`${ TEMP_PATH[ filetype ] }/${ id }`)).forEach(async (file) => {
              const filePath = path.resolve(`${ TEMP_PATH[ filetype ] }/${ id }`, file)

              const watermarkFile = fsNode.readdirSync(path.resolve(`${ TEMP_PATH[ 'watermark' ] }/${ id }`))[0]

              const watermarkPath = path.resolve(`${ TEMP_PATH[ 'watermark' ] }/${ id }`, watermarkFile)

              const onputFilePath = await path.resolve(`${ config.imageResultDir }/${ id }/${ file }`)

              await overlayImage(filePath, watermarkPath, onputFilePath)
            })

            zipFolder(folderResult, `${ folderResult }/${ id }.zip`, (err) => {
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
