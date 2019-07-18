import bodyParser from 'body-parser'
import promise from 'bluebird'
import formidable from 'formidable'
import fs from 'fs-extra'
import fsNode from 'fs'
import ms from 'ms'
import path from 'path'
import uuid from 'uuid'

import mime from 'mime-types'

import config from 'infrastructure/config'
import cache from 'services/cache'
import configImage from 'services/config-image'

const TEMP_PATH = {
  item: config.uploadimageDir,
  watermark: config.uploadWatermarkDir
}

export default {
  post: [
    async (req, res, next) => {
      let s3OriginImages = []

      const { filetype, gravity } = req.headers

      const { requestid: requestId } = req.params

      const form = new formidable.IncomingForm()

      await fs.ensureDir(`${ TEMP_PATH[ filetype ] }/${ requestId }`)

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
          storePath = path.resolve(`${ TEMP_PATH[ filetype ] }/${ requestId }`, `${ uuid.v4(basename) }${ ext }`)

          // upload images to s3
          contentType = mime.lookup(String(storePath))

          const s3OriginImage = await cache.put(`${ requestId }/images/${ uuid.v4() }`, tempPath, contentType)

        } else {
          storePath = path.resolve(`${ TEMP_PATH[ filetype ] }/${ requestId }`, `${ requestId }${ ext }`)
          // upload  watermark to s3
          contentType = mime.lookup(String(storePath))

          const s3Watermark = await cache.put(`${ requestId }/watermark/${ uuid.v4() }`, tempPath, contentType)

          if (s3Watermark) {
            const { Key, Bucket } = s3Watermark

            await configImage.create(requestId, Bucket, Key, { gravity })
          }
        }

        const rs = fs.createReadStream(tempPath)
        const ws = fs.createWriteStream(storePath, { flags: 'a' })

        ws.on('close', async (err) => {
          if (err) return next(err)

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
