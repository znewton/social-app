import React, { Component } from 'react';
import './Modal.scss';
import { addEndEventListener } from '../../Events/Events';
import Positioning from '../../Positioning/Positioning';

export default class Modal extends Component {
  constructor() {
    super();
    this.state = {
      origin: null,
    };
  }
  componentDidMount() {
    this.setState({
      origin: Positioning.updateOriginFromCoordinates(document.querySelector(this.props.bindTo))
    });
    addEndEventListener(window, 'resize', () => this.setState({
      origin: Positioning.updateOriginFromCoordinates(document.querySelector(this.props.bindTo))
    }), 100);
  }
  render() {
    if(this.props.open) {
      document.body.style.overflow = "hidden";
    } else {
      delete document.body.style.overflow;
    }
    return (
      <div
        className={'Modal' + (this.props.open ? ' open' : '' )}
        style={{
          transformOrigin: this.state.origin,
        }}
        onClick={() => this.props.handleClose()}
      >
        <div
          className="modal"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="header">{this.props.header}</div>
          <div className="content">{this.props.children}</div>
          <div className="footer">{this.props.footer}</div>
        </div>
      </div>
    );
  }
}

Modal.propTypes = {
  open: React.PropTypes.bool,
  bindTo: React.PropTypes.string.isRequired,
  header: React.PropTypes.oneOfType([
    React.PropTypes.string,
    React.PropTypes.element,
  ]),
  footer: React.PropTypes.oneOfType([
    React.PropTypes.string,
    React.PropTypes.element,
  ]),
  handleClose: React.PropTypes.func.isRequired,
}

Modal.defaultProps = {
  open: false,
};
