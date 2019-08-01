import fs from 'fs-extra'
import gm from 'gm'
import promise from 'bluebird'

import config from 'infrastructure/config'

const imageMagick = gm.subClass({ imageMagick: true })

promise.promisifyAll(gm.prototype)

const createPaddingImage = async ({
    paddingTop,
    paddingLeft,
    paddingRight,
    paddingBottom
  },
  watermarkPath) => {

    await fs.ensureDir(`${ config.watermarkPaddingDir }`)
    const transparentImagePath = `${ config.watermarkPaddingDir }/${ requestId }/transparent-image.png`

    const { width: widthOriginWatermark, height: heightOriginWatermark} = await gm(watermarkPath).sizeAsync()
    const width = paddingLeft + paddingRight + widthOriginWatermark
    const height = paddingTop + paddingBottom + heightOriginWatermark
    //  Create image transparent

    await gm(width, height, "Transparent")
    .writeAsync(transparentImagePath)

    await gm(transparentImagePath)
      .autoOrient()
      .draw("image Over "+`${paddingTop,paddingLeft} ${width,height} '${ watermarkPath }'`)
      .writeAsync(watermarkPath)

}

export default createPaddingImage
