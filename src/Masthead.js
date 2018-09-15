// src/Masthead.js
// Landing Page Masthead

import React, { Component } from 'react';
import { Logo } from './Logo';
import { Link } from './Link';
import { Login } from './Login';

export class Masthead extends Component {
  constructor(props) {
    super(props)

    this.state = { showingPrivacyNotice: false };
		this.escModal = this.escModal.bind(this);
    this.showPrivacyNotice = this.showPrivacyNotice.bind(this);
    this.hidePrivacyNotice = this.hidePrivacyNotice.bind(this);
  }

	escModal(event) {
	  if (event.keyCode === 27) {
	    this.hidePrivacyNotice();
    }
  }

  hidePrivacyNotice() {
    this.setState({ showingPrivacyNotice: false });
  }

  showPrivacyNotice() {
    this.setState({ showingPrivacyNotice: true });
  }

  componentDidMount(){
    document.addEventListener("keydown", this.escModal, false);
  }
  componentWillUnmount(){
    document.removeEventListener("keydown", this.escModal, false);
  }

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
                    <p className="mt-1 small text-white">
                      <a href="#privacy-notice" onClick={this.showPrivacyNotice}>
                        Privacy Promise
                      </a>
                    </p>
                    { this.state.showingPrivacyNotice &&
                      <div className="modal" tabIndex="-1" role="dialog">
                        <div className="modal-dialog" role="document">
                          <div className="modal-content">
                            <div className="modal-header">
                              <h5 className="modal-title">Our Privacy Promise</h5>
                              <button onClick={this.hidePrivacyNotice} type="button" className="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                              </button>
                            </div>
                            <div className="modal-body">
                              <p>We will never sell the personal information you share with us (including your name and email address) to anyone under any circumstances.</p>
                            </div>
                            <div className="modal-footer">
                              <button onClick={this.hidePrivacyNotice} type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
                            </div>
                          </div>
                        </div>
                      </div>
                    }
                  </React.Fragment>
                )
              }
            </div>
          </div>
						<p className="mt-3 text-white">
							<span className="mr-1">Received a letter?</span>
							<Link href="/vote" hoverDark>
								Click here
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
