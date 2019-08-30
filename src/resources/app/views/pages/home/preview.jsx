import React from 'react'
import styled, { css } from 'styled-components'

import { PrimaryButton, Break } from 'app/ui/elements'

const Wrapper = styled.div`
  display: inline-block;
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
  overflow: hidden;
`

const Image = styled.img`
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
    ({ modeResize }) => modeResize !== 'keepRatioPercent' ? '' : css`height: auto`
  }
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
      modeResize,
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
  };
  max-width: none
`

class PreviewImage extends React.Component {

  constructor(props) {
    super(props)
  }

  paddingRatio(padding, gravity) {
    let top
    let left
    let right
    let bottom

    let paddingTop = 0
    let paddingLeft = 0
    let paddingRight = 0
    let paddingBottom = 0

    let transform
    const paddingTopRatio = padding.top
    const paddingLeftRatio = padding.left
    const paddingRightRatio = padding.right
    const paddingBottomRatio = padding.bottom

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

    return {
      top,
      left,
      right,
      bottom,
      paddingTop,
      paddingLeft,
      paddingRight,
      paddingBottom,
      transform
    }
  }

  render() {
    const {
      top,
      left,
      right,
      bottom,
      paddingTop,
      paddingLeft,
      paddingRight,
      paddingBottom,
      transform,
    } = this.paddingRatio(this.props.padding, this.props.gravity)

    const {
      heightWatermark,
      widthWatermark,
      widthWatermarkByRatio,
      heightWatermarkByRatio,
    } = this.props

    const widthWatermarkPreview = widthWatermarkByRatio ? widthWatermarkByRatio : widthWatermark
    const heightWatermarkPreview = heightWatermarkByRatio ? heightWatermarkByRatio : heightWatermark

    console.log('modeResize', this.props.modeResize);
    console.log('widthWatermarkPreview', widthWatermarkPreview);
    console.log('heightWatermarkPreview', heightWatermarkPreview);
    return (
      <Wrapper>
        <Preview>
          <FramePreview
            >
            <Watermark
              height={ heightWatermarkPreview }
              width={ widthWatermarkPreview }
              src={ this.props.watermarkSrc }
              top={ top }
              left={ left }
              right={ right }
              bottom={ bottom }
              paddingTop={ paddingTop }
              paddingLeft={ paddingLeft }
              paddingRight={ paddingRight }
              paddingBottom={ paddingBottom }
              opacity={ this.props.opacity }
              transform={ transform }
              modeResize={ this.props.modeResize }
              >
            </Watermark>
            <Image
              src={ this.props.imageSrc }
             />
          </FramePreview>
        </Preview>
      </Wrapper>
    )
  }
}

export default PreviewImage
