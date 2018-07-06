// src/CallToAction.js
// Blue Wave Sign up Block

import React, { Component } from 'react';

export class CallToAction extends Component {
	render() {
		return (
      <section className="landing--call-to-action text-white text-center">
        <div className="overlay"></div>
        <div className="container">
          <div className="w-75 mx-auto">
            <h2 className="mb-4">Help us flip the House. Sign up now!</h2>
            <p className="mb-5">
              We’ll be in touch soon to assign you some voters.
            </p>
            <div className="hero-form-wrapper">
                <form
                    action="https://votefwd.us18.list-manage.com/subscribe/post?u=2d49ba28099a6f9c850c21428&amp;id=33e15c2ab0"
                    method="post"
                    id="mc-embedded-subscribe-form"
                    name="mc-embedded-subscribe-form"
                    className="validate"
                    target="_blank"
                    novalidate
                >
                  <div className="form-row m-0">
                    <input
                      type="email"
                      name="EMAIL"
                      className="form-control form-control-lg col-8"
                      placeholder="Enter your email..."
                    />
                    <button
                      type="submit"
                      name="subscribe"
                      className="btn btn-block btn-lg btn-primary col-4">
                        Sign up!
                    </button>
                  </div>
                  <div
                    className="u-offscreen"
                    ariaHidden="true"
                  >
                    <input
                      type="text"
                      name="b_2d49ba28099a6f9c850c21428_33e15c2ab0"
                      tabindex="-1"
                    />
                  </div>
                </form>
              </div>
            </div>
          </div>
    </section>
    );
  }
}
