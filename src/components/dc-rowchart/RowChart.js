import React, { PropTypes } from 'react'
import ReactDOM from 'react-dom'
import dc from 'dc/dc' // Use dc/dc.js instead of dc/index.js for crossfilter2 compatibility
import _ from 'lodash'

class RowChart extends React.Component {
  componentDidMount () {
    const {width, height, dimension, group, options} = this.props
    let DOMNode = ReactDOM.findDOMNode(this)

    // Create a dc.js rowChart
    let chart = dc.rowChart(DOMNode)
    this.chart = this.setChartProperties(chart, width, height, dimension, group, options)
    this.chart.render()
  }

  componentDidUpdate () {
    this.chart.redraw()
  }

  setChartProperties (chart, width, height, dimension, group, options) {
    const {margins, label, elasticX} = options
    let defaultOptions = {
      height: height,
      width: width,
      margins: margins || {
          top: 20,
          right: 20,
          bottom: 30,
          left: 20,
      },
      dimension: dimension,
      group: group,
      elasticX: elasticX || true,
      label: label || ((d) => d.key),
    }
    chart.options(_.extend({}, defaultOptions, options))

    return chart
  }

  render () {
    const {name} = this.props
    return (
      <div id={ name } />
    )
  }
}

RowChart.propTypes = {
  name: PropTypes.string.isRequired,
  width: PropTypes.number,
  height: PropTypes.number,
  dimension: PropTypes.object.isRequired,
  group: PropTypes.object.isRequired,
  options: PropTypes.object,
}

RowChart.defaultProps = {
  height: 300,
  width: 200,
  options: {
    margins: {
      top: 20,
      right: 20,
      bottom: 30,
      left: 20,
    },
    elasticX: true,
    label: (d) => d.key,
  },
}

export default RowChart
