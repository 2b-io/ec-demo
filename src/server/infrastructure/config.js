import path from 'path'

const rootDir = path.join(__dirname, '..')

export default {
  // dir
  _root: rootDir,

  uploadimageDir: process.env.TMP_DIR || path.resolve(rootDir, '../tmp/images'),
  uploadWatermarkDir: process.env.TMP_DIR || path.resolve(rootDir, '../tmp/watermark'),
  imageResultDir: process.env.TMP_DIR || path.resolve(rootDir, '../tmp/imageResult'),

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
  googleAnalyticsId: process.env.GOOGLE_ANALYTICS_ID,

  // uploadDir: path.resolve(__dirname, 'content/upload')
  redis: {
   port: 6379,
   host: '127.0.0.1'
 }
}
