import React, { Component } from 'react';
import Modal from '../../Components/Modal/Modal';
import Positioning from '../../Positioning/Positioning';

export default class Profile extends Component {
  constructor() {
    super();
    this.state = {
      modalOpen: false,
    };
  }
  render() {
    return (
      <div className="Profile">
        Profile
        <button id="modalOpener" onClick={() => this.setState({modalOpen: true})}>Modal Test</button>
        <Modal
          header="Modal"
          footer={<div>Footer</div>}
          handleClose={() => this.setState({modalOpen: false})}
          open={this.state.modalOpen}
          bindTo="#modalOpener"
        >
          Modal Test
        </Modal>
      </div>
    );
  }
}
