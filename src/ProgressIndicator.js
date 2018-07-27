// src/ProgressIndicator.js

import React, { Component } from 'react';

export class ProgressIndicator extends Component {
  setWidth() {
    return `${(this.props.current / this.props.max) * 100}%`;
  }

  render() {
    return (
      <div className="mt-1 p-4 bg-light border-top">
        <div className="progress">
          <div className="progress-bar bg-success"
            role="progressbar"
            style={{width: this.setWidth()}}
            aria-valuenow={this.props.current}
            aria-valuemin="0"
            aria-valuemax={this.props.max}>
          </div>
        </div>
      </div>
    )
  }
}
