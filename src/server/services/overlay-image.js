import gm from 'gm'
import promise from 'bluebird'

import paddingWatermark from './create-padding-watermark'
import resizeWatermark from './resize-watermark'

promise.promisifyAll(gm.prototype)

const overlay = async (
  filePath,
  watermarkPath,
  onputFilePath,
  gravity,
  requestId,
  padding = {},
  opacity,
  modeResize,
  heightTemplate,
  widthTemplate,
  percentTemplate
  ) => {

  const paddingTop = Number(padding.paddingTop) || 0
  const paddingLeft = Number(padding.paddingLeft) || 0
  const paddingRight = Number(padding.paddingRight) || 0
  const paddingBottom = Number(padding.paddingBottom) || 0

  if (modeResize && percentTemplate !== 100) {
    await resizeWatermark(
      filePath,
      watermarkPath,
      modeResize,
      heightTemplate,
      widthTemplate,
      percentTemplate
    )
  }

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
