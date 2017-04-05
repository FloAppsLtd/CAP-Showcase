import Store from './Store'
import { fetchData } from './RetrieveDataService'
import _ from 'lodash'
import moment from 'moment'
import dc from 'dc/dc' // Use dc/dc.js instead of dc/index.js for crossfilter2 compatibility

Store
  .on('fetchData:all', () => {
    console.log('Fetching all data')
    fetchData()
      .then((data) => {
        // The 'add' function from 'dh', will not trigger an update since the store hasn't changed.
        Store.get().dh.add(data)
        // Changing the data value will change the store, triggering an update.
        Store.get().set({
          data: data,
        })
      })
  })

  .on('filter:timePeriod', (period) => {

    console.log('Filtering timePeriod', period)
    let startDate
    let endDate
    if (period === 'today') {
      startDate = moment().startOf('day').toDate()
      endDate = moment().endOf('day').toDate() // today
      Store.get().set({
        timePeriod: period,
        timeFilter: [startDate, endDate],
      })
    }
    if (period === 'month') {
      startDate = moment().subtract(1, 'month').startOf('day').toDate()
      endDate = moment().endOf('day').toDate() // today
      Store.get().set({
        timePeriod: period,
        timeFilter: [startDate, endDate],
      })
    }
    if (period === 'all') {
      // Reset time filters
      Store.get().set({
        timePeriod: period,
        timeFilter: null,
      })
      // Reset all chart filters
      dc.filterAll()
    }
  })

  // For demo
  .on('addRecord:one', () => {
    console.log('Adding a record')
    let record = [{
      id: _.uniqueId('fccc93'),
      userName: _.uniqueId('user_'),
      eventTime: new Date(),
      country: 'FI',
      longitude: 24.937,
      latitude: 60.1708,
      score: _.random(0.0, 1.0),
      category: _.sample(['download', 'session', 'user', 'time']),
      comment: 'none'
    }]
    Store.get().dh.add(record)
    // Changing the data value will change the store, triggering an update.
    Store.get().data.push(record[0])
  })

export default Store
