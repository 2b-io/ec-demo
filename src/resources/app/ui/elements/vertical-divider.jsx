import React from 'react'
import styled from 'styled-components'


const CenterElement = styled.div`
  position: relative;
  display: table-cell;
  vertical-align: middle;

  &:before, &:after {
    position: absolute;
    content: "";
    width: 1px;
    left: 50%;
    border-left: 1px solid black;
  }
  &:before {
    bottom: 50%;
    top: 0;
    margin-bottom: 20px;
  }
  &:after {
    top: 50%;
    bottom: 0;
    margin-top: 20px;
  }
`

const VerticalDivider = styled.div`
  position: absolute;
  display: table;
  text-align: center;

  height: 100%;
  width: 100%;
`


const VerticalDividerComponent = () => {
  return(
    <CenterElement>
      <VerticalDivider>
        <span>></span>
      </VerticalDivider>
    </CenterElement>
  )
}

export default VerticalDividerComponent
