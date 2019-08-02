import fs from 'fs-extra'
import gm from 'gm'
import promise from 'bluebird'

import config from 'infrastructure/config'

const imageMagick = gm.subClass({ imageMagick: true })

promise.promisifyAll(gm.prototype)

const createPaddingImage = async (requestId, {
    paddingTop,
    paddingLeft,
    paddingRight,
    paddingBottom
  },
  watermarkPath) => {

    await fs.ensureDir(`${ config.watermarkPaddingDir }/${ requestId }`)
    const transparentImagePath = `${ config.watermarkPaddingDir }/${ requestId }/transparentImage.png`

    const {
      width: widthOriginWatermark,
      height: heightOriginWatermark
    } = await imageMagick(watermarkPath).sizeAsync()

    const width = Number(paddingLeft) + Number(paddingRight) + Number(widthOriginWatermark)
    const height = Number(paddingTop) + Number(paddingBottom) + Number(heightOriginWatermark)
    //  Create image transparent

    await imageMagick(width,height,"Transparent")
    .writeAsync(transparentImagePath)

    console.log("image Over "+`${ paddingTop },${ paddingLeft } ${ width },${ height } '${ watermarkPath }'`)

    await imageMagick(transparentImagePath)
      .autoOrient()
      .draw("image Over "+`${ paddingTop },${ paddingLeft } ${ width },${ height } '${ watermarkPath }'`)
      .writeAsync(watermarkPath)

}

export default createPaddingImage
