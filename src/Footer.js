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
					<p className="text-white small mb-4 mb-lg-0">Copyright &copy; Vote Forward 2018. All Rights Reserved.</p>
			    <p className="text-white link small">
            <a href="/faq">FAQ</a> &#9702; <a href="/privacy-policy">Privacy Policy</a> &#9702; <a href="/terms-of-use">Terms of Use</a> &#9702; <a target="_blank" rel="noopener noreferrer" href="https://bit.ly/votefwd-contact">Contact</a> &#9702; <a target="_blank" rel="noopener noreferrer" href="https://bit.ly/votefwd-donate">Donate</a>
          </p>
			    <p className="text-white link small">
            <a href="/vote-forward-party-kit.pdf" target="_blank" rel="noopener noreferrer">Party Kit</a> &#9702;
            <a href="/vote-forward-instructions.pdf" className="ml-2" target="_blank" rel="noopener noreferrer">Instructions</a> &#9702;
            <a href="https://www.youtube.com/watch?v=UCPb-SFWYB4" className="ml-2" target="_blank" rel="noopener noreferrer">Video Demo</a>
          </p>
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
