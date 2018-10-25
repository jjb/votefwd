//src/PreQual.js

import React, { Component } from 'react';
import CheckPreQual from './CheckPreQual';

class PreQual extends Component {
  // eslint-disable-next-line
  constructor(props) {
    super(props);

  }

  render() {

    let component = this.props.component;

    return (
      <div>
        <CheckPreQual  />
         {component}
         </div>

    );
  }
}

export default PreQual
