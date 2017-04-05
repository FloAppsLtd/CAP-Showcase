import React from 'react'
import { TopoJSON, HeatMap, MarkerCluster } from '../../src'
import { Map } from 'react-leaflet'
import markerPopup from './markerPopup'
import countries from '../data/world-countries.topo.json'

const mapOptions = {
  center: [32, 40],
  zoom: 2,
  maxZoom: 10,
  minZoom: 2,
  zoomControl: true,
}
const heatmapOptions = {
  radius: 13,
  blur: 8,
  opacity: 110,
}

class WorldMap extends React.Component {
  render () {
    const {points, toggleHeatmap, max} = this.props

    return (
      <Map {...mapOptions}>
        <TopoJSON data={ countries } />
        { toggleHeatmap
          ? <HeatMap heatpoints={ points }
              showLegend
              max={ max }
              options={ heatmapOptions } />
          : <MarkerCluster data={ points }
              useGeoCoding>
              { markerPopup }
            </MarkerCluster> }
      </Map>
    )
  }
}

export default WorldMap
