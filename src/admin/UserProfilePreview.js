// src/UserProfilePreview.js
// Admin : User Preview Modal Content

import React, { Component } from 'react';
import axios from 'axios';

export class UserProfilePreview extends Component {
	constructor(props) {
		super(props);
		this.escModal = this.escModal.bind(this);
		this.state = { city: '', state: '' };
	}

	escModal(event) {
	  if (event.keyCode === 27) {
      this.props.closeModal();
    }
  }

  getAndSetLocation() {
    axios({
      method: 'GET',
      headers: {Authorization: 'Bearer '.concat(localStorage.getItem('access_token'))},
      url: `${process.env.REACT_APP_API_URL}/lookup-zip-details`,
      params: { zip: this.props.user.zip }
    })
    .then(res => {
      this.setState({city: res.data[0].city, state: res.data[0].state});
    })
    .catch(err => {
      console.error(err);
    });
  }

  componentWillMount() {
    this.getAndSetLocation();
  }

  componentDidMount(){
    document.addEventListener("keydown", this.escModal, false);
  }
  componentWillUnmount(){
    document.removeEventListener("keydown", this.escModal, false);
  }

	render() {
	  let emailBody = "&body=dear " + this.props.user.full_name;
	  let emailSubject = "&subject=Letters to voters"
		let emailUrl = "mailto:" + this.props.user.email + "?" + emailSubject + emailBody;
		let twitterUrl = "https://www.twitter.com/" + this.props.user.twitter_profile_url;
		let facebookUrl = "https://www.facebook.com/" + this.props.user.facebook_profile_url;
		let linkedinUrl = "https://www.linkedin.com/in/" + this.props.user.linkedin_profile_url;

		return (
			<div
				className="modal"
				tabIndex="-1"
				role="dialog"
				aria-hidden="true"
			>
				<div className="modal-dialog" role="document">
				<div className="modal-content">
					<div className="modal-header py-1">
						<h5 className="modal-title">{this.props.user.full_name}</h5>
						<button
							type="button"
							className="close"
							data-dismiss="modal"
							aria-label="Close"
							onClick={this.props.closeModal}
						>
							<span aria-hidden="true">&times;</span>
						</button>
					</div>
					<div className="modal-body">
						<table className="table">
							<tbody>
								{this.props.user.email &&
									<tr>
										<td width="40%">Email Address</td>
										<td>
											<a href={emailUrl}>
												{this.props.user.email}
											</a>
										</td>
									</tr>
								}

								{this.props.user.twitter_profile_url &&
									<tr>
										<td width="40%">Twitter profile</td>
										<td>
											<a href={twitterUrl} target="_blank">
												@{this.props.user.twitter_profile_url}
											</a>
										</td>
									</tr>
								}

								{this.props.user.facebook_profile_url &&
									<tr>
										<td width="30%">Facebook profile</td>
										<td>
											<a href={facebookUrl} target="_blank">
												facebook.com/{this.props.user.facebook_profile_url}
											</a>
										</td>
									</tr>
								}

								{this.props.user.linkedin_profile_url &&
									<tr>
										<td width="30%">LinkedIn profile</td>
										<td>
											<a href={linkedinUrl} target="_blank">
												linkedin.com/in/{this.props.user.linkedin_profile_url}
											</a>
										</td>
									</tr>
								}

								{this.props.user.zip &&
									<tr>
										<td width="30%">Location</td>
										<td>
                    {this.state.city && <span>{this.state.city}, {this.state.state} </span>}
                    {this.props.user.zip}
										</td>
									</tr>
								}

								{this.props.user.why_write_letters &&
									<tr>
										<td width="30%">Why write letters?</td>
										<td>
											{this.props.user.why_write_letters}
										</td>
									</tr>
								}
							</tbody>
						</table>
					</div>
				</div>
				</div>
			</div>
		);
	}
}
