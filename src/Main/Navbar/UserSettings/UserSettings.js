import React, { Component } from 'react';
import firebase from 'firebase';
import Input from '../../../Components/Input/Input';

import { getUserByUid, resetUserSettings, saveUserSettings, defaultUserSettings } from '../../../lib/Firebase/Functions';

export default class UserSettings extends Component {
  constructor() {
    super();
    this.state = {
      settings: defaultUserSettings,
      unsavedChanges: false,
    };
  }
  getUserSettings() {
    getUserByUid(firebase.auth().currentUser.uid).then(user => {
      if(user.settings) {
        this.setState({settings: user.settings});
      } else {
        resetUserSettings()
        .then((defaultUserSettings) => {
          this.setState({settings: defaultUserSettings});
        });
      }
    });
  }
  componentDidMount() {
    this.getUserSettings();
  }
  handleInput(name, val) {
    let settings = this.state.settings;
    settings[name] = val;
    this.setState({settings: settings, unsavedChanges: true});
  }
  handleSave() {
    saveUserSettings(this.state.settings).then((settings) => this.setState({settings: settings, unsavedChanges: false}));
  }
  render() {
    console.log()
    return (
      <div className="UserSettings">
        <form>
          {Object.keys(this.state.settings).sort().map(key => (
            <Input
              key={key}
              type="checkbox"
              value={this.state.settings[key]}
              onChange={(value) => this.handleInput(key, value)}
              name={key}
              label={(key.charAt(0).toUpperCase() + key.slice(1)).match(/[A-Z][a-z]+/g).join(' ')}
            />
          ))}
        </form>
        <div className="footer">
          <div style={{textAlign: 'right'}}>
            <button onClick={() => this.handleSave()} className="btn success" disabled={!this.state.unsavedChanges}><span className="fa fa-cloud-upload" aria-hidden="true" /> Save</button>
          </div>
        </div>
      </div>
    );
  }
}
