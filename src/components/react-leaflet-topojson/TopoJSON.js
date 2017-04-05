import { geoJSON } from 'leaflet'
import { isFunction, map } from 'lodash'
import { PropTypes } from 'react'
import { Path } from 'react-leaflet'
import { feature } from 'topojson'

class TopoJSON extends Path {
  componentWillMount () {
    super.componentWillMount()
    const {data, ...props} = this.props

    function topoTogeoJSON (topology) {
      if (topology.type === 'Topology') {
        return map(topology.objects, (v) => feature(topology, v))
      } else {
        return topology
      }
    }

    this.leafletElement = geoJSON(topoTogeoJSON(data), props)
  }

  componentDidUpdate (prevProps: Object) {
    if (isFunction(this.props.style)) {
      this.setStyle(this.props.style)
    } else {
      this.setStyleIfChanged(prevProps, this.props)
    }
  }
}

TopoJSON.propTypes = {
  data: PropTypes.oneOfType([PropTypes.array, PropTypes.object]).isRequired,
}

export default TopoJSON
