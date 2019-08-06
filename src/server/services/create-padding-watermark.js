import fs from 'fs-extra'
import gm from 'gm'
import promise from 'bluebird'

import config from 'infrastructure/config'

promise.promisifyAll(gm.prototype)

const createPaddingImage = async (requestId, {
    paddingTop = 0,
    paddingLeft = 0,
    paddingRight = 0,
    paddingBottom = 0
  },
  watermarkPath) => {

    await fs.ensureDir(`${ config.watermarkPaddingDir }/${ requestId }`)
    const transparentImagePath = `${ config.watermarkPaddingDir }/${ requestId }/transparentImage.png`

    const {
      width: widthOriginWatermark,
      height: heightOriginWatermark
    } = await gm(watermarkPath).sizeAsync()

    const width = Number(paddingLeft) + Number(paddingRight) + Number(widthOriginWatermark)
    const height = Number(paddingTop) + Number(paddingBottom) + Number(heightOriginWatermark)
    //  Create image transparent

    await gm(width,height,"Transparent")
    .writeAsync(transparentImagePath)

    await gm(transparentImagePath)
      .autoOrient()
      .draw("image Over "+`${ paddingTop },${ paddingLeft } ${ widthOriginWatermark },${ heightOriginWatermark } '${ watermarkPath }'`)
      .writeAsync(watermarkPath)
}

export default createPaddingImage
