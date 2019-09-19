import React from 'react'
import { Portal } from 'react-portal'
import styled from 'styled-components'

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 10;
  overflow-x: hidden;
  overflow-y: auto;
  background: ${
    ({ theme }) => theme.black.opaque.base
  };
  padding: 0 24px;
`

const Content = styled.div`
  background: ${ ({ theme }) => theme.background.base };
  color: ${ ({ theme }) => theme.background.on.base };
  position: relative;
  margin: 64px auto 16px;
  box-shadow: 4px 4px ${
    ({ theme }) => theme.black.opaque.base
  };
  min-width: 280px; /* support iphone5s */
  max-width: 1024px;
`

const Dialog = ({
  isActive,
  content,
  onOverlayClick
}) => {
  if (!isActive || !content) {
    return null
  }

  return (
    <Portal node={ document.getElementById('root') }>
      <Overlay onClick={ onOverlayClick }>
        <Content onClick={ e => e.stopPropagation() }>
          { content({ params: isActive }) }
        </Content>
      </Overlay>
    </Portal>
  )
}

export default Dialog
