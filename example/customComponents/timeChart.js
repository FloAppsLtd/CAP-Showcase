import React from 'react'
import { BarChart } from '../../src'
import ToolTip from './toolTip'

const width = 600
const height = 200
const options = {
  margins: {
    top: 10,
    right: 20,
    bottom: 30,
    left: 20,
  },
  brushOn: false,
  renderVerticalGridLines: false,
  renderHorizontalGridLines: true,
  yAxisTicks: 4,
}

class TimeChart extends React.Component {
  render () {
    return (
      <BarChart { ...this.props }
        name='time-chart'
        width={ width }
        height={ height }
        options={ options }>
        { ToolTip }
      </BarChart>
    )
  }
}

export default TimeChart
