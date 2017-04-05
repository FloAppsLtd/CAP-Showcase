import dc from 'dc/dc' // Use dc/dc.js instead of dc/index.js for crossfilter2 compatibility
import _ from 'lodash'

export function onDCUpdate (store) {
  // dc.js object like instance
  let DCListener = {
    chartID: () => {
      // Assuming there will be no more than 1000 charts in the app
      let id = _.random(1000, 1050)
      return id
    },
    redraw: () => {
      store.get().set({
        trigger: 'redraw'
      }).now()
    },
    redrawAll: () => {
      store.get().set({
        trigger: 'redraw'
      }).now()
    },
    render: () => {
      store.get().set({
        trigger: 'render'
      }).now()
    },
    refocusAll: () => {
      store.get().set({
        trigger: 'refocus'
      }).now()
    },
    filterAll: () => {
      store.get().set({
        trigger: 'filterAll'
      }).now()
    },
  }

  // Register the customDCObject into dc.js registry
  dc.chartRegistry.register(DCListener)
  console.log('dc.js chart registry list', _.map(dc.chartRegistry.list(), (v) => v.chartID()))

  return DCListener
}
