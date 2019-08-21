const imageSize = (src) => {
  if (!src) {
    return {
      height: 0,
      width: 0
    }
  }

  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = (event) => resolve({
      height: event.path[ 0 ].height,
      width: event.path[ 0 ].width
    })
    img.onerror = reject
    img.src = src
  })
}

export default imageSize
