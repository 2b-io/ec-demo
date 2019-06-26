import promise from 'bluebird'
import gm from 'gm'

const imageMagick = gm.subClass({ imageMagick: true })

promise.promisifyAll(gm.prototype)

const overlay = async (inputImage, onputImage, logoImage) => {
  await gm(inputImage)
    .autoOrient()
    .resize(600, 800)
    .draw(`"image Over ${ logoPosition } ${ logoSize } '${ logoImage }'"`)
    .writeAsync(onputImage)

  // await gm('./input.png')
  //   .autoOrient()
  //   .resize(600, 800)
  //   .draw("image Over 50,30 100, 30 './logo.png'")
  //   .writeAsync('./output.png')
}

export default overlay
