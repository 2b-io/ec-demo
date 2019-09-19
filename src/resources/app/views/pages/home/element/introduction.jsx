import React from 'react'
import styled, { css } from 'styled-components'
import introductionImage from 'img/introduction.png'

import { PrimaryButton, Break } from 'app/ui/elements'

const Introduction = styled.div`
  background-color: #fff;
`

const Wrapper = styled.div`
  max-width: 1600px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1fr 1fr;
  padding-left: 16px;
  padding-right: 16px;
`

const ImageIntro = styled.div`
  margin: auto;
  padding-top: 8px;
  max-width: 1200px;
  max-height: 600px;
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

const HeaderComponent = () => {
  return (
    <Introduction>
      <Wrapper>
        <Description>
          <DescriptionTitle>
            Automatic & Manual Watermark Position
          </DescriptionTitle>
          <p>
            You can add all your images into Watermarkly and the application will watermark photos at once.
            Watermarkly automatically scales watermark for landscapes, portraits and crops. Smaller photos get a smaller watermark, larger photos get a bigger one.
          </p>
          <Break />
          <Break />
          <PrimaryButton>Lear more</PrimaryButton>
        </Description>
        <ImageIntro>
          <img src={ introductionImage } height={ 600 } />
        </ImageIntro>
      </Wrapper>
    </Introduction>
  )
}

export default HeaderComponent
