// src/Recaptcha.js

import React from 'react';
import ReCAPTCHA from 'react-google-recaptcha';

const sitekey = '6LfK1U8UAAAAAFcUIcZ8Prguc7QNAkLC1z9zNKBs';

export class RecaptchaComponent extends React.Component {
  render() {
    console.log(this.props);
    return (
      <ReCAPTCHA
        ref="recaptcha"
        sitekey={sitekey}
        onChange={this.props.handleSuccess}
      />
    );
  }
}
