'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _keys = require('babel-runtime/core-js/object/keys');

var _keys2 = _interopRequireDefault(_keys);

var _getPrototypeOf = require('babel-runtime/core-js/object/get-prototype-of');

var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _get2 = require('babel-runtime/helpers/get');

var _get3 = _interopRequireDefault(_get2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _map2 = require('lodash/map');

var _map3 = _interopRequireDefault(_map2);

var _extend2 = require('lodash/extend');

var _extend3 = _interopRequireDefault(_extend2);

var _react = require('react');

var _server = require('react-dom/server');

var _server2 = _interopRequireDefault(_server);

var _leaflet = require('leaflet');

var _leaflet2 = _interopRequireDefault(_leaflet);

var _reactLeaflet = require('react-leaflet');

require('leaflet.markercluster');

require('./style.css');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Cluster component modified from:
 * https://github.com/troutowicz/geoshare/blob/master/app/components/MarkerCluster.jsx
 */
var CircleIcon = _leaflet2.default.DivIcon.extend({
  options: {
    iconSize: [12, 12],
    iconAnchor: [6, 6],
    popupAnchor: [0, -6]
  }
});

var ClusterCircleIcon = _leaflet2.default.DivIcon.extend({
  options: {
    iconSize: [30, 30],
    iconAnchor: [15, 0],
    popupAnchor: [0, 0]
  }
});

var MarkerCluster = function (_MapLayer) {
  (0, _inherits3.default)(MarkerCluster, _MapLayer);

  function MarkerCluster() {
    (0, _classCallCheck3.default)(this, MarkerCluster);
    return (0, _possibleConstructorReturn3.default)(this, (MarkerCluster.__proto__ || (0, _getPrototypeOf2.default)(MarkerCluster)).apply(this, arguments));
  }

  (0, _createClass3.default)(MarkerCluster, [{
    key: 'componentWillMount',
    value: function componentWillMount() {
      (0, _get3.default)(MarkerCluster.prototype.__proto__ || (0, _getPrototypeOf2.default)(MarkerCluster.prototype), 'componentWillMount', this).call(this);

      var options = (0, _extend3.default)({}, MarkerCluster.defaultProps.options, this.props.options);
      var spiderfyOnMaxZoom = options.spiderfyOnMaxZoom,
          showCoverageOnHover = options.showCoverageOnHover,
          zoomToBoundsOnClick = options.zoomToBoundsOnClick,
          maxClusterRadius = options.maxClusterRadius,
          opacity = options.opacity,
          chunkedLoading = options.chunkedLoading,
          removeOutsideVisibleBounds = options.removeOutsideVisibleBounds;


      this.leafletElement = _leaflet2.default.markerClusterGroup({
        spiderfyOnMaxZoom: spiderfyOnMaxZoom,
        showCoverageOnHover: showCoverageOnHover,
        zoomToBoundsOnClick: zoomToBoundsOnClick,
        maxClusterRadius: maxClusterRadius,
        opacity: opacity,
        chunkedLoading: chunkedLoading,
        removeOutsideVisibleBounds: removeOutsideVisibleBounds,
        iconCreateFunction: function iconCreateFunction(markers) {
          return new ClusterCircleIcon({
            html: markers.getAllChildMarkers().length,
            className: 'marker-cluster-divicon'
          });
        }
      });
      var _props = this.props,
          data = _props.data,
          focusMarker = _props.focusMarker,
          useGeoCoding = _props.useGeoCoding,
          looUpLocationService = _props.looUpLocationService;

      this.showMarkersData(this.leafletElement, data, focusMarker, useGeoCoding, looUpLocationService);
    }
  }, {
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      (0, _get3.default)(MarkerCluster.prototype.__proto__ || (0, _getPrototypeOf2.default)(MarkerCluster.prototype), 'componentWillMount', this).call(this);
      this.leafletElement.remove();
    }
  }, {
    key: 'componentWillReceiveProps',
    value: function componentWillReceiveProps(nextProps) {
      (0, _get3.default)(MarkerCluster.prototype.__proto__ || (0, _getPrototypeOf2.default)(MarkerCluster.prototype), 'componentWillReceiveProps', this).call(this, nextProps);
      var data = nextProps.data,
          focusMarker = nextProps.focusMarker,
          useGeoCoding = nextProps.useGeoCoding,
          looUpLocationService = nextProps.looUpLocationService;

      this.showMarkersData(this.leafletElement, data, focusMarker, useGeoCoding, looUpLocationService);
    }
  }, {
    key: 'showMarkersData',
    value: function showMarkersData(leafletElement, data, focusMarker, useGeoCoding, looUpLocationService) {
      var _this2 = this;

      this.props.map.closePopup();

      // Remove all markers
      // TODO: optimize to add or remove only markers that have changed instead of
      // clearing all markers on every update.
      leafletElement.clearLayers();
      // Add markers to cluster layer
      if (data.length > 0) {
        var markers = {};
        var newMarkers = [];

        data.forEach(function (obj) {
          var markerPopup = _this2.makeMarkerPopup([obj.data], null);

          var leafletMarker = _leaflet2.default.marker([obj.lat, obj.lng]).bindPopup(markerPopup, {
            closeButton: true
          }).setIcon(new CircleIcon({
            className: 'marker-divicon'
          })).on('mouseover', function () {
            // Get location name
            if (useGeoCoding) {
              // Include and call location name service
              var _require = require('./geoCodingService'),
                  getLocationName = _require.getLocationName;

              getLocationName(obj, looUpLocationService, true).then(function (location) {
                leafletMarker.setPopupContent(_this2.makeMarkerPopup([obj.data], location.locationName));
                return location;
              });
            }
            leafletMarker.openPopup();
          });

          markers[obj.data.id] = leafletMarker;
          // Add data to leaflet marker so it would be accessible to cluster popups.
          markers[obj.data.id]._markerData = obj.data;
          newMarkers.push(leafletMarker);
        });

        leafletElement.addLayers(newMarkers);
        setTimeout(function () {
          leafletElement.refreshClusters(markers);
          _this2.showMarkersClusterData(leafletElement);
        }, 0);
      }

      // zoom to particular marker
      if ((0, _keys2.default)(focusMarker).length > 0) {
        var latLng = [focusMarker.lat, focusMarker.lng];
        var marker = this.props.markers[focusMarker.id];
        this.leafletElement.zoomToShowLayer(marker, function () {
          _this2.props.map.panTo(latLng);
          marker.openPopup();
        });
      }
    }
  }, {
    key: 'makeMarkerPopup',
    value: function makeMarkerPopup(points, locationName) {
      return _server2.default.renderToStaticMarkup(this.props.children({
        points: points,
        geoLocationName: locationName
      }));
    }
  }, {
    key: 'showMarkersClusterData',
    value: function showMarkersClusterData(leafletElement) {
      var self = this;
      var _props2 = this.props,
          map = _props2.map,
          useGeoCoding = _props2.useGeoCoding,
          looUpLocationService = _props2.looUpLocationService;

      leafletElement._events.clustermouseover = null;
      leafletElement._events.clusterclick = null;
      leafletElement.on('clustermouseover', function (c) {
        var markers = c.layer.getAllChildMarkers();
        var mData = (0, _map3.default)(markers, '_markerData');
        // Add location name to the marker popup
        if (useGeoCoding) {
          // Include and call location name service
          var _require2 = require('./geoCodingService'),
              getLocationName = _require2.getLocationName;

          getLocationName(c.layer.getLatLng(), looUpLocationService, false).then(function (location) {
            _leaflet2.default.popup({
              closeButton: true
            }).setLatLng(c.layer.getLatLng()).setContent(self.makeMarkerPopup(mData, location.locationName)).openOn(map);
          });

          // Don't add location name to the marker popup
        } else {
          _leaflet2.default.popup({
            closeButton: true
          }).setLatLng(c.layer.getLatLng()).setContent(self.makeMarkerPopup(mData, null)).openOn(map);
        }
      }).on('clusterclick', function (c) {
        c.layer.zoomToBounds();
      });
    }
  }, {
    key: 'render',
    value: function render() {
      return null;
    }
  }]);
  return MarkerCluster;
}(_reactLeaflet.MapLayer);

MarkerCluster.propTypes = {
  children: _react.PropTypes.func.isRequired,
  focusMarker: _react.PropTypes.object,
  map: _react.PropTypes.object,
  data: _react.PropTypes.array,
  useGeoCoding: _react.PropTypes.bool,
  geoCodingService: _react.PropTypes.string,
  options: _react.PropTypes.object
};

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
    removeOutsideVisibleBounds: true
  }
};

exports.default = MarkerCluster;