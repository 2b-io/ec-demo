import styled, { css } from 'styled-components'

const PlainButton = styled.input.attrs(props => ({
  type: 'button'}))`
  border: none
  width: 96px
  background: #074071
  color: white
  cursor: pointer
  border-radius: 32px
  height: 32px
  appearance: none
  outline: none

  &:focus {
    outline: none;
  }
`

export default PlainButton
