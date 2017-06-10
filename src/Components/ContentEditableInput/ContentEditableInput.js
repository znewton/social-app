import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './ContentEditableInput.scss';

export default class ContentEditableInput extends Component {
  constructor(props) {
    super(props);
    this.state = {
      empty: props.value.length == 0
    }
    this.beforeFilter = props.value;
  }
  componentDidMount() {
    this.refs.input.innerText = this.props.value;
    if(this.props.displayFilter && this.refs.input.addEventListener) {
      this.refs.input.addEventListener('focusout', () => {
        this.beforeFilter = this.refs.input.innerText;
        this.refs.input.innerText = this.props.displayFilter(this.refs.input.innerText);
      }, false);
      this.refs.input.addEventListener('focus', () => {
        this.refs.input.innerText = this.beforeFilter;
      }, false);
      this.refs.input.innerText = this.props.displayFilter(this.refs.input.innerText);
    }
  }
  shouldComponentUpdate(nextProps, nextState) {
    let currentValue = this.refs.input.innerText;
    if(nextProps.value != currentValue) {
      currentValue = this.props.value;
    }
    return nextState.empty != this.state.empty;
  }
  handleChange(e) {
    let value = e.target.innerText;
    if (!value && !this.state.empty) this.setState({empty: true});
    else if (value && this.state.empty) this.setState({empty: false});
    this.props.onChange(value);
  }
  render() {
    return (
      <span className="ContentEditableInput">
        <span
          ref="input"
          style={{minWidth: this.props.placeholder.length + 'em'}}
          contentEditable={this.props.enabled}
          onInput={this.handleChange.bind(this)}
        />
        {this.state.empty &&
          <span ref="placeholder" className="placeholder">{this.props.placeholder}</span>
        }
      </span>
    );
  }
}

ContentEditableInput.propTypes = {};

ContentEditableInput.defaultProps = {};
