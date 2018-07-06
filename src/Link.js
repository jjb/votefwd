// src/Link.js
// Basic HTML Link

import React, { Component } from 'react';
import {css} from 'emotion';
export class Link extends Component {
	render() {
		const linkClass = (this.props.hoverDark) ? css`
			&:hover {
				color: #00E6FF;
			}
		` : '';
		return (
			<a
				href={this.props.href}
				className={linkClass}
			>
				{this.props.children}
			</a>
		);
	}
}
