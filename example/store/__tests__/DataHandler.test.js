import test from 'ava'
import _ from 'lodash'
import { flow, groupBy, map, filter, sortBy, max, flatten } from 'lodash/fp'
import moment from 'moment'
import data from '../../data/data.json'
import DataHandler from '../DataHandler'

test('should initialize with data when data is passed as an argument ', t => {
  let dh = new DataHandler(data)
  t.is(dh.ndx.size(), data.length, 'should be the same')
})

test('should add data', t => {
  let dh = new DataHandler()
  dh.add(data)
  t.is(dh.ndx.size(), data.length, 'should be the same')
})

test('should add more data', t => {
  let dh = new DataHandler(data)
  dh.add(newRecords)
  let result = dh.ndx.size()
  let expected = data.length + newRecords.length
  t.is(result, expected, 'should be the same')
})

test('should add more data', t => {
  let dh = new DataHandler(data)
  let numRecords = 10
  _.times(numRecords, () => dh.add(newRecords))
  let result = dh.ndx.size()
  let expected = data.length + newRecords.length * numRecords
  t.is(result, expected, 'should be the same')
})

test('should return all records', t => {
  let dh = new DataHandler(data)
  let result = dh.getAllRecords()
  let expected = data
  t.deepEqual(result, expected, 'should be the same')
})

test('should return the data with geoLocation structure', t => {
  let dh = new DataHandler(data)
  let result = dh.getGeoData()
  let expected = geoLocationDataStructure()
  t.deepEqual(result, expected, 'should be the same')
})

test('should return the data with timeDimensionHourly structure', t => {
  let dh = new DataHandler(data)
  let result = flow(
    map((v) => {
      return {
        key: v.key,
        value: {
          count: v.value.count
        }
      }
    }),
    sortBy('key'))(dh.getTimeDimensionGroup().all())

  let expected = _.sortBy((timeDimensionDataStructure()), 'key')
  t.deepEqual(result, expected, 'should be the same')
})

test('should return date range from the start of the day of earliest record until today', t => {
  let dh = new DataHandler(data)

  let resultStartDate = dh.getDateRange(true)[0]
  let expectedStartDate = dateRageDataStructure(true)[0]
  let resultEndDate = moment(dh.getDateRange(true)[1]).startOf('day').toDate()
  let expectedEndDate = moment(dateRageDataStructure(true)[1]).startOf('day').toDate()

  t.deepEqual(resultStartDate, expectedStartDate, 'should be the same')
  t.deepEqual(resultEndDate, expectedEndDate, 'should be the same')
})

test('should return date range until end of data', t => {
  let dh = new DataHandler(data)
  let result = dh.getDateRange(false)
  let expected = dateRageDataStructure(false)
  t.deepEqual(result, expected, 'should be the same')
})

test('should return total number of records', t => {
  let dh = new DataHandler(data)
  let result = dh.getTotalNumberOfRecords()
  let expected = getTotalNumberOfRecords()
  t.deepEqual(result, expected, 'should be the same')
})

test('should return total number of records grouped by Hour', t => {
  let dh = new DataHandler(data)
  let result = dh.getRecordsRangeByHour()
  let expected = getRecordsRangeByHour()
  t.deepEqual(result, expected, 'should be the same')
})

test('should return total number of records grouped by Hour when filtered', t => {
  let dh = new DataHandler(data)
  dh.categoryDimension.filter('time')
  let result = dh.getRecordsRangeByHour()
  let expected = getRecordsRangeByHour()
  t.deepEqual(result, expected, 'should be the same')
})

test('should return total number of records grouped by Hour when more data is added', t => {
  let dh = new DataHandler(data)
  dh.add(newRecords)
  let result = dh.getRecordsRangeByHour()
  let expected = getRecordsPlusNewRecordRangeByHour()
  t.deepEqual(result, expected, 'should be the same')
})

test('should return data filtered by today', t => {
  let dh = new DataHandler(data)
  let newRecord = _.extend({}, newRecords[0], {
    eventTime: moment().startOf('hour').toDate()
  })
  data.push(newRecord)
  dh.add([newRecord])

  let startDate = moment().subtract(1, 'days').toDate()
  let endDate = moment().toDate() // today

  dh.filterBy('time', [startDate, endDate])
  let result = flow(
    filter((v) => v.value.count > 0),
    map('value.dataList'),
    flatten)(dh.getTimeDimensionGroup().all())
  let expected = getFilteredRecordsByTimePeriodToday()
  t.deepEqual(result, expected, 'should be the same')
})

test('should return data filtered by last month', t => {
  let dh = new DataHandler(data)
  let newRecord = _.extend({}, newRecords[0], {
    eventTime: moment().startOf('hour').toDate()
  })
  data.push(newRecord)
  dh.add([newRecord])

  let startDate = moment().subtract(1, 'month').toDate()
  let endDate = moment().toDate() // today

  dh.filterBy('time', [startDate, endDate])
  let result = flow(
    filter((v) => v.value.count > 0),
    map('value.dataList'),
    flatten)(dh.getTimeDimensionGroup().all())

  let expected = getFilteredRecordsByTimePeriodMonth()
  t.deepEqual(result, expected, 'should be the same')
})

// =======================
// Helper functions
// =======================
const newRecords = [{
  id: '0e7ef79e4b',
  userName: 'user_f0d70b',
  eventTime: '2016-10-31T11:34:43.000Z',
  country: 'FI',
  loginSubType: 'vpn',
  longitude: 24.937,
  latitude: 60.1708,
  score: 0.2,
  category: 'session',
  comment: 'Session Timeout'
}]

function geoLocationDataStructure () {
  return flow(
    map((v) => {
      return {
        lat: v.latitude,
        lng: v.longitude,
        data: {
          country: v.country,
          userName: v.userName,
          id: v.id
        }
      }
    }),
    sortBy('data.id'))(data)
}

function timeDimensionDataStructure () {
  return [
    {
      key: new Date('2016-09-11T09:00:00.000Z'),
      value: {
        count: 1
      }
    },
    {
      key: new Date('2016-09-01T09:00:00.000Z'),
      value: {
        count: 5
      }
    },
    {
      key: new Date('2016-09-01T11:00:00.000Z'),
      value: {
        count: 3
      }
    },
    {
      key: new Date('2016-09-01T14:00:00.000Z'),
      value: {
        count: 1
      }
    }]
}

function getTotalNumberOfRecords () {
  return data.length
}

function getRecordsRangeByHour (setData) {
  let r = flow(
    groupBy((d) => moment(d.eventTime).startOf('hour').toDate()),
    map((v) => v.length),
    max)(setData || data)
  return [0, r]
}

function getRecordsPlusNewRecordRangeByHour () {
  let newData = data.concat(newRecords)

  return getRecordsRangeByHour(newData)
}

function getFilteredRecordsByTimePeriodToday () {
  let startDate = moment().subtract(1, 'days').toDate()

  let endDate = moment() // today
  return _.filter(data, (v) => moment(v.eventTime).isBetween(startDate, endDate, null, null))
}

function getFilteredRecordsByTimePeriodMonth () {
  let startDate = moment().subtract(1, 'months').toDate()

  let endDate = moment() // today
  return _.filter(data, (v) => moment(v.eventTime).isBetween(startDate, endDate, null, null))
}

function dateRageDataStructure (untilToday) {
  let startDate = moment(_.minBy(data, 'eventTime').eventTime).startOf('day').toDate()
  let endDate = untilToday ? new Date() : moment(_.maxBy(data, 'eventTime').eventTime).endOf('day').toDate()
  return [startDate, endDate]
}
