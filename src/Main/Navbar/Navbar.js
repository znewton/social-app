import React, { Component } from 'react';
import firebase from 'firebase';
import { NavLink } from 'react-router-dom';

export default class Navbar extends Component {
  handleSignOut() {
    firebase.auth().signOut().then(function() {
      // Sign-out successful.
    }).catch(function(error) {
      // An error happened.
    });
  }
  render() {
    const displayName = firebase.auth().currentUser.displayName || firebase.auth().currentUser.email.match(/^([^@]*)@/)[1];
    return (
      <nav className="Navbar">
        <div className="nav-left">
          <span className="logo">Social</span>
        </div>
        <div className="nav-middle">
          <NavLink to="/profile" className="profile-link" activeClassName="active"><span className="fa fa-user-circle-o fa-fw" /> <span>Profile</span></NavLink>
          <NavLink exact to="/" activeClassName="active"><span className="fa fa-bars fa-fw" /> <span>Feed</span></NavLink>
          <NavLink to="/chat" activeClassName="active"><span className="fa fa-comments fa-fw" /> <span>Chat</span></NavLink>
        </div>
        <div className="nav-right">
          <span className="user"><span className="greeting">Hello, </span><NavLink to="/profile">{displayName}</NavLink></span>
          <button onClick={this.handleSignOut.bind(this)}><span className="fa fa-unlock-alt" /> Sign Out</button>
        </div>
      </nav>
    );
  }
}
