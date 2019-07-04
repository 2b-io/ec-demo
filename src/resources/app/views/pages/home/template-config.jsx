import React from 'react'
import styled, { css } from 'styled-components'


const WrapperItem = styled.div`
  border: solid 1px #007FFF;
  grid-gap: 8px;
  display: grid;
  width: 400px;
  grid-template-rows: repeat(3, 128px);
  grid-template-columns: repeat(3,128px);
  margin: auto;
  text-align: center;
  padding: 8px;
`
const Item = styled.button`

  ${
    ({ active, theme }) => active ?
    css`
      background: ${ theme.secondary.base };
      color: ${ theme.secondary.on.base };
    ` :
    css`
      background: 'none';
    `
  }
  &:hover {
    background-color: #007FFF;
    color: white;
  }
  transition:
    background .3s linear,
    color .3s linear;
  border: none;
  outline: none;
  appearance: none;
  cursor: pointer;
`

const gravitys = [
  'NorthWest',
  'North',
  'NorthEast',
  'West',
  'Center',
  'East',
  'SouthWest',
  'South',
  'SouthEast',
]

class TemplateConfig extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      gravity: ''
    }

    this.changeGravity = this.changeGravity.bind(this)
  }

  changeGravity(gravity) {
    this.setState({
      gravity
    })
  }

  render() {
    const listItem = gravitys.map((gravity, index) => {
      return (
        <Item
          key={ index }
          active={ this.state.gravity === gravity ? true : false }
          onClick= { this.changeGravity.bind(this, gravity) }
          >
          { gravity }
        </Item>
      )
    })
    return (
      <WrapperItem>
        { listItem }
      </WrapperItem>
    )
  }
}

export default TemplateConfig
