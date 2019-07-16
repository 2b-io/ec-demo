import { NOT_FOUND } from 'http-status-codes'
import serializeError from 'serialize-error'

import * as controllers from 'controllers'
import config from 'infrastructure/config'

const safeController = (controller) => {
  if (Array.isArray(controller)) {
    return controller.map(safeController)
  }

  return async (req, res, next) => {
    try {
      await controller(req, res, next)
    } catch (e) {
      console.error(e)

      next(e)
    }
  }
}

export default (app) => {
  // config
  app.locals.googleRecaptchaSiteKey = config.googleRecaptchaSiteKey
  app.locals.googleAnalyticsId = config.googleAnalyticsId
  app.locals.cdn = config.devMode ? '' : config.cdn

  // view helpers
  app.get('/', controllers.home.get)

  app.get('/upload/:requestid', controllers.identifier.get)
  app.post('/upload/:requestid/image', controllers.image.post)
  app.post('/upload/:requestid/image/process', controllers.handler.post)

  app.get('/result/:requestid', controllers.result.get)

  app.use((req, res, next) => {
    if (config.devMode) {
      return res.sendStatus(NOT_FOUND)
    }

    res.redirect('/')
  })

  app.use((error, req, res, next) => {
    if (config.devMode) {
      return res.sendStatus(500).end(serializeError(error))
    }

    return res.redirect('/')
  })
}
