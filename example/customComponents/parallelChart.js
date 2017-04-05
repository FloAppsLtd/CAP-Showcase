import React from 'react'
import { ParallelCoordChart } from '../../src'

const hideAxis = ['longitude', 'latitude', 'comment']
const colorFn = (d) => {
  let colors = {
    user: 'steelblue',
    session: 'brown',
    time: 'green',
    download: 'yellow',
  }
  return colors[d.category]
}
const options = {
  margin: {
    top: 70,
    right: 20,
    bottom: 30,
    left: 20,
  },
}

class ParallelChart extends React.Component {
  render () {
    return (
      <ParallelCoordChart { ...this.props }
        name='parallel-coord-chart'
        hideAxis={ hideAxis }
        colorFn={ colorFn }
        minHeight={ 400 }
        options={ options } />
    )
  }
}

export default ParallelChart
