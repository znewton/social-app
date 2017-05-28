import React, { Component } from 'react';
import firebase from 'firebase';
import { NavLink } from 'react-router-dom';
import Positioning from '../../lib/Positioning/Positioning';
import { addOneTimeEvent } from '../../lib/Events/Events';

import Modal from '../../Components/Modal/Modal';
import DropMenu from '../../Components/DropMenu/DropMenu';

import UserSettings from './UserSettings/UserSettings';

export default class Navbar extends Component {
  constructor() {
    super();
    this.state = {
      userMenuOpen: false,
      userSettingsOpen: false,
    }
  }
  handleSignOut() {
    firebase.auth().signOut().then(function() {}).catch(function(error) {});
  }
  handleMenuClick(e) {
    e.stopPropagation();
    this.setState({userMenuOpen: !this.state.userMenuOpen});
    addOneTimeEvent(window, 'click', () => this.setState({userMenuOpen: false}));
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
          <button
            id="UserMenuButton"
            onClick={this.handleMenuClick.bind(this)}>
            <span className="fa fa-ellipsis-v" />
          </button>
          <DropMenu open={this.state.userMenuOpen} from={Positioning.TOPRIGHT} bindTo="#UserMenuButton">
            <button onClick={() => this.setState({userSettingsOpen: true})}><span className="fa fa-cog" aria-hidden="true" /> Settings</button>
            <button onClick={this.handleSignOut.bind(this)}><span className="fa fa-unlock-alt" aria-hidden="true"  /> Sign Out</button>
          </DropMenu>
          <Modal
            header="User Settings"
            handleClose={() => this.setState({userSettingsOpen: false})}
            open={this.state.userSettingsOpen}
            bindTo="#UserMenuButton"
          >
            <UserSettings />
          </Modal>
        </div>
      </nav>
    );
  }
}
