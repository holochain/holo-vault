import * as React from 'react'
import { Provider } from 'react-redux'
import Home from './skins/home'
import { BrowserRouter as Router, Route } from 'react-router-dom'

const Root = ({ store }: {store: any}) => (
  <Provider store={store}>
    <Router>
      <Route path='/' component={Home} />
    </Router>
  </Provider>
)

export default Root
