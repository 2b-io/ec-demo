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
const WrapperItem = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
`

const PercentItem = styled.div`
  margin: auto auto auto 0;
`

const ProgressBarComponent = ({ percent }) => {
  return (
    <WrapperItem>
      <Progressbar>
        <Bar>
          <Progress percent={ `${percent}%` }/>
        </Bar>
      </Progressbar>
      <PercentItem>
        <span>{ percent }%</span>
      </PercentItem>
    </WrapperItem>
  )
}

export default ProgressBarComponent
