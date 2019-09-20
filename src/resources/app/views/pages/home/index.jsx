import React, { Fragment } from 'react'

import Content from './content'
import Header from './element/header'
import Introduction from './element/introduction'
import Footer from './element/footer'
import StepsBar from './element/steps-bar'

const Home = () => {
  return (
    <Fragment>
      <Header />
      <Introduction />
      <StepsBar />
      <Content />
      <Footer />
    </Fragment>
  )
}

export default Home
