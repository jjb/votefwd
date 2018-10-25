// Utility functions for Dates
// --------------------------------------------------

// TODO maybe also abstract REACT_APP_DATE_TO_ENABLE_PLEDGE flag from voterService.js here

/**
 * Letters are ready to be sent if today's date is after
 * the environment REACT_APP_DATE_TO_SEND_LETTERS (or '2018-10-30' by default)
 * TODO this should probably be handled via a config API, or eventually maybe per district, this is a quick fix
 */

import moment from 'moment';

export function readyToSendLetters() {
  const sendDateString = process.env.REACT_APP_DATE_TO_SEND_LETTERS ? process.env.REACT_APP_DATE_TO_SEND_LETTERS : '2018-10-30';
  return moment().isAfter(sendDateString);
}

export function getLetterSendDate() {
  const sendDateString = process.env.REACT_APP_DATE_TO_SEND_LETTERS ? process.env.REACT_APP_DATE_TO_SEND_LETTERS : '2018-10-30';
  return moment(sendDateString);
}


