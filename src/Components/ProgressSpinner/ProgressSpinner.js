import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './ProgressSpinner.scss';

export default class ProgressSpinner extends Component {
  render() {
    return (
      <div className="ProgressSpinner">
        <span className={`fa fa-circle-o-notch fa-spin fa-${this.props.size}x`} />
      </div>
    );
  }
}

ProgressSpinner.propTypes = {
  size: PropTypes.number,
};

ProgressSpinner.defaultProps = {
  size: 3,
};
