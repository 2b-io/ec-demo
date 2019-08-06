import React, { Fragment } from 'react'

import Content from './content'
import Header from './element/header'
import Introduction from './element/introduction'

const Home = () => {
  return (
    <Fragment>
      <Header />
      <Introduction />
      <Content />
    </Fragment>
  )
}

export default Home
