import { css } from 'styled-components'

const sizeToPixel = (size = 'normal') => (
  size === 'large' ? 16 : (
    size === 'normal' ? 14 : (
      size === 'small' ? 12 : 10
    )
  )
)

export const textAlign = ({ align }) => css`
  text-align: ${ align };
`

export const font = ({ bold, size, variant, theme }) => css`
  font-size: ${ sizeToPixel(size) }px;
  line-height: 24px;
  ${ bold && 'font-weight: bold;' }
  color: ${
    variant === 'primary' ? theme.primary.base : (
      variant === 'error' ? theme.error.base : (
        variant === 'secondary' ? theme.secondary.base :
          'inherit'
      )
    )
  };
`

export const lineHeight = ({ size }) => css`
  line-height: ${
    sizeToPixel(size) < 14 ? 24 : 32
  }px;
`

export const padding = css`
  ${
    ({ mostLeft }) => mostLeft && css`
      padding-left: 8px;
    `
  }

  ${
    ({ mostRight }) => mostRight && css`
      padding-right: 8px;
    `
  }
`

export const paragraph = css`
  padding-top: 8px;
  padding-bottom: 8px;
`
