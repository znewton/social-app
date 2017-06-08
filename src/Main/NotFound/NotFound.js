import React, { Component } from 'react';
import PropTypes from 'prop-types';

export default class NotFound extends Component {
  constructor() {
    super();
    this.state = {};
  }
  render() {
    return (
      <div className="NotFound">
        NotFound
      </div>
    );
  }
}

NotFound.propTypes = {};

NotFound.defaultProps = {};
