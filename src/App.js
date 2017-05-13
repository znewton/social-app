import React, { Component } from 'react';
import firebase from 'firebase';

import Auth from './Auth/Auth';
import Main from './Main/Main';

export default class App extends Component {
  constructor() {
    super();
    this.state = {
      auth: false,
    }
  }
  componentDidMount() {
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        // User is signed in.
        this.setState({auth: true});
      } else {
        // No user is signed in.
        this.setState({auth: false});
      }
    });
  }
  render() {
    return (
      <div className="App">
        {this.state.auth ? <Main /> : <Auth /> }
      </div>
    );
  }
}
