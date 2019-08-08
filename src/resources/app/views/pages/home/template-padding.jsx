import React from 'react'
import styled, { css } from 'styled-components'

const WrapperItem = styled.div`
  grid-gap: 8px;
  display: grid;
  max-width: 500px;
  grid-template-columns: repeat(4,108px);
`

const PaddingItem = styled.input`
  max-width: 60px
`

class TemplateConfig extends React.Component {
  constructor(props) {
    super(props)
  }

  onChangePadding(e) {
    this.props.handlePadding({ [ e.target.name ]: e.target.value })
  }
  render() {
    let stateInputTop = false
    let stateInputLeft = false
    let stateInputRight = true
    let stateInputBottom = true

    switch (this.props.gravity) {
      case 'NorthWest':
        stateInputLeft = false
        stateInputTop = false
        break;
      case 'North':
        stateInputTop = false
        stateInputLeft= true
        break;
      case 'NorthEast':
        stateInputTop = false
        stateInputRight = false
        stateInputLeft = true
        break;
      case 'West':
        stateInputLeft = false
        stateInputTop = true
        break;
      case 'Center':
        stateInputTop = false
        stateInputLeft = false
        stateInputRight = false
        stateInputBottom = false
        break;
      case 'East':
        stateInputRight = false
        stateInputLeft = true
        stateInputTop = true
        break;
      case 'SouthWest':
        stateInputLeft = false
        stateInputTop = true
        stateInputBottom = false
        break;
      case 'South':
        stateInputBottom = false
        stateInputLeft = true
        stateInputTop = true
        break;
      case 'SouthEast':
        stateInputBottom = false
        stateInputRight = false
        stateInputLeft = true
        stateInputTop = true
        break;
    }
    return (
      <WrapperItem>
        <div>
          <label>Top </label>
          <PaddingItem
            name='paddingTop'
            type='number'
            onChange={ this.onChangePadding.bind(this) }
            value={ this.props.paddingTop }
            disabled={ stateInputTop }
          />
        </div>
        <div>
          <label>Left </label>
          <PaddingItem
            name='paddingLeft'
            type='number'
            onChange={ this.onChangePadding.bind(this) }
            value={ this.props.paddingLeft }
            disabled={ stateInputLeft }
          />
        </div>
        <div>
          <label>Right </label>
          <PaddingItem
            name='paddingRight'
            type='number'
            onChange={ this.onChangePadding.bind(this) }
            value={ this.props.paddingRight }
            disabled={ stateInputRight }
          />
        </div>
        <div>
          <label>Bottom </label>
          <PaddingItem
            name='paddingBottom'
            type='number'
            onChange={ this.onChangePadding.bind(this) }
            value={ this.props.paddingBottom }
            disabled={ stateInputBottom }
          />
        </div>
      </WrapperItem>
    )
  }
}

export default TemplateConfig
