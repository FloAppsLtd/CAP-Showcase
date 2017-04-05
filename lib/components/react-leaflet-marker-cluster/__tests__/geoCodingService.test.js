'use strict';

var _ava = require('ava');

var _ava2 = _interopRequireDefault(_ava);

var _geoCodingService = require('../geoCodingService');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var nullLocation = {
  lat: null,
  lng: null
};

(0, _ava2.default)('getLocationName should return the same null points when null points are given', function (t) {
  return (0, _geoCodingService.getLocationName)(nullLocation).then(function (r) {
    t.deepEqual(r, nullLocation);
  });
});

var location = {
  // locationName: "Etelä-Suomi",
  lat: 60.58118103015208,
  lng: 24.724157872697234
};

(0, _ava2.default)('getLocationName should get the correct location', function (t) {
  return (0, _geoCodingService.getLocationName)(location).then(function (r) {
    t.truthy(r.locationName, r);
    t.is(r.lat, location.lat);
    t.is(r.lng, location.lng);
  });
});

(0, _ava2.default)('getLocationName should get the correct location with Google', function (t) {
  return (0, _geoCodingService.getLocationName)(location, 'GOOGLE').then(function (r) {
    t.truthy(r.locationName, r);
    t.is(r.lat, location.lat);
    t.is(r.lng, location.lng);
  });
});