import React from 'react'
import styled, { css } from 'styled-components'

const WrapperItem = styled.div`
  ${
    ({ padding }) => css`
      padding: ${ padding }px
    `
  }
`

const Progress = styled.ul`
  position: relative;
  display: inline-block;
  padding: 0;
  text-align: center;

  >li {
    display: inline-block;
    position: relative;
    text-align: center;
    color: #007FFF;
    font-family: Lato;
    font-weight: 100;

    :after {
      content: attr(data-percent);
      position: absolute;
      width: 100%;
      top: 1px
      left: 0;
      font-weight: 500;
      font-size: 8px;
      text-align: center;
    }
  }

  svg {
    width: 25px;
    height: 25px;

    :nth-child(2) {
      position: absolute;
      left: 0;
      top: 0;
      -webkit-transform: rotate(-90deg);
              transform: rotate(-90deg);
    }
    :nth-child(2) path {
      fill: none;
      stroke-width: 10;
      stroke-dasharray: 629;
      stroke: #fff;
      opacity: 1;
      -webkit-animation: load 2s;
              animation: load 2s;
    }
  }

  @-webkit-keyframes load {
    0% {
      stroke-dashoffset: 0;
    }
  }
  @keyframes load {
    0% {
      stroke-dashoffset: 0;
    }
  }
`
const ProgressBarComponent = ({ percent = 0, padding }) => {
  const pogressPercent = (percent * 629) / 100
  return (
    <WrapperItem padding = { padding }>
      <Progress>
        <li data-percent={ `${ percent }%` }>
          <svg viewBox="-10 -10 220 220">
            <g fill="none" strokeWidth="5" transform="translate(100,100)">
              <path d="M 0,-100 A 100,100 0 0,1 86.6,-50" stroke="url(#cl1)"/>
              <path d="M 86.6,-50 A 100,100 0 0,1 86.6,50" stroke="url(#cl2)"/>
              <path d="M 86.6,50 A 100,100 0 0,1 0,100" stroke="url(#cl3)"/>
              <path d="M 0,100 A 100,100 0 0,1 -86.6,50" stroke="url(#cl4)"/>
              <path d="M -86.6,50 A 100,100 0 0,1 -86.6,-50" stroke="url(#cl5)"/>
              <path d="M -86.6,-50 A 100,100 0 0,1 0,-100" stroke="url(#cl6)"/>
            </g>
          </svg>
          <svg viewBox="-10 -10 220 220">
            <path
              d="M200,100 C200,44.771525 155.228475,0 100,0 C44.771525,0 0,44.771525 0,100 C0,155.228475 44.771525,200 100,200 C155.228475,200 200,155.228475 200,100 Z"
              strokeDashoffset={ pogressPercent }>
            </path>
          </svg>
        </li>
      </Progress>
      <svg width="0" height="0">
        <defs>
          <linearGradient id="cl1" gradientUnits="objectBoundingBox" x1="0" y1="0" x2="1" y2="1">
            <stop stopColor="#007FFF"/>
            <stop offset="100%" stopColor="#007FFF"/>
          </linearGradient>
          <linearGradient id="cl2" gradientUnits="objectBoundingBox" x1="0" y1="0" x2="0" y2="1">
            <stop stopColor="#007FFF"/>
            <stop offset="100%" stopColor="#007FFF"/>
          </linearGradient>
          <linearGradient id="cl3" gradientUnits="objectBoundingBox" x1="1" y1="0" x2="0" y2="1">
            <stop stopColor="#007FFF"/>
            <stop offset="100%" stopColor="#007FFF"/>
          </linearGradient>
          <linearGradient id="cl4" gradientUnits="objectBoundingBox" x1="1" y1="1" x2="0" y2="0">
            <stop stopColor="#007FFF"/>
            <stop offset="100%" stopColor="#007FFF"/>
          </linearGradient>
          <linearGradient id="cl5" gradientUnits="objectBoundingBox" x1="0" y1="1" x2="0" y2="0">
            <stop stopColor="#007FFF"/>
            <stop offset="100%" stopColor="#007FFF"/>
          </linearGradient>
          <linearGradient id="cl6" gradientUnits="objectBoundingBox" x1="0" y1="1" x2="1" y2="0">
            <stop stopColor="#007FFF"/>
            <stop offset="100%" stopColor="#007FFF"/>
          </linearGradient>
        </defs>
      </svg>
    </WrapperItem>
  )
}

export default ProgressBarComponent
