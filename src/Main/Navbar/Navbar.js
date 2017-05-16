import React, { Component } from 'react';
import firebase from 'firebase';

export default class Navbar extends Component {
  handleSignOut() {
    firebase.auth().signOut().then(function() {
      // Sign-out successful.
    }).catch(function(error) {
      // An error happened.
    });
  }
  render() {
    const displayName = firebase.auth().currentUser.displayName || firebase.auth().currentUser.displayName.match(/^([^@]*)@/)[1];
    return (
      <nav className="Navbar">
        <div className="nav-left">
          <span className="logo">Social</span>
        </div>
        <div className="nav-middle">
          <a href="/#/profile" className="profile-link"><span className="fa fa-user-circle-o fa-fw" /> <span>Profile</span></a>
          <a href="/#/feed"><span className="fa fa-bars fa-fw" /> <span>Feed</span></a>
          <a href="/#/chat"><span className="fa fa-comments fa-fw" /> <span>Chat</span></a>
        </div>
        <div className="nav-right">
          <span className="user"><span className="greeting">Hello, </span><a href="/#/profile">{displayName}</a></span>
          <button onClick={this.handleSignOut.bind(this)}><span className="fa fa-unlock-alt" /> Sign Out</button>
        </div>
      </nav>
    );
  }
}
