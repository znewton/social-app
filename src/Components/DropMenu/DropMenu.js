import React, { Component } from 'react';
import './DropMenu.scss';
import { addEndEventListener } from '../../Events/Events';
import Positioning from '../../Positioning/Positioning';

export default class DropMenu extends Component {
  constructor() {
    super();
    this.state = {
      left: null,
      top: null,
      right: null,
      bottom: null,
      origin: null,
    };
  }
  componentDidMount() {
    this.setState(Positioning.updatePosition(document.querySelector(this.props.bindTo), this.props.from));
    addEndEventListener(window, 'resize', () => this.setState(Positioning.updatePosition(document.querySelector(this.props.bindTo), this.props.from)), 100);
  }
  render() {
    return (
      <div
        className={'DropMenu' + (this.props.open ? ' open' : '' )}
        style={{
          top: this.state.top,
          left: this.state.left,
          right: this.state.right,
          bottom: this.state.bottom,
          transformOrigin: this.state.origin,
        }}
      >
        {this.props.children}
      </div>
    );
  }
}

DropMenu.propTypes = {
  open: React.PropTypes.bool,
  bindTo: React.PropTypes.string.isRequired,
  from: React.PropTypes.number,
}

DropMenu.defaultProps = {
  open: false,
  from: Positioning.TOP,
};
