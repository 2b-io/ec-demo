import gm from 'gm'
import promise from 'bluebird'

import paddingWatermark from './create-padding-watermark'

promise.promisifyAll(gm.prototype)

const overlay = async (
  filePath,
  watermarkPath,
  onputFilePath,
  gravity,
  requestId,
  {
    paddingTop,
    paddingLeft,
    paddingRight,
    paddingBottom
  },
  opacity) => {

  if (paddingTop || paddingLeft || paddingRight || paddingBottom) {
    await paddingWatermark(requestId, { paddingTop, paddingLeft, paddingRight, paddingBottom }, watermarkPath)
  }

  const {
    width: widthWatermark,
    height: heightWatermark
  } = await gm(watermarkPath).sizeAsync()

  await gm(filePath)
    .composite(watermarkPath)
    // .resize(600, 800)
    .gravity(gravity)
    .dissolve(opacity)
    .writeAsync(onputFilePath)

}

export default overlay
