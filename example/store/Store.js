import Freezer from 'freezer-js'
import DataHandler from './DataHandler'

var Store = new Freezer({
  data: [],
  dh: new DataHandler(),
  heatmap: false,
  timeFilter: null,
  timePeriod: null
}, {
  live: true
})

export default Store
