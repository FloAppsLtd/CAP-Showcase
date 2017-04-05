import test from 'ava'
import { getLocationName } from '../geoCodingService'
import _ from 'lodash'

let nullLocation = {
  lat: null,
  lng: null
}

test('getLocationName should return the same null points when null points are given', t => {
  return getLocationName(nullLocation).then(r => {
    t.deepEqual(r, nullLocation)
  })
})

let location = {
  // locationName: "Etelä-Suomi",
  lat: 60.58118103015208,
  lng: 24.724157872697234
}

test('getLocationName should get the correct location', t => {
  return getLocationName(location).then(r => {
    t.truthy(r.locationName, r)
    t.is(r.lat, location.lat)
    t.is(r.lng, location.lng)
  })
})

test('getLocationName should get the correct location with Google', t => {
  return getLocationName(location, 'GOOGLE').then(r => {
    t.truthy(r.locationName, r)
    t.is(r.lat, location.lat)
    t.is(r.lng, location.lng)
  })
})
