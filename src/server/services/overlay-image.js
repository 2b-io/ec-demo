import gm from 'gm'
import promise from 'bluebird'

import paddingWatermark from './create-padding-watermark'
const imageMagick = gm.subClass({ imageMagick: true })

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
  } = await imageMagick(watermarkPath).sizeAsync()

  await imageMagick(filePath)
    .composite(watermarkPath)
    // .resize(600, 800)
    .gravity(gravity)
    .dissolve(opacity)
    .writeAsync(onputFilePath)

  // await imageMagick(filePath)
  //   .autoOrient()
  //   // .resize(600, 800)
  //   .gravity(gravity)
  //   .draw("image Over "+`0,0 ${ widthWatermark },${ heightWatermark } '${ watermarkPath }'`)
  //   .writeAsync(onputFilePath)

  // await gm('./input.png')
  //   .autoOrient()
  //   .resize(600, 800)
  //   .draw("image Over 50,30 100, 30 './logo.png'")
  //   .writeAsync('./output.png')
}

export default overlay
