import React, {Component} from 'react';
import './App.css';
import {fetchUserInfo} from './api/user';
import Router from './router/';


class App extends Component {
  state = {
    userInfo: null
  }

  componentDidMount() {
    fetchUserInfo().then((data) => {
      this.setState({
        userInfo: data
      })
    })
  }
  render() {
    return (<Router />)
  }
}

export default App;
