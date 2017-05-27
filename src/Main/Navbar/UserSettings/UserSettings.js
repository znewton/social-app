import React, { Component } from 'react';
import Input from '../../../Components/Input/Input';

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
        <form>
          <div className="form-row">
            <div className="form-label"><label>Notifications</label></div>
            <div className="form-input"><input  /></div>
          </div>
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
