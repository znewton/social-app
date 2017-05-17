import React, { Component } from 'react';
import { HashRouter, Route, Switch } from 'react-router-dom';

import Navbar from './Navbar/Navbar';
import Profile from './Profile/Profile';
import Feed from './Feed/Feed';
import Chat from './Chat/Chat';

export default class Main extends Component {
  render() {
    return (
      <HashRouter>
        <main className="Main">
          <Navbar />
          <Switch>
            <Route exact path="/" component={Feed} />
            <Route path="/chat" component={Chat} />
            <Route path="/profile" component={Profile} />
          </Switch>
        </main>
      </HashRouter>
    );
  }
}
