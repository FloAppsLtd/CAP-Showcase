import React, { PropTypes } from 'react'
import ReactDOM from 'react-dom'
import { renderToStaticMarkup } from 'react-dom/server'
import dc from 'dc/dc' // Use dc/dc.js instead of dc/index.js for crossfilter2 compatibility

class DataCount extends React.Component {
  componentDidMount () {
    const {dimension, group, templateAll, templateSome} = this.props

    let DOMNode = ReactDOM.findDOMNode(this)
    const chart = dc.dataCount(DOMNode)

    this.chart = this.setChartProperties(chart, dimension, group, templateAll, templateSome)
  }

  componentDidUpdate () {
    this.chart.redraw()
  }

  setChartProperties (chart, dimension, group, templateAll, templateSome) {
    chart
      .dimension(dimension)
      .group(group)
      .html({
        all: templateAll ? renderToStaticMarkup(templateAll) : 'All records selected. Click on charts to apply filters',
        some: templateSome ? renderToStaticMarkup(templateSome) : '%filter-count out of %total-count records selected',
      })

    return chart
  }

  render () {
    const {name} = this.props
    return (
      <div id={ name } />
    )
  }
}

DataCount.propTypes = {
  name: PropTypes.string.isRequired,
  dimension: PropTypes.object.isRequired,
  group: PropTypes.object.isRequired,
  templateAll: PropTypes.element,
  templateSome: PropTypes.element,
}

DataCount.defaultProps = {
  templateAll: null,
  templateSome: null,
}

export default DataCount
