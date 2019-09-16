import React, { Fragment } from 'react'

import Content from './content'
import Header from './element/header'
import Introduction from './element/introduction'
import StepsBar from './element/steps-bar'

const Home = () => {
  return (
    <Fragment>
      <Header />
      <Introduction />
      <StepsBar />
      <Content />
    </Fragment>
  )
}

export default Home
