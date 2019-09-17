import React from 'react'
import Icon from 'react-icons-kit'
import styled from 'styled-components'

const toPixel = size => (
  size === 'extra-large' ?
    48 : (
      size === 'large' ? 32 : (
        size=== 'medium' ? 24 : 16
      )
    )
)

const Surface = styled.div`
  display: flex;
  margin: 0 auto;
  width: 40px;
  height: 40px;
  max-width: 100%;
  max-height: 100%;
  justify-content: center;
  align-items: center;
`

export default type => {
  const IconWrapper = ({ size = 'medium', ...props }) => (
    <Surface size={ toPixel(size) }>
      <Icon
        icon={ type }
        size={ toPixel(size) }
        { ...props }
      />
    </Surface>
  )

  IconWrapper.propTypes = {

  }

  return IconWrapper
}
