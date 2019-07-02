import fs from 'fs-extra'
import gm from 'gm'
import path from 'path'
import promise from 'bluebird'
import uuid from 'uuid'

import config from 'infrastructure/config'

const imageMagick = gm.subClass({ imageMagick: true })

promise.promisifyAll(gm.prototype)

const overlay = async (id, inputImage, watermark, onputFileName) => {
  await fs.ensureDir(`${ config.imageResultDir }/${ id }`)

  const onputImage = await path.resolve(`${ config.imageResultDir }/${ id }/${ onputFileName }`)

  await imageMagick(inputImage)
    .autoOrient()
    .resize(600, 800)
    .draw("image Over 50,30 200, 200 "+`'${ watermark }'`)
    .writeAsync(onputImage)

  // await gm('./input.png')
  //   .autoOrient()
  //   .resize(600, 800)
  //   .draw("image Over 50,30 100, 30 './logo.png'")
  //   .writeAsync('./output.png')
}

export default overlay
