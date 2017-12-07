/*
© Copyright IBM Corp. 2017
*/


'use strict';

module.exports = {
  get: get
};

function get(req, res) {
  let file = `../../../../..res/nlu/intents.json`;
  try {
    // Force reload
    delete require.cache[require.resolve(file)];
    res.json(require(file));
  } catch (err) {
    res.status(404).send();
  }
}
