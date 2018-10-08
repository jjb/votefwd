// src/Faq.js

import React, { Component } from 'react';
import { Header } from './Header';
import { Footer } from './Footer';

class QsAndAs extends Component {
  render() {
    return(
      <div className="container">
        <div className="p-5">

          <div className="mb-5">
            <h1>Frequently Asked Questions </h1>
            <p>If you have a question not addressed here, <a href="https://bit.ly/votefwd-contact">contact us</a>.</p>
          </div>

          <div className="mb-5">
            <h2>What does the letter-writing process entail?</h2>
            <p>
              When you first sign up, you’ll be asked a few basic questions to make sure you’re a human being with good intentions. We review and approve new volunteers at least twice a day, so within 12 hours or so, you should receive a welcome email with detailed instructions. After clicking a button to “adopt” some voters, you’ll download and print a PDF, then hand-write a single sentence on each letter, address, stamp, and set it aside to send on October 30. <a href="https://www.youtube.com/watch?v=UCPb-SFWYB4" target="_blank" rel="noopener noreferrer">Link to a demo video on YouTube.</a>
            </p>
          </div>

          <div className="mb-5">
            <h2>How many letters do I have to complete?</h2>
            <p>
              The minimum commitment is five letters, but you can do as many as you like!
            </p>
          </div>

          <div className="mb-5">
            <h2>Who pays for the stamps?</h2>
            <p>
              Vote Forward is a bring-your-own-stamps operation. We understand that the cost can add up. That’s part of why the minimum commitment is low (five letters).
            </p>
          </div>

          <div className="mb-5">
            <h2>How long does it take to get approved?</h2>
            <p>
              We review new volunteers twice each day, so on average, you can expect to be approved within about 12 hours of completing the signup process. Please be patient, we’re welcoming you all as fast as we can!
            </p>
          </div>

          <div className="mb-5">
            <h2>What should I write?</h2>
            <p>
              Heartfelt personal messages are best. Some people mention civic responsibility (“it’s my duty as a citizen...”). Others talk about how hard-won the right to vote has been. You could also describe memories from childhood of going to the polls with your parents, or doing the same with your kids. It’s fine to mention specific issues, just be careful not to assume the recipient agrees with your policy preferences. And make sure not to mention candidates by name!
            </p>
          </div>

          <div className="mb-5">
            <h2>How is this different from #PostcardsToVoters?</h2>
            <p>
              Vote Forward letters are only partially handwritten, so they’re very fast to prepare (~90 seconds per letter). They are also evidently significantly more effective than postcards. The evidence we’ve seen suggests that postcards can yield a roughly 0.7 percentage point increase in turnout. By contrast, letters have been shown to increase turnout by as much as 3.4 percentage points. We hypothesize that recipients are more likely to take them seriously, because they’re a bit more formal.
            </p>
          </div>

          <div className="mb-5">
            <h2>Are we sending letters to everyone, or just Democrats?</h2>
            <p>
              We are carefully targeting letters to voters with the greatest influence on control of Congress. In most cases, voters are less than 75% likely to cast a ballot, but if they do vote, are more than 90% likely to vote for the Democratic candidate.
            </p>
          </div>

          <div className="mb-5">
            <h2>How did you choose the districts?</h2>
            <p>
              Starting from <a href="https://swingleft.org?utm_source=votefwd" target="_blank" rel="noopener noreferrer">Swing Left</a>’s list of 78 target districts, we’re focusing on the ones the <a href="https://projects.fivethirtyeight.com/2018-midterm-election-forecast/house?utm_source=votefwd" target="_blank" rel="noopener noreferrer">538 congressional model</a> projects will be closest. These are the districts most likely to determine control of the House. We also prioritize districts in states with important senate or gubernatorial races, and districts where we connections on the ground who can help kickstart volunteer efforts.
            </p>
          </div>

          <div className="mb-5">
            <h2>Do I have to use my full name and return address?</h2>
            <p>
              No! If you prefer not to sign your full name, you can use your first name and last initial. All letters are sent with an in-district return address, a UPS store mailbox. This way, after the election, we can tell which letters were not delivered.
            </p>
          </div>

          <div className="mb-5">
            <h2>Why wait to send the letters until October 30? Wouldn’t it be better to send them earlier?</h2>
            <p>
              There’s convincing evidence that the effects of this kind of message fade very fast, so we’re pretty sure October 30 is the optimal sending date, getting letters in mailboxes as close as possible to the election without missing it. There may be some benefits to sending letters earlier, because recipients have more time to act. But those benefits would almost certainly be outweighed by the downside, that many people would forget about the letter by the time election day arrives. The one exception is if you’re sending letters from Alaska, Hawaii, or somewhere else outside the continental US, in which case you should probably send them a few days earlier.
            </p>
          </div>

          <div className="mb-5">
            <h2>Where does the data come from?</h2>
            <p>
              Ultimately the data we’re using originates with state elections boards. They make voter rolls and histories available to the public in the interest of electoral system transparency, and to facilitate campaigning by candidates and independent organizations like Vote Forward. In most cases, we purchase data from <a href="https://www.catalist.us/" target="_blank" rel="noopener noreferrer">Catalist</a>, which standardizes the data the states provide into a unified format. Our vote propensity and partisanship predictions also come from Catalist.
            </p>
          </div>

        </div>
      </div>
    );
  }
}

class Faq extends Component {
    render() {
      return (
        <React.Fragment>
          <Header auth={this.props.auth}/>
          <QsAndAs />
          <Footer />
        </React.Fragment>
      );
    }
  }

export default Faq;
