import fs from 'fs-extra'
import gm from 'gm'
import path from 'path'
import promise from 'bluebird'
import mime from 'mime-types'
import uuid from 'uuid'

import config from 'infrastructure/config'


promise.promisifyAll(gm.prototype)

const resizeWatermark = async (
  imagePath,
  watermarkPath,
  modeResize,
  heightWatermark,
  widthWatermark,
  percent,
  heightPercentWatermark,
  widthPercentWatermark,
  requestId
) => {
  console.log('RESIZE_WATERMARK_START...', watermarkPath)

  const {
    width: widthOriginImage,
    height: heightOriginImage
  } = await gm(imagePath).sizeAsync()
    const ratioOriginImage = widthOriginImage / heightOriginImage
    const ext = mime.extension(mime.lookup(watermarkPath))
    await fs.ensureDir(`${ config.s3DownloadDir }/${ requestId }/watermarkResize`)
    const watermarkPathResize = await path.resolve(`${ config.s3DownloadDir }/${ requestId }/watermarkResize/${ uuid.v4() }.${ ext }`)

    let widthWatermarkNew = widthOriginImage * (percent / 100 )
    let heightWatermarkNew = heightOriginImage * (percent / 100 )

    if (modeResize === 'noKeepRatioPercent') {
      const heightWatermarkByRatio = heightOriginImage * (heightPercentWatermark / 100)
      const widthWatermarkByRatio = widthOriginImage * (widthPercentWatermark / 100)

      await gm(watermarkPath).resize(widthWatermarkByRatio, heightWatermarkByRatio,"!").writeAsync(watermarkPathResize)
    }

    if (modeResize === 'percent' || modeResize === 'keepRatioPercent') {
      if (ratioOriginImage > 1) {
        await gm(watermarkPath).resize(null, heightWatermarkNew).writeAsync(watermarkPathResize)
      } else {
        await gm(watermarkPath).resize(widthWatermarkNew, null).writeAsync(watermarkPathResize)
      }
    }

    if (modeResize === 'pixel'|| modeResize === 'keepPercentPixel') {
      await gm(watermarkPath).resize(widthWatermark, heightWatermark).writeAsync(watermarkPathResize)
    }

    if (modeResize === 'noKeepPercentPixel') {
      await gm(watermarkPath).resize(widthWatermark, heightWatermark,"!").writeAsync(watermarkPathResize)
    }

    console.log('RESIZE_WATERMARK_DONE...', watermarkPath)

    return watermarkPathResize
}

export default resizeWatermark
