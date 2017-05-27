import React, { Component } from 'react';
import Input from '../../../Components/Input/Input';

export default class UserSettings extends Component {
  constructor() {
    super();
    this.state = {
      settings: {
        notifications: true,
        ads: true,
      },
      unsavedChanges: false,
    };
  }
  componentDidMount() {

  }
  handleInput(name, val) {
    let settings = this.state.settings;
    settings[name] = val;
    this.setState({settings: settings, unsavedChanges: true});
  }
  render() {
    return (
      <div className="UserSettings">
        <form>
          <Input
            type="checkbox"
            value={this.state.settings.notifications}
            onChange={(value) => this.handleInput('notifications', value)}
            name="notifications"
            label="Notifications"
          />
          <Input
            type="checkbox"
            value={this.state.settings.ads}
            onChange={(value) => this.handleInput('ads', value)}
            name="ads"
            label="Ads"
          />
        </form>
        <div className="footer">
          <div style={{textAlign: 'right'}}>
            <button onClick={() => this.handlSave()} className="btn success"><span className="fa fa-cloud-upload" aria-hidden="true" /> Save</button>
          </div>
        </div>
      </div>
    );
  }
}
