import React from 'react'
import styled from 'styled-components'

import { font, lineHeight, padding, paragraph, textAlign } from './mixin'

const Block = styled.div`
  ${ font }
  ${ lineHeight }
  ${ padding }
  ${ textAlign }

  & > * {
    display: block;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
`

const PageTitleConntent = styled.div`
  @media (min-width: 600px) {
    text-align: left;
    padding: 0 8px;
  }
`

export const Text = styled.p`
  ${ font }
  ${ textAlign }
  ${ paragraph }
  ${ padding }
`

export const DescriptionText = ({ children, ...props }) => (
  <Text size="small" variant="secondary" { ...props }>{ children }</Text>
)

export const AssistiveText = ({ children, ...props }) => (
  <Text size="tiny" { ...props }>{ children }</Text>
)

export const TextLine = ({ children, ...props }) => (
  <Block { ...props }>
    <span>{ children }</span>
  </Block>
)

export const DescriptionTextLine = ({ children, ...props }) => (
  <Block size="small" variant="secondary" { ...props }>
    <span>{ children }</span>
  </Block>
)

export const AssistiveTextLine = ({ children, ...props }) => (
  <Block size="tiny" { ...props }>
    <span>{ children }</span>
  </Block>
)

export const PageTitle = ({ children, ...props }) => (
  <Block size="large" align="center" { ...props }>
    <PageTitleConntent>
      <h1>{ children }</h1>
    </PageTitleConntent>
  </Block>
)

export const Heading = ({ children, ...props }) => (
  <Block { ...props }>
    <h2>{ children }</h2>
  </Block>
)

export const Emphasize = styled.span`
  font-weight: bold;
`

export const Code = styled.span`
  padding-left: 8px;
  padding-right: 8px;
  color: ${ ({ theme }) => theme.black.base };
  background: #e6e6e6;
`
