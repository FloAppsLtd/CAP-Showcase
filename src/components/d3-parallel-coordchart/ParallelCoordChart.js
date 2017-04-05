//
// Inspired by https://github.com/Git-me-outta-here/react-parallel-coordinates
//

import React, { PropTypes } from 'react'
import ReactDOM from 'react-dom'
import _ from 'lodash'
import d3 from 'd3'
import './parallel-coordinates/d3.parcoords' // d3.parcoods extend the d3.js object
import SizeMe from 'react-sizeme'

import './parallel-coordinates/d3.parcoords.css'
import './style.css'

class ParallelCoordChart extends React.Component {
  onBrush (data) {
    // Set font bold to the indicator label being brushed
    let labels = this.pc.svg.selectAll('text.label')[0]
    _.forEach(labels, (v) => {
      let newClassName = _.has(this.pc.brushExtents(), v.__data__) ? 'label selected-column' : 'label'
      v.setAttribute('class', newClassName)
    })

    // Call the function to return the data from the brushed indicators
    this.props.onBrush(data, this.pc.brushExtents())
  }

  componentDidMount () {
    var self = this
    const {width, height} = this.props.size
    const {minWidth, minHeight, dimensions, data, hideAxis, colorFn, options} = this.props
    const {margin, alpha, dimensionTitleRotation, nullValueSeparator, mode, composite, brushMode} = options
    let DOMNode = ReactDOM.findDOMNode(this)

    let defaultOptions = {
      width: minWidth || width,
      height: minHeight || height,
      color: colorFn,
      margin: margin || {
          top: 70,
          right: 30,
          bottom: 30,
          left: 30,
      },
      alpha: alpha || 0.35,
      dimensionTitleRotation: dimensionTitleRotation || -50,
      nullValueSeparator: nullValueSeparator || 'top',
    }

    this.pc = d3.parcoords(_.extend({}, defaultOptions, options))(DOMNode)

    this.pc = this.pc
      .width(minWidth || width)
      .height(minHeight || height)
      .mode(mode || 'queue')
      .data(data)
      .dimensions(dimensions)
      .hideAxis(hideAxis)
      .composite(composite || 'darker')
      .render()
      .shadows()
      .reorderable()
      .brushMode(brushMode || '1D-axes')
      .render()
      .updateAxes()
      .on('brushend', (d) => self.onBrush(d))

    this.pc.svg.selectAll('text.label')
      .attr('transform', 'translate(0,0) rotate(-50)')
      .attr('text-anchor', 'left')
  }

  shouldComponentUpdate (nextProps) {
    return !_.isEqual(this.props.hideAxis, nextProps.hideAxis) ||
      !_.isEqual(this.props.size.width, nextProps.size.width)
  }

  componentDidUpdate (prevProps) {
    const {dimensions, hideAxis, initBrushExtents, size} = this.props

    if (size.width && !_.isEqual(size.width, prevProps.size.width)) {
      this.pc = this.pc
        .width(size.width)
        .render()
        .updateAxes()
    }
    let brushExtents = initBrushExtents || this.pc.brushExtents()

    this.pc = this.pc
      .dimensions(dimensions)
      .hideAxis(hideAxis)
      .render()
      .updateAxes()
      .brushExtents(brushExtents)

    this.pc.svg.selectAll('text.label')
      .attr('transform', 'translate(0,0) rotate(-50)')
      .attr('text-anchor', 'left')
  }

  render () {
    const {name} = this.props
    return (
      <div id={ name }
        className='parcoords' />
    )
  }
}

ParallelCoordChart.propTypes = {
  name: PropTypes.string.isRequired,
  minHeight: PropTypes.number,
  minWidth: PropTypes.number,
  data: PropTypes.array.isRequired,
  hideAxis: PropTypes.array,
  dimensions: PropTypes.object.isRequired,
  onBrush: PropTypes.func,
  initBrushExtents: PropTypes.object,
  colorFn: PropTypes.func,
  size: PropTypes.object,
  options: PropTypes.object,
}

ParallelCoordChart.defaultProps = {
  hideAxis: [],
  dimensions: {},
  onBrush: () => {
  },
  initBrushExtents: {},
  colorFn: null,
  options: {
    alpha: 0.35,
    dimensionTitleRotation: -50,
    margin: {
      top: 70,
      right: 30,
      bottom: 30,
      left: 30,
    },
    nullValueSeparator: 'top',
    mode: 'queue',
    composite: 'darker',
    brushMode: '1D-axes',
  },
}

export default SizeMe({
  monitorHeight: false,
  monitorWidth: true,
})(ParallelCoordChart)
