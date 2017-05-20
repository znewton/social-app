import React, { Component } from 'react';
import './DropMenu.scss';
import { addEndEventListener } from '../../Resize/Resize';

const TOPLEFT = 0;
const TOP = 1;
const TOPRIGHT = 2;
const LEFT = 3;
const RIGHT = 4;
const BOTTOMLEFT = 5;
const BOTTOM = 6;
const BOTTOMRIGHT = 7;

class DropMenu extends Component {
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
    this.updatePosition(document.querySelector(this.props.bindTo));
    addEndEventListener(window, 'resize', () => {this.updatePosition(document.querySelector(this.props.bindTo))}, 100);
  }
  updatePosition(element) {
    if(!element) return;
    const box = element.getBoundingClientRect();
    switch(this.props.from) {
      case TOPLEFT:
        this.setState({top: box.bottom, left: box.left, origin: 'top left'})
        break;
      case TOP:
        this.setState({top: box.bottom, left: box.left-box.width/2, origin: 'top middle'})
        break;
      case TOPRIGHT:
        this.setState({top: box.bottom, right: window.innerWidth - box.right, origin: 'top right'})
        break;
      case LEFT:
        this.setState({top: box.top-box.height/2, left: box.right, origin: 'left middle'})
        break;
      case RIGHT:
        this.setState({top: box.top-box.height/2, right: window.innerWidth - box.right, origin: 'middle right'})
        break;
      case BOTTOMLEFT:
        this.setState({bottom: box.top, left: box.left, origin: 'bottom left'})
        break;
      case BOTTOM:
        this.setState({bottom: box.top, left: box.left-box.width/2, origin: 'bottom center'})
        break;
      case BOTTOMRIGHT:
        this.setState({bottom: box.top, right: window.innerWidth -  box.right, origin: 'bottom right'})
        break;
    }
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
  from: React.PropTypes.oneOf([
    TOPLEFT,    TOP,    TOPRIGHT,
    LEFT,               RIGHT,
    BOTTOMLEFT, BOTTOM, BOTTOMRIGHT,
  ]),
}

DropMenu.defaultProps = {
  open: false,
  from: TOP,
};

export default DropMenu;

module.exports = {
  DropMenu,
  TOPLEFT, TOP, TOPRIGHT,
  LEFT, RIGHT,
  BOTTOMLEFT, BOTTOM, BOTTOMRIGHT
}
