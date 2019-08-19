import gm from 'gm'
import promise from 'bluebird'

promise.promisifyAll(gm.prototype)

const resizeWatermark = async (imagePath, watermarkPath, modeResize, heightWatermark, widthWatermark, percent) => {
  const {
    width: widthOriginImage,
    height: heightOriginImage
  } = await gm(imagePath).sizeAsync()

    if (modeResize === 'noKeepRatioPercent') {
      let widthWatermarkNew = String(widthOriginImage * (percent / 100 )) || null
      let heightWatermarkNew = String(heightOriginImage * (percent / 100 )) || null
      await gm(watermarkPath).resize(widthWatermarkNew, heightOriginImage, "!").writeAsync(watermarkPath)
    }

    if (modeResize === 'percent' || modeResize === 'keepRatioPercent') {
      let widthWatermarkNew = String(widthOriginImage * (percent / 100 )) || null
      await gm(watermarkPath).resize(String(widthWatermarkNew),null).writeAsync(watermarkPath)
    }

    if (modeResize === 'pixel'|| modeResize === 'keepPercentPixel') {
      await gm(watermarkPath).resize(widthWatermark, heightWatermark).writeAsync(watermarkPath)
    }

    if (modeResize === 'noKeepPercentPixel') {
      await gm(watermarkPath).resize(widthWatermark, heightWatermark, "!").writeAsync(watermarkPath)
    }
}

export default resizeWatermark
