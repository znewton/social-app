import React, { Component } from 'react';
import firebase from 'firebase';
import { getUserByUid } from '../../lib/Firebase/Functions';

export default class Profile extends Component {
  constructor() {
    super();
    this.state = {
      user: null
    }
  }
  componentDidMount() {
    getUserByUid(this.props.uid).then((user) => {
      this.setState();
    });
  }
  render() {
    if(!user) {
      return 
    }
    return (
      <div className="Profile">
        Profile
      </div>
    );
  }
}
