import React, { Component } from 'react';

import SignIn from './SignIn/SignIn';
import SignUp from './SignUp/SignUp';

export default class Auth extends Component {
  constructor() {
    super();
    this.state = {
      signIn: true,
    }
  }
  render() {
    return (
      <div className="Auth">
        <div className="auth-wrapper">
          <div className="auth-in-up">
            <button
              onClick={() => {this.setState({signIn: true})}}
              className={this.state.signIn ? 'active' : ''}
            >Sign In</button>
            <button
              onClick={() => {this.setState({signIn: false})}}
              className={!this.state.signIn ? 'active' : ''}
            >Sign Up</button>
          </div>
          <div className="auth-form">
            {this.state.signIn ? <SignIn /> : <SignUp />}
          </div>
        </div>
      </div>
    );
  }
}
