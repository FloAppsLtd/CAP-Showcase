import Promise from 'bluebird'
import _ from 'lodash'
import { flow, filter, first } from 'lodash/fp'
import cached from './cache'
import axios from 'axios'

const TIMEOUT = 600000

const SERVICE = 'OPEN_STREET_MAP'
// const SERVICE = 'GOOGLE'

const LOOKUP_SERVICE = {
  GOOGLE: {
    uri: 'http://maps.googleapis.com/maps/api/geocode/json',
    params: (lat, lng) => {
      return {
        latlng: `${lat},${lng}`,
        sensor: false
      }
    },
    parseFunction: parseLocationNameDataGoogle,
  },

  OPEN_STREET_MAP: {
    uri: 'http://nominatim.openstreetmap.org/reverse',
    params: (lat, lng) => {
      return {
        lat: lat,
        lon: lng,
        zoom: 10,
        format: 'json',
        addressdetails: 1
      }
    },
    parseFunction: parseLocationNameDataOpenStreetMap,
  },
}
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
export function getLocationName (point, locationService, detail = false) {
  const serviceName = locationService || SERVICE
  const service = LOOKUP_SERVICE[serviceName]
  console.log('Getting locationName data from', serviceName)

  if (!(point.lat && point.lng)) {
    return Promise.resolve(point)
  }
  let inCache = _.find(cached('locationNames'), {
    lat: point.lat,
    lng: point.lng,
  })

  // If the location is already in cache, return it from there.
  if (inCache) {
    return Promise.resolve(_.extend({}, point, inCache))
  }

  // If locationName is not in the cache, make a request.
  return axios(
    {
      url: service.uri,
      method: 'GET',
      params: service.params(point.lat, point.lng),
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      timeout: TIMEOUT
    })
    .then((resp) => {
      if (!resp.data || resp.error) {
        return Promise.resolve(point)
      }
      let locationName = service.parseFunction(resp.data, point, detail)
      if (_.has(locationName, 'locationName')) {
        cached('locationNames', locationName)
      }
      return Promise.resolve(locationName)
    })
    .catch((error) => {
      console.log('Error in locationName lookup service: ', serviceName, error)
      return Promise.resolve(point)
    })
}

// --------------------------------
// OpenStreetMap locationName data Parsing

function parseLocationNameDataOpenStreetMap (res, point, detail) {
  let locationName = detail ? res.address.city || res.address.state : res.address.state
  return locationName ? _.extend({}, point, {
    locationName: locationName,
  }) : point
}

// --------------------------------
// GoogleMaps locationName data Parsing

function parseLocationNameDataGoogle (res, point, detail) {
  if (!res.results || !_.first(res.results)) {
    console.log('No results', res)
    return point
  }
  let addressComponents = flow(
    filter((v) => v.geometry.location_type === 'APPROXIMATE'),
    first
  )(res.results).address_components
  let locationName = getAddressName(addressComponents)

  return locationName ? _.extend({}, point, {
    locationName: locationName,
  }) : point
}

function getAddressName (sources, detail) {
  let targets = detail ? ['locality',
    'administrative_area_level_1',
    'administrative_area_level_2',
    'administrative_area_level_3',
  ] : ['locality',
    'administrative_area_level_1']
  // https://stackoverflow.com/questions/31195169/compare-array-with-sorted-array-pick-first-element
  let locality = _.reduce(targets, (t, target) => {
    return t.concat(_.filter(sources, (source) => _.includes(source.types, target)))
  }, [])
  return locality.length > 0 ? _.first(locality).long_name : null
}
