import bodyParser from 'body-parser'
import promise from 'bluebird'
import formidable from 'formidable'
import mime from 'mime-types'
import fs from 'fs-extra'
import fsNode from 'fs'
import ms from 'ms'
import path from 'path'
import uuid from 'uuid'
import unzipper from 'unzipper'

import config from 'infrastructure/config'
import cache from 'services/cache'
import s3Cache from 'services/cache'
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

      const {
        filetype,
        gravity,
        paddingtop: paddingTop,
        paddingleft: paddingLeft,
        paddingright: paddingRight,
        paddingbottom: paddingBottom,
        opacity,
        moderesize: modeResize,
        heighttemplate: heightTemplate,
        widthtemplate: widthTemplate,
        percenttemplate: percentTemplate
      } = req.headers

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

        const tempPath = files.file.path
        const chunk = parseInt(fields.chunk, 10)
        const chunks = parseInt(fields.chunks, 10)

        const rs = fs.createReadStream(tempPath)
        const ws = fs.createWriteStream(storePath, { flags: 'a' })

        ws.on('close', async (err) => {
          if (err) return next(err)

          fs.unlinkSync(tempPath)

          if (chunk < chunks - 1) {
            return res.sendStatus(200)
          }

          if (filetype === 'watermark') {
            await configImage.create(
              requestId,
              {
                gravity,
                padding: {
                  paddingTop,
                  paddingLeft,
                  paddingRight,
                  paddingBottom
                },
              opacity,
              modeResize,
              heightTemplate,
              widthTemplate,
              percentTemplate
            })
          }

          const contentType = mime.lookup(storePath)

          //  check file type upload
          if (contentType === 'application/zip') {
            // unzip file image and upload to aws s3
            console.log('START_UNZIP_FILE...')

            const unzipPath = path.resolve(`${ config.uploadimageDir }/${ requestId }`)

            await fs.createReadStream(storePath).pipe(unzipper.Extract({ path: unzipPath })).promise()
            console.log('UNZIP_FILE_DONE...')

            console.log('START_UPLOAD_IMAGE_TO_S3...')

            const images = await fsNode.readdirSync(path.resolve(`${ config.uploadimageDir }/${ requestId }`))

            await Promise.all(images.map(async (file, index) => {
              const imagePath = path.resolve(`${ config.uploadimageDir }/${ requestId }`, file)
              const contentTypeImage = mime.lookup(imagePath)

              // check file type no upload s3 if file type = zip
              if (contentTypeImage !=='application/zip') {
                const s3Image = await s3Cache.put(`${ requestId }/images/${ uuid.v4() }`, imagePath, contentTypeImage)

                const { key: s3ImageKey } = s3Image
                // put image to cache

                const s3Images = cacheRequest.get(requestId).images || []
                s3Images.push(s3ImageKey)
                cacheRequest.update(requestId, 'images', s3Images)
              }
            }))

            //  remove file zip after upload to aws s3
            await fs.remove(storePath)

            res.send('Upload Completed')
          } else {
            // upload file image or watermark to s3
            const s3Image = await s3Cache.put(`${ requestId }/${ filetype }/${ uuid.v4() }`, storePath, contentType)

            const { key: s3ImageKey } = s3Image

            // update s3FileKey to Cache
            if (filetype === 'image') {
              // put image to cache
              const s3Images = cacheRequest.get(requestId).images || []
              s3Images.push(s3ImageKey)
              cacheRequest.update(requestId, 'images', s3Images)
            } else {
            // put watermark to cache
              cacheRequest.update(requestId, 'watermark', s3ImageKey)
            }

            res.send('Upload Completed')
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
