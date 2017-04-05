import test from 'ava'
import moment from 'moment'
import _ from 'lodash'
import fixtureStore from '../Reactions'
import fixtureData from '../../data/data.json'
import DataHandler from '../DataHandler'

test.beforeEach(t => {
  t.context.data = fixtureData
  t.context.store = fixtureStore

  t.context.store.getData().data.reset([])
  t.context.store.get().set({
    dh: new DataHandler(),
    timeFilter: null,
    timePeriod: null
  })
})

test('Initial data in store should be empty', t => {
  let blankStore = t.context.store

  let result = blankStore.get().data
  let resultDh = blankStore.get().dh.data
  let expected = []
  t.deepEqual(result, expected, 'should be the same')
  t.deepEqual(resultDh, expected, 'should be the same')
})

test('Triggering fetchData:all should retrieve all data', async t => {
  const store = t.context.store
  const data = t.context.data

  // expected values should always go before await
  let expected = formatDates(data, 'eventTime')

  await store.trigger('fetchData:all')

  let result = store.get().data
  t.deepEqual(result, expected, 'should be the same')
})

test('Triggering filter:timePeriod with "month" should add filters for month', t => {
  let store = t.context.store
  let startDate = moment().subtract(1, 'month').startOf('day').toDate()
  let endDate = moment().endOf('day').toDate() // today

  let expected = [startDate, endDate]

  store.trigger('filter:timePeriod', 'month')

  let resultPeriod = store.get().timePeriod
  let resultFilter = store.get().timeFilter

  t.is(resultPeriod, 'month', 'should be the same')
  t.deepEqual(resultFilter, expected, 'should be the same')
})

test('Triggering filter:timePeriod with "today" should add filters for today', t => {
  let store = t.context.store
  let startDate = moment().startOf('day').toDate()
  let endDate = moment().endOf('day').toDate() // today

  let expected = [startDate, endDate]

  store.trigger('filter:timePeriod', 'today')

  let resultPeriod = store.get().timePeriod
  let resultFilter = store.get().timeFilter

  t.is(resultPeriod, 'today', 'should be the same')
  t.deepEqual(resultFilter, expected, 'should be the same')
})

// =======================
// Helper functions
// =======================

function formatDates (data, field) {
  return _.map(data, (d) => {
    return _.set(d, field, moment(d[field]).toDate())
  })
}
