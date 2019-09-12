import React from 'react'
import styled, { css } from 'styled-components'

const Wrapper = styled.div`
  display: inline-block;
`
const ListItem = styled.div`
  grid-gap: 8px;
  display: grid;
  max-width: 500px;
  grid-template-columns: repeat(4,120px);
`

const Item = styled.input`
  max-width: 60px
`

class TemplatePadding extends React.Component {
  constructor(props) {
    super(props)
  }

  changePadding(e) {
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
      <Wrapper>
        <ListItem>
          <div>
            <label>Top </label>
            <Item
              name='paddingTop'
              type='number'
              onChange={ this.changePadding.bind(this) }
              value={ this.props.paddingTop }
              disabled={ stateInputTop }
            />
            <label>px</label>
          </div>
          <div>
            <label>Left </label>
            <Item
              name='paddingLeft'
              type='number'
              onChange={ this.changePadding.bind(this) }
              value={ this.props.paddingLeft }
              disabled={ stateInputLeft }
            />
            <label>px</label>
          </div>
          <div>
            <label>Right </label>
            <Item
              name='paddingRight'
              type='number'
              onChange={ this.changePadding.bind(this) }
              value={ this.props.paddingRight }
              disabled={ stateInputRight }
            />
            <label>px</label>
          </div>
          <div>
            <label>Bottom </label>
            <Item
              name='paddingBottom'
              type='number'
              onChange={ this.changePadding.bind(this) }
              value={ this.props.paddingBottom }
              disabled={ stateInputBottom }
            />
            <label>px</label>
          </div>
        </ListItem>
      </Wrapper>
    )
  }
}

export default TemplatePadding
