import React, { Component } from 'react';
import Input from '../../../Components/Input/Input';

export default class UserSettings extends Component {
  constructor() {
    super();
    this.state = {
      notifications: true,
    };
  }
  componentDidMount() {

  }
  handleInput(name, val) {
    this.setState({[name]: val});
  }
  render() {
    return (
      <div className="UserSettings">
        <form>
          <Input
            type="checkbox"
            value={this.state.notifications}
            handleChange={(value) => this.handleInput('notifications', value)}
            name="notifications"
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
