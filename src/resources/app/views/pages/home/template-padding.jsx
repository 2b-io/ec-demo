import React from 'react'
import styled, { css } from 'styled-components'

const WrapperItem = styled.div`
  grid-gap: 8px;
  display: grid;
  width: 500px;
  grid-template-rows: repeat(2, 128px);
  grid-template-columns: repeat(2,228px);
  margin: auto;
  padding: 8px;
`

class TemplateConfig extends React.Component {
  constructor(props) {
    super(props)
  }

  onChangePadding(e) {
    this.props.handlePadding({ [ e.target.name ]: e.target.value })
  }
  render() {
    let stateInputTop = true
    let stateInputLeft = true
    let stateInputRight = true
    let stateInputBottom = true

    switch (this.props.gravity) {
      case 'NorthWest':
        stateInputLeft = false
        stateInputTop = false
        break;
      case 'North':
        stateInputTop = false
        break;
      case 'NorthEast':
        stateInputTop = false
        stateInputRight = false
        break;
      case 'West':
        stateInputLeft = false
        break;
      case 'East':
        stateInputRight = false
        break;
      case 'SouthWest':
        stateInputLeft = false
        stateInputBottom = false
        break;
      case 'South':
        stateInputBottom = false
        break;
      case 'SouthEast':
        stateInputBottom = false
        stateInputRight = false
        break;
    }
    return (
      <WrapperItem>
        <div>
          <label>Top </label>
          <input
            name='paddingTop'
            type='number'
            onChange={ this.onChangePadding.bind(this) }
            defaultValue={ 0 }
            disabled={ stateInputTop }
          />
        </div>
        <div>
          <label>Left </label>
          <input
            name='paddingLeft'
            type='number'
            onChange={ this.onChangePadding.bind(this) }
            defaultValue={ 0 }
            disabled={ stateInputLeft }
          />
        </div>
        <div>
          <label>Right </label>
          <input
            name='paddingRight'
            type='number'
            onChange={ this.onChangePadding.bind(this) }
            defaultValue={ 0 }
            disabled={ stateInputRight }
          />
        </div>
        <div>
          <label>Bottom </label>
          <input
            name='paddingBottom'
            type='number'
            onChange={ this.onChangePadding.bind(this) }
            defaultValue={ 0 }
            disabled={ stateInputBottom }
          />
        </div>
      </WrapperItem>
    )
  }
}

export default TemplateConfig
