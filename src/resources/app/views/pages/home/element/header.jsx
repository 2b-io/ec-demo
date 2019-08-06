import React from 'react'
import styled, { css } from 'styled-components'

import logoImage from 'img/logo.svg'

const Header = styled.div`
  background: #1268B3;
  border-bottom: #ddd 2px solid;
`

const Wrapper = styled.div`
  max-width: 1600px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1fr 1fr;
  white-space: nowrap;
  padding-left: 16px;
  padding-right: 16px;
`

const Logo = styled.div`
  padding-top: 8px;
  max-width: 128px;
  max-height: 64px;
`
const Menu = styled.div`
  display: block;
  min-height: 64px;
  text-align: right;
`

const ItemLogo = styled.div`
  margin: auto;
  padding-left: 60px;
  padding-top: 16px;
`
const MenuItem = styled.a`
  display: inline-block;
  margin: auto;
  color: white;
  padding-top: 16px;
  padding-bottom: 16px;
  padding-left: 64px;
  text-transform: uppercase;
  font-size: 16px;
  font-weight: 500;
`
const HeaderComponent = () => {
  return (
    <Header>
      <Wrapper>
        <Logo>
          <a href="/">
            <img src={ logoImage } />
          </a>
        </Logo>
        <Menu>
          <MenuItem href="/" >Home</MenuItem>
          <MenuItem>About</MenuItem>
          <MenuItem>Contact Us</MenuItem>
          <MenuItem>Document</MenuItem>
        </Menu>
      </Wrapper>
    </Header>
  )
}

export default HeaderComponent
