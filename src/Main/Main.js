import React, { Component } from 'react';
import { HashRouter, Route, Switch } from 'react-router-dom';
import firebase from 'firebase';

import Navbar from './Navbar/Navbar';
import Profile from './Profile/Profile';
import Feed from './Feed/Feed';
import Chat from './Chat/Chat';
import NotFound from './NotFound/NotFound';

export default class Main extends Component {
  render() {
    return (
      <HashRouter>
        <main className="Main">
          <Navbar />
          <Switch>
            <Route exact path="/" component={Feed} />
            <Route path="/chat" component={Chat} />
            <Route path="/profile(/:uid)?" component={({ match }) => <Profile uid={match.params.uid || firebase.auth().currentUser.uid} />} />
            <Route path="*" component={NotFound} />
          </Switch>
        </main>
      </HashRouter>
    );
  }
}
