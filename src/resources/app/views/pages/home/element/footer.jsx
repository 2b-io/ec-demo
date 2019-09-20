import React from 'react'
import styled, { css } from 'styled-components'

import { Break } from 'app/ui/elements'

const Footer = styled.div`
  background-color: #EBEBEB;
`

const Wrapper = styled.div`
  max-width: 1600px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 2fr 1fr;
  grid-gap: 24px;
  padding-top: 64px;
  padding-bottom: 24px;
`

const Copyright = styled.div`
  align-self: end
  justify-self: right
  white-space: nowrap
`
const Address = styled.div`
  margin: auto;
`
const Contact = styled.h1`
  font-weight: 500
  font-size: 14px
  ${
    ({ theme }) => css`
      color: ${ theme.primary.base }
    `
  }
`
const Title = styled.div`
  font-weight: 500
  font-size: 18px
  padding-bottom: 16px
`

const footerComponent = () => {
  return (
    <Footer>
      <Wrapper>
        <div>
          <Title>
            <h2>CONTACT US</h2>
          </Title>
          <Contact>
            <span>Head office</span>
          </Contact>
          <Address>
            <p> 6th Floor, Sudico Building (HH3) Me Tri Street, Nam Tu Liem District, Hanoi City, Vietnam
            <br/>
              Email: <a href="mailto:contact@mr-rocket.io">contact@mr-rocket.io</a>
            </p>
          </Address>
        </div>
        <Copyright>
          Made by <a href="https://www.ntq-solution.com.vn/">NTQ Solution</a> &copy; { new Date().getFullYear() }
        </Copyright>
      </Wrapper>
    </Footer>
  )
}

export default footerComponent
