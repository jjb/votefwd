// src/Masthead.js
// Landing Page Masthead

import React, { Component } from 'react';
import { Logo } from './Logo';
import { Link } from './Link';
import { Login } from './Login';

export class Masthead extends Component {
	render() {
	  return (
		<header className="landing--masthead px-lg-5">
		  <div className="container-fluid">
				<div className="row hero-wrapper">
					<div className="col-12 col-md-4 position-relative d-flex flex-column">
					<div className="logo-wrapper">
						<a href="/">
							<Logo />
						</a>
					</div>
					<div className="hero-graphic"></div>
					</div>
					<div className="col-12 col-md-8 d-flex align-items-center">
            <div className="col-12 px-4 px-md-3 px-xl-4">
              <h2 className="text-uppercase mb-md-4">Flip the House Blue</h2>
              <div className="pb-5 pb-md-0">
              <h3 className="mb-4">
                Send letters to unlikely voters
              </h3>
            <div className="mt-5">
              { this.props.auth.isAuthenticated() ?
                (
                  <div className="card">
										<div className="card-body">
											<p>You‘re already signed in!</p>
											<a href="/dashboard">
												<button type="button" className="btn btn-success btn-lg">
													Click here to send letters
												</button>
											</a>
										</div>
                  </div>
                ) :
                (
                  <React.Fragment>
                    <Login auth={this.props.auth} buttonText="Sign Up Or Log In To Send Letters" />
                  </React.Fragment>
                )
              }
            </div>
          </div>
						<p className="mt-3 text-white">
							<span className="mr-1">Received a letter?</span>
							<Link href="/pledge" hoverDark>
								Click here to pledge to vote
							</Link>.
						</p>
					</div>
					</div>
				</div>
		  </div>
		</header>
	  );
	}
}
