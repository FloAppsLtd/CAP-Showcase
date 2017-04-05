import React, { PropTypes } from 'react'
import ReactDOM from 'react-dom'
import d3 from 'd3'
import dc from 'dc/dc' // Use dc/dc.js instead of dc/index.js for crossfilter2 compatibility
import d3Tip from 'd3-tip'
import _ from 'lodash'
import { renderToStaticMarkup } from 'react-dom/server'

class BarChart extends React.Component {
  componentDidMount () {
    const {width, height, dimension, group, xRange, yRange, getChartID, rangeFilter, rangeChartID, children, options} = this.props
    let DOMNode = ReactDOM.findDOMNode(this)

    // Create a dc.js barChart
    const chart = dc.barChart(DOMNode)
    this.chart = this.setChartProperties(chart, width, height, dimension, group, xRange, yRange, rangeFilter, rangeChartID, children, options)
    this.chart.render()

    if (getChartID) {
      getChartID(this.chart.chartID())
    }
  }

  componentDidUpdate (prevProps) {
    const {width, height, dimension, group, xRange, yRange, getChartID, rangeFilter, rangeChartID, children, options} = this.props

    if (!_.isEqual(xRange, prevProps.xRange) || !_.isEqual(yRange, prevProps.yRange)) {
      this.chart = this.setChartProperties(this.chart, width, height, dimension, group, xRange, yRange, rangeChartID, rangeFilter, children, options)
      this.chart.rescale()
    } else {
      this.chart.redraw()
    }

    if (!_.isEqual(rangeChartID, prevProps.rangeChartID)) {
      this.chart = this.setChartProperties(this.chart, width, height, dimension, group, xRange, yRange, rangeChartID, rangeFilter, children, options)
      this.chart.render()
    } else {
      this.chart.redraw()
    }

    if (getChartID) {
      getChartID(this.chart.chartID())
      this.chart.redraw()
    }

    if (!_.isEqual(rangeFilter, prevProps.rangeFilter)) {
      this.chart.filter(null) // Clear filters before applying new ones
      if (rangeFilter) {
        this.chart.filter(dc.filters.TwoDimensionalFilter(rangeFilter))
      } else {
        dc.redrawAll()
      }
      this.chart.redraw()
    }
  }

  setChartProperties (chart, width, height, dimension, group, xRange, yRange, rangeChartID, rangeFilter, toolTipHtml, options) {
    const {margins, valueAccessor, x, y, xUnits, renderVerticalGridLines, transitionDuration, yAxisTicks, mouseZoomable, brushOn} = options

    let defaultOptions = {
      width: width,
      height: height,
      margins: margins || {
          top: 20,
          right: 20,
          bottom: 30,
          left: 20,
      },
      dimension: dimension,
      group: group,
      valueAccessor: valueAccessor || ((d) => d.value.count),
      xUnits: xUnits || d3.time.hours,
      x: x || d3.time.scale().domain(xRange),
      brushOn: brushOn || true,
      elasticY: _.isNil(yRange),
      mouseZoomable: mouseZoomable || false,
      renderVerticalGridLines: renderVerticalGridLines || true,
      transitionDuration: transitionDuration || 500,
    }

    chart.options(_.extend({}, defaultOptions, options))

    if (!_.isNil(yRange)) {
      chart.y(y || d3.scale.linear().domain(yRange))
    }

    chart.yAxis().ticks(!_.isNil(yAxisTicks) ? yAxisTicks : 4)

    chart.on('renderlet', (ch) => {
      // Create toolTip ----
      // TODO: separate into it's own function passing the offset,
      // className, Html element as parameters.
      if (toolTipHtml) {
        // Remove all previous d3-tip elements
        d3.selectAll('.d3-tip').remove()
        let toolTip = d3Tip()
          .attr('class', 'd3-tip')
          .offset([0, 0])
          .html(function (d) {
            return renderToStaticMarkup(toolTipHtml({
              data: d.data,
            }))
          })

        let bar = ch.selectAll('rect.bar')

        if (!bar.empty()) {
          bar.call(toolTip)

          bar.on('mouseover', function (d) {
            toolTip.show(d, this)
          })

          bar.on('mouseout', function (d) {
            toolTip.hide(d, this)
          })
        }
      }
      // ----

      ch.selectAll('g.x text')
        .attr('transform', 'translate(-25,9) rotate(-20)')
    })

    if (rangeChartID) {
      let rangeChart = _.find(dc.chartRegistry.list(), (v) => v.chartID() === rangeChartID)
      chart.rangeChart(rangeChart)
    }

    return chart
  }

  render () {
    const {name} = this.props
    return (
      <div id={ name } />
    )
  }
}

BarChart.propTypes = {
  name: PropTypes.string.isRequired,
  width: PropTypes.number,
  height: PropTypes.number,
  dimension: PropTypes.object.isRequired,
  group: PropTypes.object.isRequired,
  xRange: PropTypes.array.isRequired,
  yRange: PropTypes.array,
  rangeChartID: PropTypes.number,
  getChartID: PropTypes.func,
  rangeFilter: PropTypes.array,
  children: PropTypes.func,
  options: PropTypes.object,
}

BarChart.defaultProps = {
  width: 600,
  height: 200,
  yRange: null,
  rangeChartID: null,
  children: null,
  rangeFilter: null,
  options: {
    margins: {
      top: 10,
      right: 20,
      bottom: 30,
      left: 20,
    },
    keyAccessor: (d) => d.key,
    valueAccessor: (d) => d.value.count,
    xUnits: d3.time.hours,
    brushOn: true,
    gap: 5,
    centerBar: true,
    mouseZoomable: false,
    renderTitle: false,
    renderHorizontalGridLines: true,
    renderVerticalGridLines: true,
    transitionDuration: 500,
    yAxisTicks: 4,
  },
}

export default BarChart
