import React from 'react'
import { BarChart } from '../../src'

const width = 600
const height = 100
const options = {
  margins: {
    top: 10,
    right: 20,
    bottom: 30,
    left: 20,
  },
  brushOn: true,
  renderVerticalGridLines: true,
  renderHorizontalGridLines: false,
  yAxisTicks: 0,
}

class TimeRangeChart extends React.Component {
  render () {
    return (
      <BarChart { ...this.props }
        name='time-range-chart'
        width={ width }
        height={ height }
        options={ options } />
    )
  }
}

export default TimeRangeChart
