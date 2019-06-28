import styled, { css } from 'styled-components'

const PlainButton = styled.button.attrs( props => {
  type: ({ type = 'button' }) => type
})`
  appearance: none;
  border: none;
  outline: none;
  background: transparent;
  margin: 0;
  padding: 0;
  white-space: nowrap;
  line-height: 40px;
  height: 40px;

  ${
    ({ disabled, theme: { mouseDetected } }) => mouseDetected && css`
      cursor: ${ disabled ? 'not-allowed' : 'pointer' };
    `
  }

  ${
    ({ disabled, theme }) => !disabled && theme.mouseDetected && !theme.touchDetected &&
      css`
        transition: opacity .3s;
        &:hover {
          opacity: 0.3;
        }
      `
  }

  &:focus {
    outline: none;
  }
`

export default PlainButton
