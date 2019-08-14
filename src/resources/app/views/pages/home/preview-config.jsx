import React from 'react'
import styled, { css } from 'styled-components'
import defaultWatermark from 'img/image-preview.jpg'
import iconWatermark from 'img/icon-watermark.jpg'

import { PrimaryButton, Break } from 'app/ui/elements'

const Wrapper = styled.div`
  text-align: right;
`
const Preview = styled.div`
  max-height: 300px;
  max-width: 300px;
`

const FramePreview = styled.div`
  position: relative;
  display: table-cell;
  ${
    ({ width, height }) => ( width && height ) ? css`
      width: ${ width }px;
      height: ${ height }px;
    ` :
    css`
      width: auto;
      height: auto;
    `
  }
`

const ImageLivePreview = styled.img`
  max-height: 300px;
  margin: 0 auto;
  display: block;
  ${
    ({ width, height }) => css`
      width: ${ width }px;
      height: ${ height }px;
    `
  }
`

const Watermark = styled.img.attrs( props => {
  src: props.src
})`
  display: block;
  position: absolute;
  ${
    ({ paddingTop = 0,
      paddingLeft = 0,
      paddingRight = 0,
      paddingBottom = 0,
      top,
      left,
      right,
      bottom,
      opacity = 1,
      transform,
    }) => css`
      padding-top: ${ paddingTop }px;
      padding-left: ${ paddingLeft }px;
      padding-right: ${ paddingRight }px;
      padding-bottom: ${ paddingBottom }px;
      opacity: ${ opacity };
      top: ${ top };
      left: ${ left };
      right: ${ right };
      bottom: ${ bottom };
      transform: ${ transform };
    `
  }
`

const loadImage = (src) => {
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

class PreviewImage  extends React.Component {

  constructor(props) {
    super(props)

    this.state = {
      ratioWithWatermarkH: 'auto',
      ratioWithWatermarkW: 'auto'
    }
  }

  async componentDidUpdate(prevProps) {
    if (
      prevProps.defaultPreviewImage !== this.props.defaultPreviewImage ||
      prevProps.templateWidth !== this.props.templateWidth
    ) {
      let img

      if (this.props.defaultPreviewImage) {
        img = await loadImage(this.props.defaultPreviewImage)
      }
      else {
        img = await loadImage(defaultWatermark)
      }
      if (this.props.templateHeight < img.height || this.props.templateWidth < img.width) {
        let ratioWithWatermarkH = (300 / img.height) * this.props.templateHeight || 'auto'
        let ratioWithWatermarkW = (300 / img.width) * this.props.templateWidth || 'auto'

        this.setState({
          ratioWithWatermarkH,
          ratioWithWatermarkW
        })
      } else {
        let ratioWithImageH = (300 / this.props.templateHeight) * img.height || 'auto'
        let ratioWithImageW = (300 / this.props.templateWidth) * img.width || 'auto'

        this.setState({
          ratioWithImageH,
          ratioWithImageW
        })
      }
    }
  }

  render() {
    const {
      gravity = 'NorthWest',
      padding,
      opacity,
      templatePreview,
      imagePreviews,
      imagesPreview,
      previewImage,
      defaultPreviewImage,
      templateWidth,
      templateHeight
    } = this.props

    const {
      ratioWithWatermarkH,
      ratioWithWatermarkW,
      ratioWithImageW,
      ratioWithImageH
    } = this.state

    let top
    let left
    let right
    let bottom

    let paddingTop = 0
    let paddingLeft = 0
    let paddingRight = 0
    let paddingBottom = 0

    let transform

    const paddingTopRatio = padding.top*100/125
    const paddingLeftRatio = padding.left*100/125
    const paddingRightRatio = padding.right*100/125
    const paddingBottomRatio = padding.bottom*100/125

    switch (gravity) {
      case 'NorthWest':
        paddingTop = Number(paddingTopRatio) || 0
        paddingLeft = Number(paddingLeftRatio) || 0
        top = 0
        break;
      case 'North':
        paddingTop = Number(paddingTopRatio) || 0
        left = '50%'
        transform = 'translateX(-50%)'
        break;
      case 'NorthEast':
        paddingTop = Number(paddingTopRatio) || 0
        paddingRight = Number(paddingRightRatio) || 0
        right = '0'
        break;
      case 'West':
        top = '50%'
        left = '0'
        paddingLeft = Number(paddingLeftRatio) || 0
        transform = 'translateY(-50%)'
        break;
      case 'Center':
        top = '50%'
        left = '50%'
        paddingTop = Number(paddingTopRatio) || 0
        paddingLeft = Number(paddingLeftRatio) || 0
        paddingRight = Number(paddingRightRatio) || 0
        paddingBottom = Number(paddingBottomRatio) || 0
        transform = 'translate(-50%,-50%)'
        break;
      case 'East':
        paddingRight = Number(paddingRightRatio) || 0
        right = '0'
        top = '50%'
        transform = 'translateY(-50%)'
        break;
      case 'SouthWest':
        paddingLeft = Number(paddingLeftRatio) || 0
        left = '0'
        bottom = '0'
        break;
      case 'South':
        paddingBottom = Number(paddingBottomRatio) || 0
        left = '50%'
        bottom = '0'
        transform = 'translateX(-50%)'
      break;
      case 'SouthEast':
        paddingBottom = Number(paddingBottomRatio) || 0
        paddingRight = Number(paddingRightRatio) || 0
        right = '0'
        bottom = '0'
        break;
    }

    let _imagePreview

    if (previewImage) {
      _imagePreview = previewImage
    } else {
      _imagePreview = defaultWatermark
    }
    if (defaultPreviewImage && !previewImage) {
      _imagePreview = defaultPreviewImage
    }

    return (
      <Wrapper>
        <Preview>
          <FramePreview
            width={ ratioWithImageW }
            height={ ratioWithImageH }
            >
            <Watermark
              height = { ratioWithWatermarkH }
              width = { ratioWithWatermarkW }
              src={ templatePreview.length ? templatePreview : iconWatermark }
              top={ top }
              left={ left }
              right={ right }
              bottom={ bottom }
              paddingTop={ paddingTop }
              paddingLeft={ paddingLeft }
              paddingRight={ paddingRight }
              paddingBottom={ paddingBottom }
              opacity={ opacity }
              transform={ transform }
              >
            </Watermark>
            <ImageLivePreview
              width={ ratioWithImageW }
              height={ ratioWithImageH }
              src={ _imagePreview }
             />
          </FramePreview>
        </Preview>
      </Wrapper>
    )
  }
}

export default PreviewImage
