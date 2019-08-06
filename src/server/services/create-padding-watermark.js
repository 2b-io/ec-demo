import fs from 'fs-extra'
import gm from 'gm'
import promise from 'bluebird'

import config from 'infrastructure/config'

promise.promisifyAll(gm.prototype)

const createPaddingImage = async (requestId, padding = {}, watermarkPath) => {
    const paddingTop = Number(padding.paddingTop) || 0
    const paddingLeft = Number(padding.paddingLeft) || 0
    const paddingRight = Number(padding.paddingRight) || 0
    const paddingBottom = Number(padding.paddingBottom) || 0
    
    await fs.ensureDir(`${ config.watermarkPaddingDir }/${ requestId }`)
    const transparentImagePath = `${ config.watermarkPaddingDir }/${ requestId }/transparentImage.png`

    const {
      width: widthOriginWatermark,
      height: heightOriginWatermark
    } = await gm(watermarkPath).sizeAsync()

    const width = (Number(paddingLeft) || 0) + (Number(paddingRight) || 0) + Number(widthOriginWatermark)
    const height = (Number(paddingTop) || 0)+ (Number(paddingBottom) || 0) + Number(heightOriginWatermark)
    //  Create image transparent

    await gm(width,height,"Transparent")
    .writeAsync(transparentImagePath)

    await gm(transparentImagePath)
      .autoOrient()
      .draw("image Over "+`${ paddingTop },${ paddingLeft } ${ widthOriginWatermark },${ heightOriginWatermark } '${ watermarkPath }'`)
      .writeAsync(watermarkPath)
}

export default createPaddingImage
