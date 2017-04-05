/**
 * Cluster component modified from:
 * https://github.com/troutowicz/geoshare/blob/master/app/components/MarkerCluster.jsx
 */
import { PropTypes } from 'react'
import _ from 'lodash'
import ReactDOM from 'react-dom/server'
import Leaflet from 'leaflet'
import { MapLayer } from 'react-leaflet'
import 'leaflet.markercluster'
import './style.css'

let CircleIcon = Leaflet.DivIcon.extend({
  options: {
    iconSize: [12, 12],
    iconAnchor: [6, 6],
    popupAnchor: [0, -6],
  },
})

let ClusterCircleIcon = Leaflet.DivIcon.extend({
  options: {
    iconSize: [30, 30],
    iconAnchor: [15, 0],
    popupAnchor: [0, 0],
  },
})

class MarkerCluster extends MapLayer {
  componentWillMount () {
    super.componentWillMount()

    const options = _.extend({}, MarkerCluster.defaultProps.options, this.props.options)
    const {spiderfyOnMaxZoom, showCoverageOnHover, zoomToBoundsOnClick, maxClusterRadius, opacity, chunkedLoading, removeOutsideVisibleBounds} = options

    this.leafletElement = Leaflet.markerClusterGroup(
      {
        spiderfyOnMaxZoom: spiderfyOnMaxZoom,
        showCoverageOnHover: showCoverageOnHover,
        zoomToBoundsOnClick: zoomToBoundsOnClick,
        maxClusterRadius: maxClusterRadius,
        opacity: opacity,
        chunkedLoading: chunkedLoading,
        removeOutsideVisibleBounds: removeOutsideVisibleBounds,
        iconCreateFunction: (markers) => {
          return new ClusterCircleIcon({
            html: markers.getAllChildMarkers().length,
            className: 'marker-cluster-divicon',
          })
        },
      }
    )
    const {data, focusMarker, useGeoCoding, looUpLocationService} = this.props
    this.showMarkersData(this.leafletElement, data, focusMarker, useGeoCoding, looUpLocationService)
  }

  componentWillUnmount () {
    super.componentWillMount()
    this.leafletElement.remove()
  }

  componentWillReceiveProps (nextProps) {
    super.componentWillReceiveProps(nextProps)
    const {data, focusMarker, useGeoCoding, looUpLocationService} = nextProps
    this.showMarkersData(this.leafletElement, data, focusMarker, useGeoCoding, looUpLocationService)
  }

  showMarkersData (leafletElement, data, focusMarker, useGeoCoding, looUpLocationService) {
    this.props.map.closePopup()

    // Remove all markers
    // TODO: optimize to add or remove only markers that have changed instead of
    // clearing all markers on every update.
    leafletElement.clearLayers()
    // Add markers to cluster layer
    if (data.length > 0) {
      let markers = {}
      let newMarkers = []

      data.forEach((obj) => {
        let markerPopup = this.makeMarkerPopup([obj.data], null)

        let leafletMarker = Leaflet.marker([obj.lat, obj.lng])
          .bindPopup(markerPopup, {
            closeButton: true,
          })
          .setIcon(new CircleIcon({
            className: 'marker-divicon',
          }))
          .on('mouseover', () => {
            // Get location name
            if (useGeoCoding) {
              // Include and call location name service
              const {getLocationName} = require('./geoCodingService')
              getLocationName(obj, looUpLocationService, true).then((location) => {
                leafletMarker.setPopupContent(this.makeMarkerPopup([obj.data], location.locationName))
                return location
              })
            }
            leafletMarker.openPopup()
          })

        markers[obj.data.id] = leafletMarker
        // Add data to leaflet marker so it would be accessible to cluster popups.
        markers[obj.data.id]._markerData = obj.data
        newMarkers.push(leafletMarker)
      })

      leafletElement.addLayers(newMarkers)
      setTimeout(() => {
        leafletElement.refreshClusters(markers)
        this.showMarkersClusterData(leafletElement)
      }, 0)
    }

    // zoom to particular marker
    if (Object.keys(focusMarker).length > 0) {
      let latLng = [focusMarker.lat, focusMarker.lng]
      let marker = this.props.markers[focusMarker.id]
      this.leafletElement.zoomToShowLayer(marker, () => {
        this.props.map.panTo(latLng)
        marker.openPopup()
      })
    }
  }

  makeMarkerPopup (points, locationName) {
    return ReactDOM.renderToStaticMarkup(
      this.props.children({
        points: points,
        geoLocationName: locationName,
      }))
  }

  showMarkersClusterData (leafletElement) {
    let self = this
    const {map, useGeoCoding, looUpLocationService} = this.props
    leafletElement._events.clustermouseover = null
    leafletElement._events.clusterclick = null
    leafletElement
      .on('clustermouseover', function (c) {
        const markers = c.layer.getAllChildMarkers()
        let mData = _.map(markers, '_markerData')
        // Add location name to the marker popup
        if (useGeoCoding) {
          // Include and call location name service
          const {getLocationName} = require('./geoCodingService')
          getLocationName(c.layer.getLatLng(), looUpLocationService, false).then((location) => {
            Leaflet.popup({
              closeButton: true,
            })
              .setLatLng(c.layer.getLatLng())
              .setContent(self.makeMarkerPopup(mData, location.locationName))
              .openOn(map)
          })

        // Don't add location name to the marker popup
        } else {
          Leaflet.popup({
            closeButton: true,
          })
            .setLatLng(c.layer.getLatLng())
            .setContent(self.makeMarkerPopup(mData, null))
            .openOn(map)
        }
      })
      .on('clusterclick', function (c) {
        c.layer.zoomToBounds()
      })
  }

  render () {
    return null
  }
}

MarkerCluster.propTypes = {
  children: PropTypes.func.isRequired,
  focusMarker: PropTypes.object,
  map: PropTypes.object,
  data: PropTypes.array,
  useGeoCoding: PropTypes.bool,
  geoCodingService: PropTypes.string,
  options: PropTypes.object,
}

MarkerCluster.defaultProps = {
  data: [],
  focusMarker: {},
  useGeoCoding: true,
  geoCodingService: 'OPEN_STREET_MAP',
  options: {
    spiderfyOnMaxZoom: false,
    showCoverageOnHover: false,
    zoomToBoundsOnClick: true,
    maxClusterRadius: 30,
    opacity: 1,
    chunkedLoading: true,
    removeOutsideVisibleBounds: true,
  },
}

export default MarkerCluster
