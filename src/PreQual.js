//src/PreQual.js

import React, { Component } from 'react';
import CheckPreQual from './CheckPreQual';

class PreQual extends Component {
  // eslint-disable-next-line
  constructor(props) {
    super(props)

    this.state = {
      component: this.props.component
    };
    this.passComponent = this.bind.passComponent(this);
  }

  passComponent() = (componentValue) => {
    this.setState({component: componentValue});
  }

  render() {

    let component = this.state.component;
    console.log(`component in PreQual is ${this.props.component}`);

    return (
      <div>
        <CheckPreQual component={this.passComponent} />
         {component}
         </div>

    );
  }
}

export default PreQual
