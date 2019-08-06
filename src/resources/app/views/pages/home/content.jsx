import React from 'react'
import styled, { css } from 'styled-components'

import From from './form'


const Wrapper = styled.div`
  max-width: 1600px;
  margin: 0 auto;
  padding-left: 16px;
  padding-right: 16px;
`
const Content = () => (
  <Wrapper >
    <From />
  </Wrapper >
)

export default Content
