/*
© Copyright IBM Corp. 2017
*/


'use strict';

function Intentity(name) {
  this.name = name;
  this.intents  = [];
  this.entities = [];
}

Intentity.prototype.getName = function() {
  return this.name;
};

Intentity.prototype.clear = function() {
  this.intents  = [];
  this.entities = [];
};

Intentity.prototype.addIntent = function(name, confidence) {
  var intent = {
    intent: name,
    confidence: confidence
  };
  this.intents.push(intent);
};

Intentity.prototype.addIntents = function(names, confidence) {
  var _this = this;
  names.forEach(name => {
    _this.addIntent(name, confidence);
  });
};

Intentity.prototype.hasIntent = function() {
  return this.intents.length > 0 ? true : false;
};

Intentity.prototype.getIntent = function(index) {
  index = index || 0;
  return this.intents[index];
};

Intentity.prototype.getIntentConfidence = function(index) {
  index = index || 0;
  if (this.intents[index]) {
    return this.intents[index].confidence;
  }
  return 0.0;
};

Intentity.prototype.setIntentConfidence = function(confidence, index) {
  index = index || 0;
  if (this.intents[index]) {
    this.intents[index].confidence = confidence;
  }
};

Intentity.prototype.setLowConfidence = function(index) {
  this.setIntentConfidence(0.0, index);
};

Intentity.prototype.setHighConfidence = function(index) {
  this.setIntentConfidence(1.0, index);
};

Intentity.prototype.getIntentName = function(index) {
  index = index || 0;
  if (this.intents[index]) {
    return this.intents[index].intent;
  }
  return null;
};

Intentity.prototype.getIntents = function() {
  return this.intents;
};

Intentity.prototype.getNumOfEntities = function() {
  return this.entities.length;
};

Intentity.prototype.addEntity = function(name, value) {
  const entity = {
    entity: name,
    value: value
  };
  this.entities.push(entity);
};

Intentity.prototype.hasEntities = function() {
  return this.entities.length > 0 ? true : false;
};

Intentity.prototype.getEntity = function(index) {
  if (typeof index === 'string') {
    // Return entity by name
    for (var i = 0; i < this.entities.length; i++) {
      if (this.entities[i].entity === index) {
        return this.entities[i];
      }
    }
  } else {
    // Return entity by position
    index = index || 0;
    return this.entities[index];
  }
};

Intentity.prototype.getEntities = function() {
  return this.entities;
};

Intentity.prototype.getAttributes = function() {
  // Intent and entities will be set in assocoative array
  let result = {};
  // Intent
  result.intent = this.getIntentName();
  // Fill the entities
  this.entities.forEach(entity => {
    if (result[entity.entity] === undefined) {
      // Single entity value
      result[entity.entity] = entity.value;
    } else {
      // Multiple values for entity are stored in array
      if (Array.isArray(result[entity.entity]) === false) {
        // Construct entity values array with current value
        result[entity.entity] = [result[entity.entity]];
      }
      result[entity.entity].push(entity.value);
    }
  });
  return result;
};

module.exports = Intentity;
