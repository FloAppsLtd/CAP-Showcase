import { AppContainer } from 'react-hot-loader'
import React from 'react'
import { render } from 'react-dom'

import App from './App'
// Application state store
import AppStore from './store/Reactions'

const rootElement = document.getElementById('app')

// -------------
// Mount and run the app
//
render(
  <AppContainer>
    <App store={ AppStore } />
  </AppContainer>,
  rootElement
)

// -------------
// Hot reload the app in development
//
if (module.hot) {
  module.hot.accept('./App', () => {
    const NextApp = require('./App').default
    render(
      <AppContainer>
        <NextApp />
      </AppContainer>,
      rootElement
    )
  })
}
