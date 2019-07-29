import React from 'react'
import styled, { css } from 'styled-components'

const Wrapper = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  background: #1268B3;
  border-bottom: #ddd 2px solid;
`

const Logo = styled.div`
  max-width: 180px;
  height: 64px;
  text-align: center;
`
const Menu = styled.div`
  display: grid;
  min-height: 64px;
  grid-template-columns: 1fr 1fr 1fr 1fr;
  text-align: center;
`

const ItemLogo = styled.div`
  margin: auto;
  padding-left: 60px;
  padding-top: 16px;
`
const MenuItem = styled.div`
  margin: auto;
  color: white;
  padding-left: 32px;
  padding-right: 32px;
  text-transform: uppercase;
  font-size: 16px;
  font-weight: 500;
`
const HeaderComponent = () => {
  return (
    <Wrapper>
      <Logo>
        <ItemLogo>
          <a href="/">
            <img src='img/logo.svg' />
          </a>
        </ItemLogo>
      </Logo>
      <Menu>
        <MenuItem>Home</MenuItem>
        <MenuItem>About</MenuItem>
        <MenuItem>Contact Us</MenuItem>
        <MenuItem>Document</MenuItem>
      </Menu>
    </Wrapper>
  )
}

export default HeaderComponent
