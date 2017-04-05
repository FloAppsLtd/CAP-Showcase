import React, { PropTypes } from 'react'
import { MapLayer } from 'react-leaflet'
import _ from 'lodash'
import './Leaflet.heat/dist/leaflet-heat'
import { heatLayer } from 'leaflet'
import Legend from './Legend'

class HeatMap extends MapLayer {
  componentWillMount () {
    super.componentWillMount()
    const {map, heatpoints, max} = this.props
    const options = _.extend({}, HeatMap.defaultProps.options, this.props.options)
    this.transformedPoints = this.transformPoints(heatpoints, max)

    this.leafletElement = heatLayer(this.transformedPoints.pointsByLocation, options).addTo(map)
  }

  componentWillReceiveProps (nextProps) {
    super.componentWillReceiveProps(nextProps)
    if (!_.isEqual(this.props.heatpoints, nextProps.heatpoints || this.props.max !== nextProps.max)) {
      this.transformedPoints = this.transformPoints(nextProps.heatpoints, nextProps.max)
      this.leafletElement.setLatLngs(this.transformedPoints.pointsByLocation)
      this.leafletElement._redraw()
    }
    if (!_.isEqual(this.props.options, nextProps.options)) {
      const options = _.extend({}, HeatMap.defaultProps.options, nextProps.options)
      this.leafletElement.setOptions(options)
      this.leafletElement._redraw()
    }
  }

  transformPoints (points, max) {
    if (_.isEmpty(points)) {
      return {
        pointsByLocation: [],
        maxByCount: 0,
      }
    }
    let pointsByLocation = _.groupBy(points, (v) => [v.lat, v.lng])

    let maxByCount = max || _.maxBy(pointsByLocation.values(), 'length').length

    return {
      pointsByLocation: _.map(pointsByLocation, (v, k) => {
        let r = k.split(',')
        let f = _.map(r, parseFloat)
        return {
          lat: f[0],
          lng: f[1],
          alt: v.length / maxByCount
        }
      }),
      maxByCount: maxByCount
    }
  }

  render () {
    const {max, min, showLegend} = this.props
    const options = _.extend({}, HeatMap.defaultProps.options, this.props.options)
    const {legendTitle, legendClassName, gradient} = options

    let vmax = max || this.transformedPoints.maxByCount
    let vmin = min

    return showLegend && !_.isEmpty(this.transformedPoints.pointsByLocation)
      ? <Legend max={ vmax }
          min={ vmin }
          gradient={ gradient }
          legendClassName={ legendClassName }
          legendTitle={ legendTitle } />
      : null
  }
}

HeatMap.propTypes = {
  heatpoints: PropTypes.array.isRequired,
  showLegend: PropTypes.bool,
  max: PropTypes.number,
  min: PropTypes.number,
  options: PropTypes.object,
}

HeatMap.defaultProps = {
  options: {
    maxZoom: 18,
    radius: 25,
    blur: 15,
    opacity: 100,
    minOpacity: 0.05,
    zoomAnimation: true,
    gradient: {
      0.25: 'rgba(0,0,255,1)',
      0.55: 'rgba(0,255,0,1)',
      0.85: 'rgba(255,255,0,1)',
      1.0: 'rgba(255,0,0,1)',
    },
  },
  showLegend: true,
  heatpoints: [],
  min: 1
}

export default HeatMap
