import bodyParser from 'body-parser'
import promise from 'bluebird'
import formidable from 'formidable'
import fs from 'fs-extra'
import fsNode from 'fs'
import ms from 'ms'
import path from 'path'
import uuid from 'uuid'

import config from 'infrastructure/config'
import cache from 'services/cache'
import cacheRequest from 'services/cache-request'
import configImage from 'services/config-image'

const TEMP_PATH = {
  image: config.uploadimageDir,
  watermark: config.uploadWatermarkDir
}

export default {
  post: [
    async (req, res, next) => {
      let s3OriginImages = []

      const { filetype, gravity } = req.headers

      const { requestid: requestId } = req.params

      cacheRequest.create(requestId)

      const form = new formidable.IncomingForm()

      await fs.ensureDir(`${ TEMP_PATH[ filetype ] }/${ requestId }`)

      form.parse(req, async (err, fields, files) => {
        if (err) return next(err)

        const basename = fields.name.toLowerCase()

        const ext = path.extname(basename)

        let storePath

        if (filetype === 'image' && ext === '.zip') {
          storePath = path.resolve(`${ TEMP_PATH[ filetype ] }/${ requestId }`, `${ requestId }${ ext }`)
        }

        if (ext !== '.zip') {
          if (filetype === 'image') {
            storePath = path.resolve(`${ TEMP_PATH[ filetype ] }/${ requestId }`, `${ basename }`)
          } else {
            storePath = path.resolve(`${ TEMP_PATH[ filetype ] }/${ requestId }`, `${ requestId }${ ext }`)
          }
        }

        await configImage.create(requestId, '', '', { gravity })

        const tempPath = files.file.path
        const chunk = parseInt(fields.chunk, 10)
        const chunks = parseInt(fields.chunks, 10)

        const rs = fs.createReadStream(tempPath)
        const ws = fs.createWriteStream(storePath, { flags: 'a' })

        ws.on('close', async (err) => {
          if (err) return next(err)

          fs.unlinkSync(tempPath)
          if (chunk <= chunks - 1) {
            return res.sendStatus(200)
          }
        })

        ws.on('error', err => next(err))

        rs.pipe(ws)
      })
    },
    (error, req, res, next) => {
      console.log('error', error)
      res.sendStatus(500)
    }
  ]
}
