import styled, { css } from 'styled-components'

const PrimaryButton = styled.button.attrs( props => {
  type: ({ type = 'button' }) => type
})`
  appearance: none;
  border: none;
  outline: none;
  padding: 0 8px;
  white-space: nowrap;
  line-height: 40px;
  height: 40px;
  margin: auto;
  width: 100%;
  transition:
    background .3s linear,
    color .3s linear;

  ${
    ({ free }) => css`
      display: free ? 'inherit' : 'block'
    `
  }
  ${
    ({ disabled, theme: { mouseDetected } }) => mouseDetected && css`
      cursor: ${ disabled ? 'not-allowed' : 'pointer' };
    `
  }

  ${
    ({ disabled, theme }) => disabled ?
      css`
        background: ${ theme.secondary.base };
        color: ${ theme.secondary.on.base };
      ` :
      css`
        background: ${ theme.primary.base };
        color: ${ theme.primary.on.base };
        ${
          theme.mouseDetected && !theme.touchDetected && `
            &:hover {
              background: ${ theme.primary.light.base };
              color: ${ theme.primary.light.on.base };
            }
          `
        }
      `
  }

  &:focus {
    outline: none;
  }

  @media (min-width: 600px) {
    width: auto;
    text-align: center;
    margin: 0 0 0 auto;
    ${
      ({ minWidth }) => minWidth ? css`
        min-width: ${ minWidth }px
      `
      : css`
        min-width : 128px;
      `
    }
  }
`

export default PrimaryButton
