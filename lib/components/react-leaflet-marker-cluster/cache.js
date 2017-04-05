'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _stringify = require('babel-runtime/core-js/json/stringify');

var _stringify2 = _interopRequireDefault(_stringify);

var _isEqual2 = require('lodash/isEqual');

var _isEqual3 = _interopRequireDefault(_isEqual2);

var _uniqWith2 = require('lodash/uniqWith');

var _uniqWith3 = _interopRequireDefault(_uniqWith2);

var _pick2 = require('lodash/pick');

var _pick3 = _interopRequireDefault(_pick2);

var _find2 = require('lodash/find');

var _find3 = _interopRequireDefault(_find2);

exports.default = cached;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Store data in localStorage if Storage is suported.
 * @param  {String} namespace Name of the namespace to identify the storage
 * @param  {Object} data      data to be stored
 * @return {Array}           stored data
 */
function store(namespace, data) {
  // check if localStorage is suported (used for tests in nodejs)
  if (typeof Storage !== 'undefined') {
    // use the local storage
    return localStorage.setItem(namespace, data);
  }
  console.log('localStorage not supported, not storing values.');
  return [];
}

/**
 * Retrieve data from localStorage if Storage is suported
 * @param  {String} namespace Name of the namespace to identify the storage
 * @return {Array}           Stored objects
 */
function retreive(namespace) {
  // check if localStorage is suported (used for tests in nodejs)
  if (typeof Storage !== 'undefined') {
    // use the local storage
    return localStorage.getItem(namespace);
  }
  console.log('localStorage not supported, not storing values.');
  return false;
}

function cached(namespace, data) {
  if (data) {
    var _cache = cached(namespace) || [];

    if (!(0, _find3.default)(_cache, (0, _pick3.default)(data, ['lat', 'lng']))) {
      _cache.push((0, _pick3.default)(data, ['lat', 'lng', 'locationName']));
      return store(namespace, (0, _stringify2.default)((0, _uniqWith3.default)(_cache, _isEqual3.default)));
    }
    return _cache;
  }

  var cache = retreive(namespace);
  return cache && JSON.parse(cache) || false;
}