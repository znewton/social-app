import React, { Component } from 'react';
import './Input.scss';

export default class Input extends Component {
  handleChange(e) {
    const target = e.target;
    const value = target.value;
    this.props.onChange(value);
  }
  render() {
    return (
      <div className="Input">
        <input
          type={this.props.type}
          id={this.props.name+'-input'}
          name={this.props.name}
          onChange={this.handleChange.bind(this)}
          value={this.props.value}
          placeholder={this.props.label}
        />
      </div>
    );
  }
}
