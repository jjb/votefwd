'use strict';

const Hashids = require('hashids');

const { REACT_APP_HASHID_SALT, REACT_APP_HASHID_DICTIONARY } = process.env
const hashids = new Hashids(REACT_APP_HASHID_SALT, 6, REACT_APP_HASHID_DICTIONARY);

const setHashIdForVoter = async (knex, obj) => {
  const voterId = obj.id
  const hashId = hashids.encode(voterId);

  return knex('voters')
    .where('id', voterId)
    .update('hashid', hashId)
    .catch(err=> {
      console.error('ERROR: ' , err);
    });
}

exports.up = function(knex, Promise) {
  return knex.select('id').table('voters')
    .where('hashid', null)
    .andWhereRaw('adopter_user_id is not null')
    .then(function(ids) {
      return ids.reduce((p, id) => {
         return p.then(() => setHashIdForVoter(knex, id));
      }, Promise.resolve());
    })
}

exports.down = function(knex, Promise) {
  // nothing to do in this case but migration engine needs something
  return knex.select('id').table('voters').where('id', 3)
}
