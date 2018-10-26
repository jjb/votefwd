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
    console.log(`component in PreQual is ${this.props.component}`);

    return (
      <div>
        <CheckPreQual component={component} />
         {component}
         </div>

    );
  }
}

export default PreQual
