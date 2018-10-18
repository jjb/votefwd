// src/Privacy.js

import React, { Component } from 'react';
import { Header } from './Header';
import { Footer } from './Footer';

class Support extends Component {
  render() {
    return (
      <div>
        <Header auth={this.props.auth}/>

          <div className="container">
          
            <div className="p-5">

              <div className="mb-5">
                <h1>Help and Support</h1>
                <p>This page is for technical issues. Have questions about the process? Try our <a href="/support">Frequently Asked Questions</a>.</p>

              </div>
              
              <div className="mb-5">
                <h2>I can’t sign in!</h2>
                <p>
                  We’re so sorry! You may be having trouble for these reasons:
                </p>
                <ul>
                  <li><strong>Haven’t signed up yet?</strong> <a href="/">Sign up for an account</a> first. We’ll ask for your name, email address, and zip code, and the approval process takes 12-36 hours. Once you’re in, you’ll be able to adopt voters and print letters.</li>
                  <li><strong>Just signed up?</strong> The approval process takes 12-36 hours, and you’ll get an email when your account is approved. (Check your spam folder if it’s been longer, or just try <a href="/dashboard">logging in anyway</a>.)</li>
                  <li><strong>My password doesn’t work!</strong> This might happen if you signed up using your Facebook or Google account; if you did, you’ll need to use the same method to log back in. Try <a href="/dashboard">logging back in</a>, but using your Google or Facebook account instead, if that’s what you used to sign up.</li>
                  <li><strong>I can’t reset my password!</strong> If you signed up using a Facebook or Google account, there’s no password to reset (but for security reasons, the system won’t say so). Try <a href="/dashboard">logging back in</a>, but using your Google or Facebook account instead, if that’s what you used to sign up.</li>
                  <li><strong>It just won’t work!</strong> As a last resort, try restarting your browser (or better yet, your whole computer) and <a href="/">trying again</a>. If you’re still stuck, get in touch with us at the bottom of this page.</li>
                </ul>

              </div>
              
              <div className="mb-5">
                <h2>I can’t print my letters!</h2>
                <p>Try these steps:</p>
                <ol>
                  <li>Log in to your <a href="/dashboard">Vote Forward dashboard</a> and, if you haven’t already, adopt some voters.</li>
                  <li>Look for the “Download All” button, which will download a PDF file of letters to your computer.</li>
                  <li>Find that PDF file. Each computer system is different, but it’s often in a folder named “Downloads”, or it may appear automatically. (The filename will be something like <em>2018-10-08-votefwd-letters-batch-of-25.pdf</em>, though with today’s date.)</li>
                  <li>Print that file! Names, addresses, special return addresses, and cover sheets are included. </li>
                </ol>
                
              </div>
              
              <div className="mb-5">
                <h2>My list of voters disappeared!</h2>
                <p>
                  This might happen if you signed up using a Facebook account, but logged back in using a Google account or a username and password (or vice versa). This can create duplicate accounts, which is a bug we’re working to fix. Try <a href="/dashboard">logging out and back in</a>, but using whatever you used to sign up (Facebook, Google, or a username and password).      
                </p>

              </div>

              <div className="mb-5">
                <h2>I have too many voters! Can you remove some?</h2>
                <p>
                Once voters are adopted, they can only be removed manually by us. To request removal:
                </p>
                <ol> 
                <li>Log in to your <a href="/dashboard">dashboard</a> and mark <strong>each of the voters you have completed or will complete</strong> as “prepared.” They will move to the “Letters Prepared” list.</li>
                <li><a href="mailto:help@votefwd.org?subject=Please+remove+extra+voters">Let us know</a> you’ve marked your voters, and we’ll manually remove the voters remaining in your “Letters to Prepare” list. (This may take 24-48 hours and we’ll email you when it’s done.)</li>
                </ol>
              </div>
              
              <div className="mb-5">
                <h2>My district is out of names!</h2>
                <p>
                It’s incredible&mdash;demand has been so great that we’re starting to run out of addresses! We’re adding more voters and districts as fast we can (we have to pay for names, and loading takes time). In the meantime, click “Switch District” in your <a href="/dashboard">Vote Forward dashboard</a> to find another district with outstanding voters to adopt.
                </p>
              </div>
              
              <div className="mb-5">
                <h2>I don’t have a printer!</h2>
                <p>
                You might consider using a local print shop or office supply store. They’ll often accept the PDF of letters on a thumb drive or via email. If you prefer to hand-write the letters or it’s your only option, feel free! Just be sure to include the individual voter code and web address we provide at the bottom of our pre-printed letters; that’s for the recipient to use on our website to find out more info about the election.
                </p>
              </div>

              <div className="mb-5">
                <h2>One of the addresses is bad!</h2>
                <p>
                We have occasionally run into a few bad addresses in the database. Our best advice for now is to move on and complete other letters. Feel free to mark that voter as “prepared” so it doesn’t get reprinted if you decide to adopt more voters.
                </p>                
              </div>      

              <div className="mb-5">
                <h2>Should I send the letters early?</h2>
                <p>
                We‘re very confident October 30 is the right choice. There’s strong evidence that the effects of these messages fade quickly. The advantages of sending earlier&mdash;including for early voting and vote-by-mail&mdash;are almost certainly outweighed by the disadvantages.</p>
                <p>However, <em>if you’re mailing from outside the continental United States,</em> please do send them a bit earlier, as appropriate for your location.
                </p>                
              </div>     
                                              
              <div className="mb-5">
                <h2>Why is the voter’s name and address, and a special code, in the letter?</h2>
                <p>
                The code is unique to each voter, and should stay. It lets them use the website to get detailed information about their own ballot, and confirm their pledge to vote.
                </p>                
              </div>              

              <div className="mb-5">
                <h2>Still stuck?</h2>
                <p>
                  Send us an email at <a href="mailto:help@votefwd.org">help@votefwd.org</a>. We’re a small group of volunteers, and demand has been extraordinary, so we may be a little slow to respond. We’ll reply as soon as we can, and thank you! 
                </p>
              </div>
              
            </div>        
          
          </div>
        <Footer />
      </div>
    );
  }
}

export default Support
