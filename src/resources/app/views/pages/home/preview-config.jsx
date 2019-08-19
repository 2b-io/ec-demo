import React from 'react'
import styled, { css } from 'styled-components'
import defaultWatermark from 'img/image-preview.jpg'
import iconWatermark from 'img/icon-watermark.jpg'

import { PrimaryButton, Break } from 'app/ui/elements'
import imageSize from 'app/services/image-size'

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
  max-height: 300px;
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

class PreviewImage  extends React.Component {

  constructor(props) {
    super(props)

    this.state = {
      ratioWithWatermarkH: 'auto',
      ratioWithWatermarkW: 'auto'
    }
  }

  async componentDidUpdate(prevProps) {
    if (prevProps.templatePreview !== this.props.templatePreview) {
      let _sizeTemplate = await imageSize(this.props.templatePreview)

      this.props.sizeTemplate(_sizeTemplate)
    }

    if (
      prevProps.templatePreview !== this.props.templatePreview ||
      prevProps.defaultPreviewImage !== this.props.defaultPreviewImage ||
      prevProps.templateWidth !== this.props.templateWidth ||
      prevProps.percentTemplate !== this.props.percentTemplate ||
      prevProps.widthTemplate !== this.props.widthTemplate ||
      prevProps.heightTemplate !== this.props.heightTemplate
    ) {
      let img
      let _sizeTemplate = await imageSize(this.props.templatePreview)

      const heightTemplateView = Math.round((_sizeTemplate.height * this.props.percentTemplate) / 100 )
      const widthTemplateView = Math.round((_sizeTemplate.width * this.props.percentTemplate) / 100 )

      if (this.props.defaultPreviewImage) {
        img = await imageSize(this.props.defaultPreviewImage)
      }
      else {
        img = await imageSize(defaultWatermark)
      }

      if (this.props.heightTemplate < img.height || this.props.widthTemplate < img.width) {
        if (this.props.modeResize === 'pixel') {
          this.setState({
            ratioWithWatermarkW: (this.props.widthTemplate / 300) * 100,
            ratioWithWatermarkH: 'auto'
          })
          return
        }
      }

      if (heightTemplateView < img.height || widthTemplateView < img.width ) {
        this.setState({
          ratioWithWatermarkW: ((widthTemplateView * 300) / 100),
          ratioWithWatermarkH: 'auto'
        })
        return
      }

      if (this.props.templateHeight > img.height || this.props.templateWidth > img.width) {
        this.setState({
          ratioWithWatermarkH: this.state.ratioWithImageH,
          ratioWithWatermarkW: this.state.ratioWithImageW
        })
      }

      if (heightTemplateView > img.height || widthTemplateView > img.width) {
        this.setState({
          ratioWithWatermarkW: 'auto',
          ratioWithWatermarkH: 'auto'
        })
      }

      if (heightTemplateView < img.height || widthTemplateView < img.width) {
        this.setState({
          ratioWithWatermarkW: (300 / img.width) * widthTemplateView,
          ratioWithWatermarkH: (300 / img.height) * heightTemplateView
        })

        return
      }

      if (this.props.widthTemplate !== prevProps.widthTemplate || this.props.heightTemplate !== prevProps.heightTemplate) {
        if (this.props.widthTemplate > img.width || this.props.heightTemplate > img.height) {
          this.setState({
            ratioWithWatermarkW: 'auto',
            ratioWithWatermarkH: 'auto'
          })
        }

        if (this.props.widthTemplate < img.height || this.props.heightTemplate < img.width) {
          this.setState({
            ratioWithWatermarkW:(300 / img.width) * this.props.widthTemplate,
            ratioWithWatermarkH:(300 / img.height) * this.props.heightTemplate,
          })
        }
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
      templateHeight,
      ratioWithImageW,
      ratioWithImageH
    } = this.props

    const {
      ratioWithWatermarkH,
      ratioWithWatermarkW,
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
