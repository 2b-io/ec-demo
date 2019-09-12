import React from 'react'
import styled, { css } from 'styled-components'

import { PrimaryButton, Break } from 'app/ui/elements'

const Wrapper = styled.div`
  display: inline-block;
`
const Preview = styled.div`
  max-height: 450px;
  max-width: 450px;
`

const WatermarkPadding = styled.div`
  position: absolute;

  ${ ({
    top,
    left,
    right,
    bottom,
    paddingTop,
    paddingLeft,
    paddingRight,
    paddingBottom
  }) => {
    const _top = typeof(top) === 'number' ? `${ top }px` : top;
    const _left = typeof(left) === 'number' ? `${ left }px` : left;
    const _right = typeof(right) === 'number' ? `${ right }px` : right;
    const _bottom = typeof(bottom) === 'number' ? `${ bottom }px` : bottom;

    return css`
      top: ${ _top };
      left: ${ _left };
      right: ${ _right };
      bottom: ${ _bottom };
      padding-top: ${ paddingTop }px;
      padding-left: ${ paddingLeft }px;
      padding-right: ${ paddingRight }px;
      padding-bottom: ${ paddingBottom }px;
      `
    }
  }
  ${
    ({
      transform,
    }) => css`
          transform: ${ transform };
        `
    }
  };
`

const FramePreview = styled.div`
  position: relative;
  display: table-cell;
  width: auto;
  height: auto;
  overflow: hidden;
`

const Image = styled.img`
  max-height: 450px;
  margin: 0 auto;
  display: block;
`

const Watermark = styled.img.attrs( props => {
  src: props.src
})`
  display: block;

  ${
    ({ modeResize, paddingTop, paddingLeft, paddingRight, paddingBottom }) => {
      if (paddingTop || paddingBottom) {
        return css`height: auto`
      }
      if (paddingLeft || paddingRight) {
        return css`width: auto`
      }
    }
  }
  ${
    ({ paddingTop = 0,
      paddingLeft = 0,
      paddingRight = 0,
      paddingBottom = 0,
      opacity = 1,
      transform,
    }) => css`

          opacity: ${ opacity };
        `
    }
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
        paddingTop = paddingTopRatio
        paddingLeft = paddingLeftRatio
        paddingRight = paddingRightRatio
        paddingBottom = paddingBottomRatio
        transform = 'translate(-50%,-50%)'
        break;
      case 'East':
        paddingRight = Number(paddingRightRatio) || 0
        right = '0'
        top = '50%'
        transform = 'translateY(-50%)'
        break;
      case 'SouthWest':
        paddingBottom = Number(paddingBottomRatio) || 0
        paddingLeft = Number(paddingLeftRatio) || 0
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
        bottom = '0'
        right = '0'
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
      heightWatermark,
      widthWatermark,
      widthWatermarkByRatio,
      heightWatermarkByRatio,
      gravity,
      padding,
      widthImagePreivew,
      heightImagePreivew
    } = this.props

    let {
      top,
      left,
      right,
      bottom,
      paddingTop,
      paddingLeft,
      paddingRight,
      paddingBottom,
      transform,
    } = this.paddingRatio(padding, gravity)

    const widthWatermarkPreview = widthWatermarkByRatio ? widthWatermarkByRatio : widthWatermark
    const heightWatermarkPreview = heightWatermarkByRatio ? heightWatermarkByRatio : heightWatermark

    return (
      <Wrapper>
        <Preview>
          <FramePreview>
          <WatermarkPadding
            top={ top }
            left={ left }
            right={ right }
            bottom={ bottom }
            paddingTop={ paddingTop }
            paddingLeft={ paddingLeft }
            paddingRight={ paddingRight }
            paddingBottom={ paddingBottom }
            transform={ transform }
          >
            <Watermark
              height={ heightWatermarkPreview }
              width={ widthWatermarkPreview }
              src={ this.props.watermarkSrc }
              opacity={ this.props.opacity }
              modeResize={ this.props.modeResize }
              >
            </Watermark>
          </WatermarkPadding>
          <Image src={ this.props.imageSrc } />
          </FramePreview>
        </Preview>
      </Wrapper>
    )
  }
}

export default PreviewImage
