'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _first3 = require('lodash/fp/first');

var _first4 = _interopRequireDefault(_first3);

var _filter3 = require('lodash/fp/filter');

var _filter4 = _interopRequireDefault(_filter3);

var _flow2 = require('lodash/fp/flow');

var _flow3 = _interopRequireDefault(_flow2);

var _includes2 = require('lodash/includes');

var _includes3 = _interopRequireDefault(_includes2);

var _filter5 = require('lodash/filter');

var _filter6 = _interopRequireDefault(_filter5);

var _reduce2 = require('lodash/reduce');

var _reduce3 = _interopRequireDefault(_reduce2);

var _first5 = require('lodash/first');

var _first6 = _interopRequireDefault(_first5);

var _has2 = require('lodash/has');

var _has3 = _interopRequireDefault(_has2);

var _extend2 = require('lodash/extend');

var _extend3 = _interopRequireDefault(_extend2);

var _find2 = require('lodash/find');

var _find3 = _interopRequireDefault(_find2);

exports.getLocationName = getLocationName;

var _bluebird = require('bluebird');

var _bluebird2 = _interopRequireDefault(_bluebird);

var _cache = require('./cache');

var _cache2 = _interopRequireDefault(_cache);

var _axios = require('axios');

var _axios2 = _interopRequireDefault(_axios);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var TIMEOUT = 600000;

var SERVICE = 'OPEN_STREET_MAP';
// const SERVICE = 'GOOGLE'

var LOOKUP_SERVICE = {
  GOOGLE: {
    uri: 'http://maps.googleapis.com/maps/api/geocode/json',
    params: function params(lat, lng) {
      return {
        latlng: lat + ',' + lng,
        sensor: false
      };
    },
    parseFunction: parseLocationNameDataGoogle
  },

  OPEN_STREET_MAP: {
    uri: 'http://nominatim.openstreetmap.org/reverse',
    params: function params(lat, lng) {
      return {
        lat: lat,
        lon: lng,
        zoom: 10,
        format: 'json',
        addressdetails: 1
      };
    },
    parseFunction: parseLocationNameDataOpenStreetMap
  }
};
/**
 * Retrieves the location name given the latitude and longitude coordinates.
 * Using either Google Map API services ('GOOGLE') or Open Street map ('OPEN_STREET_MAP')
 * The default service is Open Street Map.
 * An object must be passed as 'point' which should contain lat and lng fields for coordinates
 * ie. {lat: 12, lng: 23, ...}.
 * Once found a location, it stores it as a cache in localstore under the name 'locationNames'
 *
 * @param  {object} point           An object which must contain the coordinates as 'lat' and 'lng'.
 * @param  {string} locationService A string with the service to use, if not provided it uses the default.
 * @return {object}                 A clone of the original object provided plus a field called 'locationName'
 *                                  with the name of the location if it was retrurned by the service.
 */
function getLocationName(point, locationService) {
  var detail = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

  var serviceName = locationService || SERVICE;
  var service = LOOKUP_SERVICE[serviceName];
  console.log('Getting locationName data from', serviceName);

  if (!(point.lat && point.lng)) {
    return _bluebird2.default.resolve(point);
  }
  var inCache = (0, _find3.default)((0, _cache2.default)('locationNames'), {
    lat: point.lat,
    lng: point.lng
  });

  // If the location is already in cache, return it from there.
  if (inCache) {
    return _bluebird2.default.resolve((0, _extend3.default)({}, point, inCache));
  }

  // If locationName is not in the cache, make a request.
  return (0, _axios2.default)({
    url: service.uri,
    method: 'GET',
    params: service.params(point.lat, point.lng),
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    timeout: TIMEOUT
  }).then(function (resp) {
    if (!resp.data || resp.error) {
      return _bluebird2.default.resolve(point);
    }
    var locationName = service.parseFunction(resp.data, point, detail);
    if ((0, _has3.default)(locationName, 'locationName')) {
      (0, _cache2.default)('locationNames', locationName);
    }
    return _bluebird2.default.resolve(locationName);
  }).catch(function (error) {
    console.log('Error in locationName lookup service: ', serviceName, error);
    return _bluebird2.default.resolve(point);
  });
}

// --------------------------------
// OpenStreetMap locationName data Parsing

function parseLocationNameDataOpenStreetMap(res, point, detail) {
  var locationName = detail ? res.address.city || res.address.state : res.address.state;
  return locationName ? (0, _extend3.default)({}, point, {
    locationName: locationName
  }) : point;
}

// --------------------------------
// GoogleMaps locationName data Parsing

function parseLocationNameDataGoogle(res, point, detail) {
  if (!res.results || !(0, _first6.default)(res.results)) {
    console.log('No results', res);
    return point;
  }
  var addressComponents = (0, _flow3.default)((0, _filter4.default)(function (v) {
    return v.geometry.location_type === 'APPROXIMATE';
  }), _first4.default)(res.results).address_components;
  var locationName = getAddressName(addressComponents);

  return locationName ? (0, _extend3.default)({}, point, {
    locationName: locationName
  }) : point;
}

function getAddressName(sources, detail) {
  var targets = detail ? ['locality', 'administrative_area_level_1', 'administrative_area_level_2', 'administrative_area_level_3'] : ['locality', 'administrative_area_level_1'];
  // https://stackoverflow.com/questions/31195169/compare-array-with-sorted-array-pick-first-element
  var locality = (0, _reduce3.default)(targets, function (t, target) {
    return t.concat((0, _filter6.default)(sources, function (source) {
      return (0, _includes3.default)(source.types, target);
    }));
  }, []);
  return locality.length > 0 ? (0, _first6.default)(locality).long_name : null;
}