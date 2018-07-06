// src/Footer.js
// Footer bottom content

import React, { Component } from 'react';

export class Footer extends Component {
	render() {
		return (
			<footer className="footer bg-gradient">
				<div className="container">
				<div className="row">
					<div className="col-lg-6 h-100 text-center text-lg-left my-auto">
					<p className="text-white small mb-4 mb-lg-0">&copy; Vote Forward PAC 2018. All Rights Reserved.</p>
					</div>
					<div className="col-lg-6 h-100 text-center text-lg-right my-auto">
					<ul className="list-inline mb-0">
						<li className="list-inline-item mr-3">
						<a href="https://fb.me/votefwd" target="_blank" rel="noopener noreferrer">
							<i className="text-lightblue fa fa-facebook fa-2x fa-fw"></i>
						</a>
						</li>
						<li className="list-inline-item mr-3">
						<a href="https://twitter.com/votefwd" target="_blank" rel="noopener noreferrer">
							<i className="text-lightblue fa fa-twitter fa-2x fa-fw"></i>
						</a>
						</li>
						<li className="list-inline-item">
						<a href="https://www.instagram.com/votefwd/" target="_blank" rel="noopener noreferrer">
							<i className="text-lightblue fa fa-instagram fa-2x fa-fw"></i>
						</a>
						</li>
					</ul>
					</div>
				</div>
				</div>
			</footer>
		);
	}
}
