import React from 'react'
import styled, { css } from 'styled-components'

import { PrimaryButton, Break } from 'app/ui/elements'

const Introduction = styled.div`
  background-color: #fff;
  display: grid;
  grid-template-columns: 1fr 1fr;
`

const ImageIntro = styled.div`
  margin: auto;
  padding-left: 32px;
  padding-top: 8px;
  max-width: 1200px;
`
const Description = styled.div`
  margin: auto;
  text-align: justify;
  padding: 180px;
`
const DescriptionTitle = styled.h1`
  font-size: 22px;
  font-weight: 600;
  text-transform: uppercase;
  padding-bottom: 16px;
`

const HeaderComponent = () => {
  return (
    <Introduction>
      <Description>
        <DescriptionTitle>
          Automatic & Manual Watermark Position
        </DescriptionTitle>
        <p>
          You can add all your images into Watermarkly and the application will watermark photos at once. Watermarkly automatically scales watermark for landscapes, portraits and crops. Smaller photos get a smaller watermark, larger photos get a bigger one.
        </p>
        <Break />
        <Break />
        <PrimaryButton>Lear more</PrimaryButton>
      </Description>
      <ImageIntro>
        <img src='img/introduction.png' />
      </ImageIntro>
    </Introduction>
  )
}

export default HeaderComponent