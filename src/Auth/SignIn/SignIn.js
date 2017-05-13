import React, { Component } from 'react';
import firebase from 'firebase';

import Input from './../../Components/Input/Input';

export default class SignIn extends Component {
  constructor() {
    super();
    this.state = {
      email: '',
      password: '',
      error: '',
    }
  }
  handleSubmit(e) {
    firebase.auth().signInWithEmailAndPassword(this.state.email, this.state.password).catch(error => {
      // Handle Errors here.
      const errorCode = error.code;
      const errorMessage = error.message;
      this.setState({error: errorMessage});
    });
  }
  render() {
    return (
      <form className="SignIn" onSubmit={e => {e.preventDefault()}}>
        {this.state.error && (
          <div className="error">
            {this.state.error}
          </div>
        )}
        <Input
          name="email"
          type="email"
          label="Email"
          onChange={value => this.setState({email:value})}
          value={this.state.email}
        />
        <Input
          name="password"
          type="password"
          label="Password"
          onChange={value => this.setState({password:value})}
          value={this.state.password}
        />
        <button role="button" onClick={() => this.handleSubmit()}>Sign In</button>
      </form>
    );
  }
}
