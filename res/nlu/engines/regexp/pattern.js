/*
© Copyright IBM Corp. 2017
*/


'use strict';

var xregexp  = require('xregexp');
var defaultValues = require('./values');
//var defaultSynonyms = require('./synonyms');

var Pattern = function(name, expression, intent, template) {
  this.build(name, expression, intent, template);
};

Pattern.prototype.build = function(intent, pattern, template) {
  var self = this;
  // We set the confidence to 1.0 for a full match. It will be updated depends
  // on the matching type
  this.confidence = 1.0;
  // Switch nulls by empty
  var synonyms = template.synonyms || [];
  var entities = template.entities || [];
  // The name of the pattern. Should be unique
  this.name = intent.name;
  // Extract post match inline actions if exists
  this.actions = [];
  var actions = pattern.split('&&');
  for (var i = 1; i < actions.length; i++) {
    this.actions.push(actions[i].trim());
  }
  // In case we had embeeded actions.
  pattern = actions[0].trim();
  // Trim and remove duplicate spaces
  var source = pattern.replace(/\s\s+/g, ' ');
  // Wildcards
  if ((source.lastIndexOf('*') != source.length) && (source.indexOf('$') == -1)) {
    // No wildcards for begining or end of sentence, must end with
    // the last word in the pattern.
    pattern += '$';
    this.confidence -= 0.00;
  }
  if (source.indexOf('*') > -1) {
    // Replaces a word or set of words in the position the * occupies. The *
    // means everthing but must have something.
    pattern = pattern.replace(/(?:\s*)\*(?:\s*)/, '(?:.+?)');
    this.confidence -= 0.10;
  }
  if (source.indexOf('$') == -1) {
    // No wildcards for begining of sentence, must match from start.
    pattern = this.insertAt(pattern, 0, '^');
    this.confidence -= 0.0;
  } else if (source.indexOf('$') === 0) {
    // Indicates that the phrase after it must appear exactly as it is written,
    // but any words can precede it or follow it.
    pattern = pattern.replace(/^\$\s+/, '(?:.*?)'); // + '(?:.*)';
    this.confidence -= 0.10;
  } else {
    // Keep the $ sign
  }
  // List of words. List of words cannot contain variables (should be fixed).
  pattern = pattern.replace(/(\s*)\[([^\]\}]*)\](\s*)/g,  function(match, sl, p2, sr, offset, s) {
    var result = '';
    if (sl === ' ') {
      result += '\\s*';
    }
    var list = p2.split('|');
    if (list[list.length - 1] === '') {
      result += '(?:' + list.join('|') + '\\s*)?';
    } else {
      result += '(?:' + list.join('|') + ')+';
    }
    if (sr === ' ') {
      result += '\\s*';
    }
    self.confidence = self.confidence + 1.00 - 0.05;
    return result;
  });
  // Synonyms
  synonyms.forEach(function(synonym) {
    // First find all synonyms and mark them (with #).
    synonym.forEach(function(item) {
      if (item.match('^@')) {
        // item = item.replace('@', '');
        // defaultSynonyms[item].forEach(function(item) {
        //   // Match all words not inside {}
        //   pattern = pattern.replace(new RegExp(item + '(?![^{]*})', 'i'), '_#_');
        // });
      } else {
        // Match all words not inside {}
        pattern = pattern.replace(new RegExp(item + '(?![^{]*})', 'i'), '_#_');
      }
    });
    pattern = pattern.replace('_#_', '(?:' + synonym.join('|') + ')');
  });
  // Variables match. Variables can be inside optional block (e.g., [{name}])
  var subs = {};
  var variables = [];
  pattern = pattern.replace(/\{([^{}]*)\}/g,  function(match, v, offset, s) {
    // Check if the variable is tghe last token in sentence
    var last = (source.length == (source.lastIndexOf(v) + v.length + 1));
    // Get variable name
    var variable;
    if (v.match('^@')) {
      // Check for name aliasing (e.g., {@operation:onOff}).
      if (v.indexOf(':') > -1) {
        variable = (v.split(':')[0]).replace('@', '');
        v = '@' + v.split(':')[1];
      } else {
        variable = v.replace('@', '');
      }
    } else {
      variable = v;
    }
    // Check for pre defined entity
    if (v.match('^@')) {
      v = v.replace('@', '');
      if (defaultValues[v]) {
        // Any wildcard can only be the first value for now
        if (defaultValues[v][0] === '*') {
          subs[variable] = '(.*)';
          self.confidence  = self.confidence + 1.00 - 0.01;
        } else {
          subs[variable] = defaultValues[v].map(function(item) {
            return '(?:' + item + ')';
          }).join('|');
        }
      } else {
        // Failed to find match in pre defined entities
      }
    } else {
      var values = entities[v];
      if (values) {
        // Any wildcard can only be the first value for now
        if (values[0] === '*') {
          subs[variable] = '(.*)';
          self.confidence -= 0.01;
        } else if (values[0].match(/\/(.*)\//)) {
          subs[variable] = values[0].replace(/\//g, '');
        } else {
          subs[variable] = values.map(function(item) {
            return '(?:' + item + ')';
          }).join('|');
        }
      } else {
        // If no predefined value we accept any value
        subs[variable] = last ? '(.*)' : '(.*?)';
        self.confidence = self.confidence + 1.00 - 0.01;
      }
    }
    // Add only new variables to th elist
    if (variables.indexOf(variable) == -1) {
      //console.log(variable);
      variables.push(variable);
    }
    return '({{' + variable + '}})';
  });
  this.regexp = xregexp.build(pattern, subs, 'i');
  this.variables = variables;
  // We divide by 1 because toFixed return a string
  this.confidence = this.confidence / ((Math.ceil(this.confidence)).toFixed(4) / 1);
};

Pattern.prototype.match = function(text) {
  var match = xregexp.exec(text, this.regexp);
  if (match) {
    // Add pattern parameters.
    match.confidence = this.confidence;
    // Inline operations (assignement of variables)
    this.doPatternActions(match);
  }
  return match;
};

/**
 * Perform inline actions. Inline actions are action which are embbeded
 * inside the pattern and they are pattern specific.
 */
Pattern.prototype.doPatternActions = function(match) {
  var self = this;
  try {
    this.actions.forEach(function(action) {
      action = action.replace(/\{([^{}]*)\}/g,  function(match, p1) {
        return p1.trim();
      });
      var tokens = action.split(/=/);
      var variable = tokens[0].trim();
      var value = tokens[1].trim();
      match[variable] = value;
      if (self.variables.indexOf(variable) == -1) {
        self.variables.push(variable);
      }
    });
  } catch (e) {
  }
};

Pattern.prototype.replaceCharAt = function(string, index, s) {
    return string.substr(0, index) + s + string.substr(index + 1);
  };

Pattern.prototype.insertAt = function(string, index, s) {
  return string.substr(0, index) + s + string.substr(index);
};

module.exports = Pattern;
