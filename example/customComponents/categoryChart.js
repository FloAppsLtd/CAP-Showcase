import React from 'react'
import { RowChart } from '../../src'

const options = {
  height: 300,
  width: 200,
  margins: {
    top: 20,
    right: 20,
    bottom: 30,
    left: 20,
  },
}

class CategoryChart extends React.Component {
  render () {
    return (
      <RowChart { ...this.props }
        name='category-chart'
        options={ options } />
    )
  }
}

export default CategoryChart
