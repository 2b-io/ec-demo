import React from 'react'
import styled, { css } from 'styled-components'

import iconUpload from 'img/icon-upload.png'

const WrapperItem = styled.div`
  display: inline-block
`

const Position = styled.div`
  border: solid 1px #007FFF;
  display: grid;
  max-width: 302px;
  grid-template-rows: repeat(3, 100px);
  grid-template-columns: repeat(3,100px);
`

const Item = styled.button.attrs( props => {
  id: props.id
})`
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
    const {  watermarkSrc } = this.props
    const idButtonUpload = watermarkSrc ? 'watermark' : 'browseWatermark'
      if (index === 0) {
        return (
          <Item
            id={ idButtonUpload }
            key={ index }
            active={ active }
            onClick= { this.changeGravity.bind(this, gravity) }
          >
          {
            !active ? '' : watermarkSrc ? <img width={ 60 } src={ watermarkSrc } /> : <img width={ 60 } src={ iconUpload }/>
          }
          </Item>
        )
      }
      return (
        <Item
          id={`browseWatermark${ index + 1 }`}
          key={ index }
          active={ active }
          onClick= { this.changeGravity.bind(this, gravity) }
        >
        {
          !active ? '' : watermarkSrc ? <img width={ 60 } src={ watermarkSrc } /> : 'Watermark'
        }
        </Item>
      )
    })
    return (
      <WrapperItem>
        <Position>
          { listItem }
        </Position>
      </WrapperItem>
    )
  }
}

export default WatermarkPosition
