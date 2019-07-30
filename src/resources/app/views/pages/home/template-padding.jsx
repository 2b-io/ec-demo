import React from 'react'
import styled, { css } from 'styled-components'

const WrapperItem = styled.div`
  /* border: solid 1px #007FFF; */
  grid-gap: 8px;
  display: grid;
  width: 500px;
  grid-template-rows: repeat(2, 128px);
  grid-template-columns: repeat(2,228px);
  margin: auto;
  text-align: center;
  padding: 8px;
`

class TemplateConfig extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      gravity: ''
    }
  }

  render() {

    return (
      <WrapperItem>
        <div>
          <label>Top </label>
          <input
            name='paddingTop'
            type='number'
            // onChange={ this.onChangePaddingX.bind(this) }
          />
        </div>
        <div>
          <label>Left </label>
          <input
            name='paddingLeft'
            type='number'
            // onChange={ this.onChangePaddingY.bind(this) }
          />
        </div>
        <div>
          <label>Right </label>
          <input
            name='paddingRight'
            type='number'
            // onChange={ this.onChangePaddingY.bind(this) }
          />
        </div>
        <div>
          <label>Bottom </label>
          <input
            name='paddingBottom'
            type='number'
            // onChange={ this.onChangePaddingY.bind(this) }
          />
        </div>
      </WrapperItem>
    )
  }
}

export default TemplateConfig
