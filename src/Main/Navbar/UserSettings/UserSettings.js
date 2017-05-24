import React, { Component } from 'react';

export default class UserSettings extends Component {
  constructor() {
    super();
    this.state = {};
  }
  componentDidMount() {

  }
  render() {
    return (
      <div className="UserSettings">
        UserSettings
        <div className="footer">
          <div style={{textAlign: 'right'}}>
            <button className="btn success">Save</button>
          </div>
        </div>
      </div>
    );
  }
}
