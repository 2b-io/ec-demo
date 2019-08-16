import gm from 'gm'
import promise from 'bluebird'

promise.promisifyAll(gm.prototype)

const resizeWatermark = async (imagePath, watermarkPath, modeResize, heightWatermark, widthWatermark, percent) => {
  const {
    width: widthOriginImage
  } = await gm(imagePath).sizeAsync()

    if (modeResize === 'percent') {
      const widthWatermarkNew = widthOriginImage * (percent / 100 )
      await gm(watermarkPath).resize(String(widthWatermarkNew),null).writeAsync(watermarkPath)
    }

    if (modeResize === 'pixel') {
      await gm(watermarkPath).resize(widthWatermark, heightWatermark).writeAsync(watermarkPath)
    }
}

export default resizeWatermark
