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
  console.log('OVERLAY_IMAGE_START...')

  const paddingTop = Number(padding.paddingTop) || 0
  const paddingLeft = Number(padding.paddingLeft) || 0
  const paddingRight = Number(padding.paddingRight) || 0
  const paddingBottom = Number(padding.paddingBottom) || 0

  let watermarkPathNew

  if (modeResize) {
    watermarkPathNew = await resizeWatermark(
      filePath,
      watermarkPath,
      modeResize,
      heightTemplate,
      widthTemplate,
      percentTemplate,
      requestId
    )
  }

  if (paddingTop || paddingLeft || paddingRight || paddingBottom) {
    const _watermarkPath = watermarkPathNew ? watermarkPathNew : watermarkPath

    await paddingWatermark(
      requestId,
      {
        paddingTop,
        paddingLeft,
        paddingRight,
        paddingBottom
      },
      _watermarkPath
    )
  }

  if (watermarkPathNew) {
    await gm(filePath)
      .composite(watermarkPathNew)
      .gravity(gravity)
      .dissolve(opacity)
      .writeAsync(onputFilePath)
  } else {
    await gm(filePath)
      .composite(watermarkPath)
      .gravity(gravity)
      .dissolve(opacity)
      .writeAsync(onputFilePath)
  }
}

export default overlay
