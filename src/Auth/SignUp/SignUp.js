import React, { Component } from 'react';
import firebase from 'firebase';

import Input from './../../Components/Input/Input';

export default class SignUp extends Component {
  constructor() {
    super();
    this.state = {
      email: '',
      password: '',
      password2: '',
      error: '',
    }
  }
  handleSubmit(e) {
    if(this.state.password !== this.state.password2) {
      this.setState({error: "Passwords must match"});
      return;
    }
    firebase.auth().createUserWithEmailAndPassword(this.state.email, this.state.password)
    .then(user => {
      console.log(user);
      firebase.database().ref('/users/'+user.uid).set({
          displayName: user.email.match(/^([^@]*)@/)[1],
          friends: [],
          bio: '',
        });
      })
    .catch(error => {
      // Handle Errors here.
      const errorCode = error.code;
      const errorMessage = error.message;
      this.setState({error: errorMessage});
    });
  }
  render() {
    return (
      <form className="SignUp" onSubmit={e => {e.preventDefault()}}>
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
        <Input
          name="password2"
          type="password"
          label="Confirm Password"
          onChange={value => this.setState({password2:value})}
          value={this.state.password2}
        />
        <button role="button" onClick={() => this.handleSubmit()}>Sign Up</button>
      </form>
    );
  }
}
