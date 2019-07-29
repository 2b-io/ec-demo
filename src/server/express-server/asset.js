import express from 'express'
import fs from 'fs-extra'
import path from 'path'

import config from 'infrastructure/config'

export default (app) => {
  const manifest = fs.readJsonSync(path.resolve(config._root, '../../data/dist/manifest.json'))
  console.log('config.image', config.image)
  app.locals.__asset = (file) => manifest[file]
  app.use('/download', express.static(config.zipResultDir))
  app.use('/img', express.static(config.imgDir))

  return app
}
