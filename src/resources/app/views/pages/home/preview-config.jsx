import React from 'react'
import styled, { css } from 'styled-components'
import previewImage from 'img/image-preview.jpg'
import iconWatermark from 'img/icon-watermark.jpg'

import { PrimaryButton, Break } from 'app/ui/elements'

const Preview = styled.div`
  max-width: 750px;
  text-align: right;
`
const ImagePreview = styled.div`
  max-width: 300px
`

const Wrapper = styled.div`

`
const Watermark = styled.div`
  display: block;
  position: absolute;
  ${
    ({ top = 0, left = 0, right = 0, bottom = 0, opacity = 1  }) => css`
      padding-top: ${ top }px;
      padding-left: ${ left }px;
      padding-right: ${ right }px;
      padding-bottom: ${ bottom }px;
      opacity: ${ opacity }
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
const BackgroundImage = styled.div`
  background-image: url(assets/img/previewImage)
`
const DescriptionTitle = styled.h1`
  font-size: 22px;
  font-weight: 600;
  text-transform: uppercase;
  padding-bottom: 16px;
`

const HeaderComponent = ({
  gravity = 'NorthWest',
  paddingTop = 0,
  paddingLeft = 0,
  paddingRight = 0,
  paddingBottom = 0,
  opacity
}) => {
  let top = 0
  let left = 0
  let right = 0
  let bottom = 0

  const paddingTopRatio = paddingTop*100/125
  const paddingLeftRatio = paddingLeft*100/125
  const paddingRightRatio = paddingRight*100/125
  const paddingBottomRatio = paddingBottom*100/125

  switch (gravity) {
    case 'NorthWest':
      top = Number(paddingTopRatio) || 0
      left = Number(paddingLeftRatio) || 0
      break;
    case 'North':
      top = Number(paddingTopRatio) || 0
      left = 125
      break;
    case 'NorthEast':
      top = Number(paddingTopRatio) || 0
      left = 250 - Number(paddingRightRatio) || 0
      break;
    case 'West':
      top = 125
      left = Number(paddingLeftRatio) || 0
      break;
    case 'Center':
      top = 125
      left = 125
      break;
    case 'East':
      top = 125
      left = 250 - Number(paddingRightRatio) || 0
      break;
    case 'SouthWest':
      left = Number(paddingLeftRatio) || 0
      top = 250 -Number(paddingBottomRatio) || 0
      break;
    case 'South':
      top = 250 - Number(paddingBottomRatio) || 0
      left = 125
      break;
    case 'SouthEast':
      top = 250 - Number(paddingBottomRatio) || 0
      left = 250 - Number(paddingRightRatio) || 0
      break;
  }
  return (
    <Preview>
      <Wrapper>
        <ImagePreview>
        <Watermark top={ top } left={ left } right = { right } bottom = { bottom } opacity = { opacity }>
          <img src={ iconWatermark }/>
        </Watermark>
          <img src={ previewImage } />
        </ImagePreview>
      </Wrapper>
    </Preview>
  )
}

export default HeaderComponent
