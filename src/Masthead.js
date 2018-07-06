// src/Masthead.js
// Landing Page Masthead

import React, { Component } from 'react';
import { Logo } from './Logo';
import { Link } from './Link';
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
							Find a voter, send a letter
						</h3>
						<form
							className="hero-form-wrapper validate"
							action="https://votefwd.us18.list-manage.com/subscribe/post?u=2d49ba28099a6f9c850c21428&amp;id=33e15c2ab0"
							method="post"
							id="mc-embedded-subscribe-form"
							name="mc-embedded-subscribe-form"
							target="_blank"
							noValidate>
							<div className="form-row m-0">
							<input type="email" name="EMAIL" className="form-control form-control-lg col-8" placeholder="Enter your email..." />
							<button type="submit" name="subscribe" className="btn btn-block btn-lg btn-primary col-4">Sign up!</button>
							</div>
							<div className="u-offscreen" aria-hidden="true"><input type="text" name="b_2d49ba28099a6f9c850c21428_33e15c2ab0" tabIndex="-1" /></div>
						</form>
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
