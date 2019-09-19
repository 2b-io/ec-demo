import React from 'react'
import styled, { css } from 'styled-components'
import Popover, { ArrowContainer } from 'react-tiny-popover'

import iconUpload from 'img/icon-upload.png'


const PopoverDescription = styled.div`
  background: #fff;
  border-radius: 5px;
  display: inline-block;
  margin: 0px 10px 10px 10px;
  position: relative;
  width: 400px;
  height: 300px;

  box-shadow: 0 1px 3px rgba(0,0,0,0.12), 0 1px 0px rgba(0, 0, 0, 0);
  transition: all 0.3s cubic-bezier(.25,.8,.25,1);
`

const PopoverContent = styled.div`
  padding: 16px;
  text-align: center;
`
const NodeStepLast = styled.li`
  :after {
    display: none !important;
  }
`

const NodeStep = styled.li`
  position: relative;
  display: table-cell;
  text-align: center;
  font-size: 0.8em;

  :before {
    content: attr(data-step);
    display: block;
    margin: 0 auto;
    background: #DFE3E4;
    width: 3em;
    height: 3em;
    text-align: center;
    margin-bottom: 0.25em;
    line-height: 3em;
    border-radius: 100%;
    position: relative;
    z-index: 1000;
  }

  :after {
    content: '';
    position: absolute;
    display: block;
    background: #007fff;
    width: 100%;
    height: 0.5em;
    top: 1.25em;
    left: 50%;
    margin-left: 1.5em;
    z-index: 2;
  }

  :last-child:after {
    display: none;
  }

  ${
    ({ isComplete, theme }) => css`
        color: #007fff;

        :before, :after {
          color: #FFF;
          background: #007fff;
        }
      `
  }


  ${
    ({ isActive, theme }) => isActive ? css`
    color: ${ theme.secondary.base };;

    :before {
      color: #FFF;
      background: #007fff;
     }
    `:''
  }
`

const Progress = styled.ol`
  list-style: none;
  margin: 0;
  padding: 0;
  display: table;
  table-layout: fixed;
  width: 100%;
  color: #849397;

  *, *:after, *:before {
    box-sizing: border-box;
  }
`

class ProgressStepComponent extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      isPopoverOpenid: 1
    }
  }

  popoverOpen(id) {
    this.setState({
      isPopoverOpenid: id
    })

    this.props.changeStepActive(id)
  }

  render() {
    const { isPopoverOpenid } = this.state
    const { nodeData } = this.props

    const nodeSteps = Object.values(nodeData).map((data, index) => {
      const {
        isActive,
        isComplete,
        label,
        description
      } = data

      return (
        <Popover
          isOpen={ isPopoverOpenid === index }
          position={[ 'bottom', 'top', 'right', 'left' ]}
          disableReposition={ true }
          key={ index }
          content={ ({ position, targetRect, popoverRect }) => (
          <ArrowContainer
            position={ position }
            targetRect={ targetRect }
            popoverRect={ popoverRect }
            arrowColor={ '#FFF' }
            arrowSize={ 10 }
          >
            <PopoverDescription>
              <PopoverContent> { description } </PopoverContent>
            </PopoverDescription>
          </ArrowContainer>
          )}
          >
          <NodeStep
            isComplete={ isComplete }
            isActive={ isActive }
            data-step={ index + 1}
            key={ index }
            onClick={ this.popoverOpen.bind(this, index) }
            onMouseEnter={ () => this.props.hoverStep(index) }
            onMouseLeave={ () => this.props.leaveStep(index) }
          >
          { label }
          </NodeStep>
        </Popover>
      )
    })

    return (
      <Progress>
        { nodeSteps }
      </Progress>
    )
  }
}

export default ProgressStepComponent
