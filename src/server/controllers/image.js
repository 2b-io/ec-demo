import bodyParser from 'body-parser'
import formidable from 'formidable'
import fs from 'fs-extra'
import fsNode from 'fs'
import ms from 'ms'
import path from 'path'
import uuid from 'uuid'

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

        const storePath = path.resolve(`${ TEMP_PATH[ filetype ] }/${ id }`, `${ uuid.v4(basename) }${ext}`)


        const tempPath = files.file.path

        const rs = fs.createReadStream(tempPath)
        const ws = fs.createWriteStream(storePath, { flags: 'a' })

        ws.on('close', err => {
          if (err) return next(err)

          fs.unlinkSync(tempPath)
          return res.sendStatus(200)
        })

        ws.on('error', err => next(err))

        rs.pipe(ws)
      })
      if (filetype === 'item') {

        await fsNode.readdirSync(path.resolve(`${ TEMP_PATH[ filetype ] }/${ id }`)).forEach(file => {
          console.log(file)
        })
        // const inputImage = path.resolve(`${ TEMP_PATH[ 'item' ] }/ ${ id }`, )
        // const logoImage = path.resolve(`${ TEMP_PATH[ 'watermark' ] }/ ${ id }`, basename)
        // await overlayImage(inputImage, logoImage)
      }
    },
    (error, req, res, next) => {
      console.log('error', error);
      res.sendStatus(500)
    }
  ]
}
