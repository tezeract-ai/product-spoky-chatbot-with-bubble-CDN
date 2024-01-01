import React from 'react'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Home from '../Home';
import DynamicRouteComponent from '../DynamicRouteComponent';
const Routes = () => {
  return (
    <>
      <Router>
     
            <Route path='/' component={Home}></Route>
            <Route path='/route' component={DynamicRouteComponent}></Route>
      </Router>
    </>
  )
}

export default Routes
