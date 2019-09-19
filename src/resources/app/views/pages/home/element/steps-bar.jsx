import React from 'react'
import styled, { css } from 'styled-components'
import normalizeData from 'img/normalize-data.jpg'
import modifyData from 'img/modify-data.jpg'
import integrateSystem from 'img/integrate-system.jpg'

import { PrimaryButton, Break, ProgressStep } from 'app/ui/elements'

const Introduction = styled.div`
  background-color: #ebebeb;
  padding-top: 48px;
  min-height: 450px;
`

const Wrapper = styled.div`
  /* max-width: 1600px; */
  margin: 0 auto;
  display: grid;
`

const ImageIntro = styled.div`
  margin: auto;
  padding-top: 8px;
  max-width: 1200px;
`
const Description = styled.div`
  margin: auto;
`
const DescriptionTitle = styled.h1`
  font-size: 22px;
  font-weight: 600;
  text-transform: uppercase;
  padding-bottom: 16px;
`

class StepComponent extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      nodeData: {
        0: {
          isActive: false,
          isComplete: true,
          label: "Normalize",
          description: <img src={ normalizeData } width={ 550 }/>
        },
        1: {
          isActive: false,
          isComplete: true,
          label: "Modify",
          description: <img src={ modifyData } width={ 550 }/>
        },
        2: {
          isActive: false,
          isComplete: false,
          label: "Integrate",
          description: <img src={ integrateSystem } width={ 550 }/>
        }
      }
    }
  }


  hoverStep(id) {
    const { nodeData } = this.state
    nodeData[ id ].isActive = true

    this.setState({
      nodeData
    })
  }

  leaveStep(id) {

    const { nodeData } = this.state
    nodeData[ id ].isActive = false

    this.setState({
      nodeData
    })
  }

  changeStepActive(id) {
    const nodeData = {
      0: {
        isActive: false,
        isComplete: false,
        label: "Normalize",
        description: <img src={ normalizeData } width={ 350 }/>
      },
      1: {
        isActive: false,
        isComplete: false,
        label: "Modify",
        description: <img src={ modifyData } width={ 550 }/>
      },
      2: {
        isActive: false,
        isComplete: false,
        label: "Integrate",
        description: <img src={ integrateSystem } width={ 550 }/>
      }
    }

    nodeData[ id ].isComplete = true

    this.setState({
      nodeData
    })
  }

  render () {
    return (
      <Introduction>
        <Wrapper>
          <ProgressStep
            nodeData={ this.state.nodeData }
            changeStepActive={ this.changeStepActive.bind(this) }
            hoverStep={ this.hoverStep.bind(this) }
            leaveStep={ this.leaveStep.bind(this) }
          />
        </Wrapper>
      </Introduction>
    )
  }
}

export default StepComponent
