import React, {Component} from 'react';
import './App.css';
import {fetchUserInfo} from './api/user';
import Router from './router/';


class App extends Component {
  componentDidMount() {
    fetchUserInfo()
  }
  render() {
    return (<Router />)
  }
}

export default App;
