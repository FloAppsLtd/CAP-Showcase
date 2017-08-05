import React, { PropTypes } from 'react'

// Custom components
import CategoryChart from './customComponents/categoryChart'
import TimeChart from './customComponents/timeChart'
import TimeRangeChart from './customComponents/timeRangeChart'
import InfoLabel from './customComponents/infoLabel'
import WorldMap from './customComponents/worldmap'
import ParallelChart from './customComponents/parallelChart'

import { onDCUpdate } from './store/dcListener'

// Application style
import './style.css'

class App extends React.Component {
  componentDidMount () {
    const {store} = this.props

    // Make the app reactive by making the Freezer-js object update the app state every time it changes.
    if (store) {
      store.on('update', () => {
        this.forceUpdate()
      })
    }

    // Create a custom dc object that listens to changes in dc.js charts.
    onDCUpdate(store)

    // Trigger the Fetch data action
    store.trigger('fetchData:all')
  }

  onToggleShowHeatmap () {
    const {store} = this.props
    return () => {
      store.get().set({
        heatmap: !store.get().heatmap
      })
    }
  }

  getChartID () {
    const {store} = this.props
    return (chartID) => {
      store.get().set({
        rangeChartID: chartID
      })
    }
  }

  setTimePeriod (period) {
    const {store} = this.props
    return () => {
      store.trigger('filter:timePeriod', period)
    }
  }

  addOneRecord () {
    const {store} = this.props
    return () => {
      store.trigger('addRecord:one')
    }
  }

  render () {
    const {store} = this.props
    const {dh, rangeChartID, heatmap, timeFilter} = store.get().toJS()

    // Data handler function calls
    const allDimension = dh.getAllDimension()
    const allDimensionGroup = dh.getAllDimensionGroup()
    const categoryDimensionGroup = dh.getCategoryDimensionGroup()
    const categoryDimension = dh.getCategoryDimension()
    const timeDimensionGroup = dh.getTimeDimensionGroup()
    const timeDimension = dh.getTimeDimension()
    const dateRange = dh.getDateRange(true)
    const recordsRangeByHour = dh.getRecordsRangeByHour()
    const geoData = dh.getGeoData()
    const totalNumberOfRecords = dh.getTotalNumberOfRecords()
    const fieldDescriptions = dh.getFieldDescriptions()
    const allRecords = dh.getAllRecords()

    return (
      <div className='container'>
        <h1>react-dc-crossfilter examples</h1>
        <div className='row'>
          <div className='col-md-8'>
            <InfoLabel dimension={ allDimension }
              group={ allDimensionGroup } />
          </div>
          <div className='col-md-4'>
            <button className={ 'btn btn-link' }
              onClick={ this.addOneRecord() }>
              Add one record
            </button>
            <div className='btn-group time-buttons'>
              <button className={ 'btn btn-default' }
                onClick={ this.setTimePeriod('all') }>
                All
              </button>
              <button className={ 'btn btn-default' }
                onClick={ this.setTimePeriod('month') }>
                This month
              </button>
              <button className={ 'btn btn-default' }
                onClick={ this.setTimePeriod('today') }>
                Today
              </button>
            </div>
          </div>
        </div>
        <div className='row'>
          <div className='col-md-3'>
            <h2>Category chart</h2>
            <p>Click on one or more category bars to filter the data by the selected categories.</p>
            <CategoryChart dimension={ categoryDimension }
              group={ categoryDimensionGroup } />
          </div>
          <div className='col-md-1' />
          <div className='col-md-6'>
            <h2>Time Bar chart</h2>
            <p>Hover over each bar on the top time chart to see more information. Click and drag on the bottom time chart to filter the data by time.</p>
            <TimeChart dimension={ timeDimension }
              group={ timeDimensionGroup }
              xRange={ dateRange }
              yRange={ recordsRangeByHour }
              rangeChartID={ rangeChartID } />
            <TimeRangeChart dimension={ timeDimension }
              group={ timeDimensionGroup }
              xRange={ dateRange }
              yRange={ recordsRangeByHour }
              rangeFilter={ timeFilter }
              getChartID={ this.getChartID() } />
          </div>
        </div>
        <div className='row' />
        <div className='row'>
          <div className='col-md-12'>
            <h2>Map</h2>
            <p>Data points on the map can be shown as either markers or heatmap. Toggle the markers or heatmap using the button on the right.</p>
            <button className='btn btn-default toggle'
              onClick={ this.onToggleShowHeatmap() }>
              { heatmap ? 'Show markers' : 'Show heatmap' }
            </button>
            <WorldMap points={ geoData }
              toggleHeatmap={ heatmap }
              max={ totalNumberOfRecords } />
          </div>
        </div>
        <div className='row'>
          <h2>Parallel coordinates chart</h2>
          <p>Drag vertically on one or more columns to filter the data on the Parallel coordinates chart. To remove the filter, click again on a selected column.</p>
          <div className='col-md-12'>
            <ParallelChart
              data={ allRecords }
              dimensions={ fieldDescriptions } />
          </div>
        </div>
      </div>
    )
  }
}

App.propTypes = {
  store: PropTypes.object,
}

export default App
