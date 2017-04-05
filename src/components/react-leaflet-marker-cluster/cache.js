import _ from 'lodash'

/**
 * Store data in localStorage if Storage is suported.
 * @param  {String} namespace Name of the namespace to identify the storage
 * @param  {Object} data      data to be stored
 * @return {Array}           stored data
 */
function store (namespace, data) {
  // check if localStorage is suported (used for tests in nodejs)
  if (typeof (Storage) !== 'undefined') {
    // use the local storage
    return localStorage.setItem(namespace, data)
  }
  console.log('localStorage not supported, not storing values.')
  return []
}

/**
 * Retrieve data from localStorage if Storage is suported
 * @param  {String} namespace Name of the namespace to identify the storage
 * @return {Array}           Stored objects
 */
function retreive (namespace) {
  // check if localStorage is suported (used for tests in nodejs)
  if (typeof (Storage) !== 'undefined') {
    // use the local storage
    return localStorage.getItem(namespace)
  }
  console.log('localStorage not supported, not storing values.')
  return false
}

export default function cached (namespace, data) {
  if (data) {
    let cache = cached(namespace) || []

    if (!_.find(cache, _.pick(data, ['lat', 'lng']))) {
      cache.push(_.pick(data, ['lat', 'lng', 'locationName']))
      return store(namespace, JSON.stringify(_.uniqWith(cache, _.isEqual)))
    }
    return cache
  }

  let cache = retreive(namespace)
  return (cache && JSON.parse(cache)) || false
}
