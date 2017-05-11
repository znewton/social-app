import React, { Component } from 'react';
import firebase from 'firebase';
import './App.scss';

export default class App extends Component {
  componentDidMount() {

    console.log(firebase);
  }
  render() {
    return (
      <h1>Hello World</h1>
    );
  }
}
