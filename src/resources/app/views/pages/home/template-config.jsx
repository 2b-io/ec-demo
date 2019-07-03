import React from 'react'
import styled, { css } from 'styled-components'


const WrapperItem = styled.div`
  border: solid 1px blue;
  grid-gap: 16px;
  display: grid;
  width: 420px;
  grid-template-rows: repeat(3, 128px);
  grid-template-columns: repeat(3,128px);
  margin: auto;
  text-align: center;
  padding: 8px;
`
const Item = styled.div`
  border: solid 1px red;
`


class TemplateConfig extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <WrapperItem>
        <Item>
          position1
        </Item>
        <Item>
          position2
        </Item>
        <Item>
          position3
        </Item>
        <Item>
          position4
        </Item>
        <Item>
          position5
        </Item>
        <Item>
          position6
        </Item>
        <Item>
          position7
        </Item>
        <Item>
          position8
        </Item>
        <Item>
          position9
        </Item>
      </WrapperItem>
    )
  }
}

export default TemplateConfig
