import React from 'react'
import styled, { css } from 'styled-components'

import { ProgressCircular } from 'app/ui/elements'
import { AddIcon } from 'app/ui/elements/icons'

import iconUpload from 'img/icon-upload.png'

const UploadButton = styled.div.attrs( props => {
  id: props.id
})`
  ${
    ({ hidden }) => hidden ?
    css`display: none;`
    :
    css`display: inline-block;`
  }

  color: #c1c1c1;

  :hover {
    ${
      ({ theme }) => css`
        color: #FFF;
      `
    }
  }
`

const Progress = styled.div`
  margin: auto 0 0 auto;
  display: block;
  position: absolute;
  top: 50%;
  left: 50%;
`

const RemoveButton = styled.div`
  appearance: none;
  border: none;
  outline: none;
  height: 22px;
  width: 22px;
  opacity: 0.5;
  border-radius: 20px;
  margin: auto 0 0 auto;
  transition:
    background .3s linear,
    color .3s linear;

  display: block;

  ${
    ({ theme }) =>
      css`
        background: ${ theme.error.base };
        color: ${ theme.error.on.base };
      `
  }

  &:focus {
    outline: none;
  }
  &:hover {
    opacity: 1;
  }
`
const WrapperItem = styled.div`
  display: inline-block
`

const Position = styled.div`
  border: solid 1px #007FFF;
  display: grid;
  max-width: 500px;
  grid-template-rows: repeat(3, 150px);
  grid-template-columns: repeat(3,150px);
`

const Item = styled.button.attrs( props => {
  id: props.id
})`

  ${
    ({ active, watermarkSrc, theme }) => active && !watermarkSrc ?
      css`
        background-color: ${ theme.secondary.base };
        color: ${ theme.secondary.on.base };
      `
     :
     css`
      &:hover {
        background-color: #007FFF;
        color: white;
      }
    `
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

const Image = styled.img  .attrs( props => {
  src: props.src
})`
  ${
    ({ opacity }) => css`
      opacity: ${ opacity }
    `
  }
`
const Watermark = styled.div`
  ${ ({
    top,
    left,
    right,
    bottom
  }) => {

    return css`
      top: ${ top };
      left: ${ left };
      right: ${ right };
      bottom: ${ bottom };
      `
    }
  }

  }
`

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

  paddingRatio(gravity) {
    let top
    let left
    let right
    let bottom

    let transform

    switch (gravity) {
      case 'NorthWest':
        top = 0
        break;
      case 'North':
        top = 0
        left = '50%'
        transform = 'translateX(-50%)'
        break;
      case 'NorthEast':
        top = 0
        right = 0
        break;
      case 'West':
        top = '50%'
        left = '0'
        transform = 'translateY(-50%)'
        break;
      case 'Center':
        top = '50%'
        left = '50%'
        transform = 'translate(-50%,-50%)'
        break;
      case 'East':
        right = 0
        top = '50%'
        transform = 'translateY(-50%)'
        break;
      case 'SouthWest':
        bottom = 0
        left = 0
        break;
      case 'South':
        left = '50%'
        bottom = 0
        transform = 'translateX(-50%)'
      break;
      case 'SouthEast':
        bottom = 0
        right = 0
        break;
    }

    return {
      top,
      left,
      right,
      bottom,
      transform
    }
  }

  render() {
    const {
      top,
      left,
      right,
      bottom,
      transform
    } = this.paddingRatio(this.state.gravity)

    const listItem = gravitys.map((gravity, index) => {
    const active = this.state.gravity === gravity ? true : false
    const {  watermarkSrc, percent } = this.props

      return (
        <Item
          watermarkSrc={ watermarkSrc }
          key={ index }
          active={ active }
          onClick= { this.changeGravity.bind(this, gravity) }
        >
        {
          !active ? watermarkSrc ? '' :
          <UploadButton
            hidden={ true }
            id={`browseWatermark${ index }`}
            >
            <AddIcon/>
          </UploadButton> :
            watermarkSrc ?
            <Watermark
              top={ top }
              left={ left }
              right={ right }
              bottom={ bottom }
              transform={ transform }
            >
            {
              percent && percent < 100 ?
              <RemoveButton
                onClick={ () => this.props.removeWatermark() }
                minWidth={ 20 }>
                  X
              </RemoveButton>
              :
              <div>
                <RemoveButton
                  onClick={ () => this.props.removeWatermark() }
                  minWidth={ 20 }>
                    X
                </RemoveButton>
              </div>
            }
            {
              percent < 100 ?
              <Image width={ 60 } src={ watermarkSrc } opacity={ 0.3 } /> :
              <Image width={ 60 } src={ watermarkSrc } opacity={ 1 } />
            }
            </Watermark> :
            <UploadButton id={`browseWatermark${ index }`}>
              <AddIcon />
              <span>Watermark</span>
            </UploadButton>
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
