// src/Link.js
// Basic HTML Link

import React, { Component } from 'react';

export class Link extends Component {
	render() {
		return (
			<a href="{this.props.href}">
				{this.props.children}
			</a>
		);
	}
}
