import path from 'path'

const rootDir = path.join(__dirname, '..')

export default {
  // dir
  _root: rootDir,

  imgDir: path.join(rootDir, '../../assets/img'),
  // env
  devMode: process.env.NODE_ENV !== 'production',
  port: process.env.PORT,
  mongodb: process.env.MONGODB,
  assetEndpoint: process.env.ASSET_ENDPOINT,
  cdn: process.env.CDN,
  // google recaptcha
  googleRecaptchaSecretKey: process.env.GOOGLE_RECAPTCHA_SECRET_KEY,
  googleRecaptchaSiteKey: process.env.GOOGLE_RECAPTCHA_SITE_KEY,
  googleRecaptchaUrl: process.env.GOOGLE_RECAPTCHA_URL,
  // google analytics
  googleAnalyticsId: process.env.GOOGLE_ANALYTICS_ID
}
