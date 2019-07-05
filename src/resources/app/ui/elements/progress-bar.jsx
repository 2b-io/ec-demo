import React from 'react'
import styled, { css } from 'styled-components'

const Progressbar = styled.div`
  overflow: hidden;
  border-radius: 16px;
  margin: auto 0 auto 0;
`

const Bar = styled.div`
  display: block;
  position: relative;
  height: 8px;
  background: white;
`
const Progress = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  border-radius: 10px;
  min-width: 16px;
  transition: width .2s;
  ${
    ({ percent, theme }) => css`
        transition: opacity .3s;
        width: ${ percent };
        background: ${ theme.primary.base };
      `
  }
`

const ProgressBarComponent = ({ percent='0%' }) => {
  return (
    <Progressbar>
      <Bar>
        <Progress percent={ percent }/>
      </Bar>
    </Progressbar>
  )
}

export default ProgressBarComponent
