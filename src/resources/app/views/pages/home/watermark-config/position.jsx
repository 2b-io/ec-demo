import React from 'react'
import styled, { css } from 'styled-components'

const WrapperItem = styled.div`
  border: solid 1px #007FFF;
  display: grid;
  max-width: 302px;
  grid-template-rows: repeat(3, 100px);
  grid-template-columns: repeat(3,100px);
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

class WatermarkPosition extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      gravity: 'NorthWest'
    }

    this.changeGravity = this.changeGravity.bind(this)
  }

  changeGravity(gravity) {
    this.setState({
      gravity
    })
    this.props.handleGravity(gravity)
  }

  render() {
    const listItem = gravitys.map((gravity, index) => {
      const active = this.state.gravity === gravity ? true : false
      return (
        <Item
          key={ index }
          active={ active }
          onClick= { this.changeGravity.bind(this, gravity) }
        >
        {
          active ? 'Watermark' : ''
        }
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

export default WatermarkPosition
