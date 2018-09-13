'use strict';

function exposeForTests(name, fn) {
  return function gatedFunction() {
    if (process.env.NODE_ENV !== 'test') {
      console.error(name + ' called outside of tests');
      return;
    }
    return fn.apply(this, arguments);
  };
}

module.exports = {
  exposeForTests
};
