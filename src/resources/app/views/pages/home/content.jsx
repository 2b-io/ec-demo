import React from 'react'
import styled, { css } from 'styled-components'

import From from './form'

const Wrapper = styled.div`
  margin: 0 auto;
  padding-left: 16px;
  padding-right: 16px;
  background-color: #fff;
`
const Content = () => (
  <Wrapper >
    <From />
  </Wrapper >
)

export default Content
