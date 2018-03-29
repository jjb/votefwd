// src/Recaptcha.js

import React from 'react';
import ReCAPTCHA from 'react-google-recaptcha';

  // site key
const sitekey = '6LfK1U8UAAAAAFcUIcZ8Prguc7QNAkLC1z9zNKBs';

function onChange(value) {
  console.log("Captcha value:", value);
}

export class RecaptchaComponent extends React.Component {
  render() {
    return (
      <ReCAPTCHA
        ref="recaptcha"
        sitekey={sitekey}
        onChange={onChange}
      />
    );
  }
}
