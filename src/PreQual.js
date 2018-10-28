//src/PreQual.js
import React, { Component } from 'react';
import CheckPreQual from './CheckPreQual';

class PreQual extends Component {

  constructor(props) {
    super(props)
    this.state = {
      component: this.props.component
    };
    this.passComponent = this.passComponent.bind(this);
  }

  passComponent(component) {
    this.setState({component: this.props.component});
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
