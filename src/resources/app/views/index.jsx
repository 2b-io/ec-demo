import React from 'react'
import { ThemeProvider } from 'styled-components'

import Home from 'app/views/pages/home'
import defaultTheme from 'app/views/themes/default'

const App = () => {
  return (
    <div>
      <ThemeProvider theme={ defaultTheme }>
        <Home />
      </ThemeProvider>
    </div>
  )
}

export default App
