/*
© Copyright IBM Corp. 2017
*/


'use strict';

const util = require('util');
const Super = require('../../../skill-sdk/lib/formatter/formatter');

/**
 * Based on http://xpo6.com/list-of-english-stop-words/
 */
const stopWords = [
    'a', 'able', 'about', 'across', 'after', 'all', 'almost', 'also', 'am', 'among', 'an', 'and', 'any',
    'are', 'as', 'at', 'be', 'because', 'been', 'but', 'by', 'can', 'cannot', 'could', 'dear', 'did', 'do',
    'does', 'either', 'else', 'ever', 'every', 'for', 'from', 'get', 'got', 'had', 'has', 'have', 'he',
    'her', 'hers', 'him', 'his', 'how', 'however', 'i', 'if', 'in', 'into', 'is', 'it', 'its', 'just',
    'least', 'let', 'like', 'likely', 'may', 'me', 'might', 'most', 'must', 'my', 'neither', 'no', 'nor',
    'not', 'of', 'off', 'often', 'on', 'only', 'or', 'other', 'our', 'own', 'rather', 'said', 'say', 'says',
    'she', 'should', 'since', 'so', 'some', 'than', 'that', 'the', 'their', 'them', 'then', 'there', 'these',
    'they', 'this', 'tis', 'to', 'too', 'twas', 'us', 'wants', 'was', 'we', 'were', 'what', 'when', 'where',
    'which', 'while', 'who', 'whom', 'why', 'will', 'with', 'would', 'yet', 'you', 'your'
 ];

var Formatter = function() {
  Super.apply(this, arguments);
};

// Inheritance
util.inherits(Formatter, Super);

Formatter.prototype.replace = function(text, string) {
  return text;
};

module.exports = new Formatter();
