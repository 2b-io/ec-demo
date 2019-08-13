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
  width: auto;
  height: auto;
`

const ImageLivePreview = styled.img`
  max-height: 100%;
  margin: 0 auto;
  display: block;
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

const ImageIntro = styled.div`
  margin: auto;
  padding-top: 8px;
  max-width: 1200px;
`
const Description = styled.div`
  margin: auto;
`

const DescriptionTitle = styled.h1`
  font-size: 22px;
  font-weight: 600;
  text-transform: uppercase;
  padding-bottom: 16px;
`

class PreviewImage   extends React.Component {
  constructor(props) {
    super(props)

    this.imageLivePreview = React.createRef()
    this.watermarkLivePreview = React.createRef()
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
      defaultPreviewImage
    } = this.props
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

    let ratioWithWatermarkH = 'auto'
    let ratioWithWatermarkW = 'auto'

    if (this.imageLivePreview.current && this.watermarkLivePreview.current) {
      if (this.imageLivePreview.current.naturalHeight) {
        ratioWithWatermarkH = ( 300 / this.imageLivePreview.current.naturalHeight) * this.watermarkLivePreview.current.naturalHeight
        ratioWithWatermarkW = ( 300 / this.imageLivePreview.current.naturalWidth) * this.watermarkLivePreview.current.naturalWidth
      }
    }

    return (
      <Wrapper>
        <Preview>
          <FramePreview>
            <Watermark
              height = { ratioWithWatermarkH }
              width = { ratioWithWatermarkW }
              ref={ this.watermarkLivePreview }
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
              ref={ this.imageLivePreview }
              src={ _imagePreview }
             />
          </FramePreview>
        </Preview>
      </Wrapper>
    )
  }
}

export default PreviewImage
