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
  max-width: 268px
`

const Wrapper = styled.div`

`
const Watermark = styled.div`
  display: block;
  position: absolute;
  padding-top: 0px;
  padding-left: 0px;
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

const HeaderComponent = () => {
  return (
    <Preview>
      <Wrapper>
        <ImagePreview>
        <Watermark>
          <img src={ iconWatermark } />
        </Watermark>
        <BackgroundImage/>
        </ImagePreview>
      </Wrapper>
    </Preview>
  )
}

export default HeaderComponent
