// src/Recaptcha.js

import React from 'react';
import ReCAPTCHA from 'react-google-recaptcha';

export class RecaptchaComponent extends React.Component {
  render() {

    return (
      <ReCAPTCHA
        ref="recaptcha"
        sitekey={process.env.REACT_APP_RECAPTCHA_SITE_KEY}
        onChange={this.props.handleSuccess}
      />
    );
  }
}
