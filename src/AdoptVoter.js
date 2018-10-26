// src/AdoptVoter.js

import React, { Component } from 'react';
import axios from 'axios';
import { readyToSendLetters } from './utils/DateConfig';

export class AdoptVoter extends Component {
  constructor(props) {
    super(props);

    this.adoptVoter = this.adoptVoter.bind(this);
    this.state = { adopting: false, district: {} };
  }

  adoptVoter(numVoters, district_id) {
    this.setState({adopting: true});
    let user_id = localStorage.getItem('user_id');
    axios({
      headers: {Authorization: 'Bearer '.concat(localStorage.getItem('access_token'))},
      method: 'POST',
      url: `${process.env.REACT_APP_API_URL}/voter/adopt-random`,
      data: {
          adopterId: user_id,
          numVoters: numVoters,
          districtId: district_id
        }
      })
      .then(res => {
        setTimeout(function() {
          this.props.handleAdoptedVoter(res.data.voters);
          this.setState({adopting: false});
        }.bind(this), 500);
      })
      .catch(err => {
        console.error(err);
    })
  }

  componentWillReceiveProps(props) {
    if (props.currentDistrict.district_id) {
      this.setState({ district: props.currentDistrict });
    }
  }

  render() {
    let maxQual = parseInt(process.env.REACT_APP_QUAL_NUM || '100', 10);
    let maxedOut = false;
    if (this.props.user.qual_state === 'qualified' && this.props.voterCount >= maxQual)  {
      maxedOut = true;
    }
    let allClaimed = false;
    if (parseInt(this.props.currentDistrict.voters_available, 10) === 0) {
      allClaimed = true;
    }
    
    const readyToSend = readyToSendLetters();
        
    return (
      <div className="container-fluid p-0">
        <div className="row no-gutters position-relative">
          <div className="col-12 fixed-top position-absolute">
          </div>
          <div className="col-lg-6 order-lg-2 dashboard--call-to-action px-3 py-4" />
          <div className="col-lg-6 order-lg-1 showcase-text bg-light p-sm-5 p-2">
            
            { readyToSend && (
              <div className="p-2 p-5-m">
                <h3 className="mb-2">It’s time to mail your letters!</h3>
                
                { this.props.voterCount === 0 && (
                  <p className="u-highlight mb-3 d-none d-sm-block">
                    Our records show that you haven’t written any letters to voters encouraging them to vote in the November 6 election. We’ve closed the system to new letters, but we hope you’ll try again during the next election!
                  </p>
                )}
                
                { this.props.voterCount > 0 && (
                  <div>
                    <p className="u-highlight mb-3 d-none d-sm-block">
                      We‘ve disabled everyone from being able to adopt new voters, because it’s time to put all our letters in the mail! (If letters are outstanding:) Please prepare the rest of your letters, if they’re not already done, and mail them as soon as possible!
                    </p>
                    <p>
                      <strong>After you’ve mailed your letters,</strong> make sure you mark them as sent below.
                    </p>
                    <p>
                      <strong>Not able to send letters to all of your adopted voters?</strong> Email us at <a href="mailto:help@votefwd.org">help@votefwd.org</a> to let us know.
                    </p> 
                  </div>
                )}

                          
                <p>
                  <strong>What’s next?</strong> There’s a very good chance that there will be a special runoff election in Mississippi on November 27, 2018 to determine who will win the U.S. Senate race there. We’ve already acquired tens of thousands of voter addresses in Mississippi, and we’re going to need your help writing letters! So stay tuned for an email from us!
                </p> 
  
                          
              </div>
              // readyToSend
            )}
            
            { !readyToSend && (
              <div className="p-2 p-5-m">
                <h3>You’re helping flip <a href={'/district/' + this.state.district.district_id}><strong>{this.state.district.district_id}</strong></a> blue <button className="btn btn-link" onClick={this.props.toggleDistrictPicker}>Switch District</button></h3>
                <p className="u-highlight mb-3 d-none d-sm-block">
                  {this.state.district.description}
                </p>
                <div className="mt-4 mb-3">
                  <p className="small">Voters you adopt won‘t be assigned to anyone else, so when you adopt them, <strong>you’re committing to send the letters</strong>. For details on how this works, <a href="/vote-forward-instructions.pdf" target="_blank" rel="noopener noreferrer">download printable instructions</a> or <a href="https://www.youtube.com/watch?v=UCPb-SFWYB4" target="_blank" rel="noopener noreferrer">watch the video demo</a>. Hosting a letter-writing party? <a href="/vote-forward-party-kit.pdf" target="_blank" rel="noopener noreferrer">Download the party kit</a>.
                  </p>
                </div>
                <div className="row">
                  <div className="col-md">
                    <button
                      disabled={this.state.adopting || maxedOut || allClaimed ? true : false}
                      onClick={() => this.adoptVoter(5, this.state.district.district_id)}
                      className={'btn btn-lg w-100 mt-1 ' + ( this.props.voterCount === 0 ? 'btn-primary' : 'btn-outline-primary' ) }>
                        Adopt <span className="reset-num">5</span> {(this.props.voterCount > 1) ? "More" : "" } Voters
                    </button>
                    <div className="small mt-1">
                      <i className="fa fa-clock-o"></i>
                      <span className="ml-1">5 letters: ~10 min to prepare</span>
                    </div>
                  </div>
                  <div className="col-md">
                    <button
                      disabled={this.state.adopting || maxedOut || allClaimed ? true : false}
                      onClick={() => this.adoptVoter(25, this.state.district.district_id)}
                      className={'btn btn-lg w-100 mt-1 ' + ( this.props.voterCount === 0 ? 'btn-primary' : 'btn-outline-primary' ) }>
                        Adopt <span className="reset-num">25</span> {(this.props.voterCount > 1) ? "More" : "" } Voters
                    </button>
                    <div className="small mt-1">
                      <i className="fa fa-clock-o"></i>
                      <span className="ml-1">25 letters: ~40 min to prepare</span>
                    </div>
                  </div>
                </div>
                { maxedOut && (
                  <div className="mt-4 alert alert-info pr-4 pl-4">
                    <p>You’ve adopted the maximum number of voters ({process.env.REACT_APP_QUAL_NUM}). Fantastic! To become a super-volunteer so you can adopt more, please <a href="mailto:super@votefwd.org?subject=Please%20approve%20me%20as%20a%20super-volunteer!&amp;body=Hello!%20Please%20approve%20me%20to%20adopt%20more%20than%20100%20voters%20on%20Vote%20Forward.%20(Letter%20writer%3A%20replace%20this%20text%20with%20a%20short%20message%20to%20the%20admins%20and%2C%20for%20verification%2C%20attach%20a%20photo%20of%20some%20of%20your%20completed%20letters)." target="_blank" rel="noopener noreferrer">email super@votefwd.org</a> to request approval.</p>
                  </div>
                )}
                { allClaimed && (
                  <div className="mt-4 alert alert-warning pr-4 pl-4">
                    <p>
                      All targeted {this.props.currentDistrict.district_id} voters have been adopted! Please <button className="btn-link-underline" onClick={this.props.toggleDistrictPicker}>choose a different district.</button>
                    </p>
                  </div>
                )}
                { !maxedOut && this.props.voterCount > 0 && (
                  <div className="mt-4 alert alert-info pr-4 pl-4">
                    <p className="mb-0">You’ve adopted <span className="text-success">{this.props.voterCount}</span> voters. Fantastic!</p>
                  </div>
                )}
              </div>
            // !readyToSend
            )}

          </div>
        </div>
      </div>
    )
  }
}
