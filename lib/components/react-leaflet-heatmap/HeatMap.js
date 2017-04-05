'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

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

var _maxBy2 = require('lodash/maxBy');

var _maxBy3 = _interopRequireDefault(_maxBy2);

var _groupBy2 = require('lodash/groupBy');

var _groupBy3 = _interopRequireDefault(_groupBy2);

var _isEmpty2 = require('lodash/isEmpty');

var _isEmpty3 = _interopRequireDefault(_isEmpty2);

var _isEqual2 = require('lodash/isEqual');

var _isEqual3 = _interopRequireDefault(_isEqual2);

var _extend2 = require('lodash/extend');

var _extend3 = _interopRequireDefault(_extend2);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactLeaflet = require('react-leaflet');

require('./Leaflet.heat/dist/leaflet-heat');

var _leaflet = require('leaflet');

var _Legend = require('./Legend');

var _Legend2 = _interopRequireDefault(_Legend);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var HeatMap = function (_MapLayer) {
  (0, _inherits3.default)(HeatMap, _MapLayer);

  function HeatMap() {
    (0, _classCallCheck3.default)(this, HeatMap);
    return (0, _possibleConstructorReturn3.default)(this, (HeatMap.__proto__ || (0, _getPrototypeOf2.default)(HeatMap)).apply(this, arguments));
  }

  (0, _createClass3.default)(HeatMap, [{
    key: 'componentWillMount',
    value: function componentWillMount() {
      (0, _get3.default)(HeatMap.prototype.__proto__ || (0, _getPrototypeOf2.default)(HeatMap.prototype), 'componentWillMount', this).call(this);
      var _props = this.props,
          map = _props.map,
          heatpoints = _props.heatpoints,
          max = _props.max;

      var options = (0, _extend3.default)({}, HeatMap.defaultProps.options, this.props.options);
      this.transformedPoints = this.transformPoints(heatpoints, max);

      this.leafletElement = (0, _leaflet.heatLayer)(this.transformedPoints.pointsByLocation, options).addTo(map);
    }
  }, {
    key: 'componentWillReceiveProps',
    value: function componentWillReceiveProps(nextProps) {
      (0, _get3.default)(HeatMap.prototype.__proto__ || (0, _getPrototypeOf2.default)(HeatMap.prototype), 'componentWillReceiveProps', this).call(this, nextProps);
      if (!(0, _isEqual3.default)(this.props.heatpoints, nextProps.heatpoints || this.props.max !== nextProps.max)) {
        this.transformedPoints = this.transformPoints(nextProps.heatpoints, nextProps.max);
        this.leafletElement.setLatLngs(this.transformedPoints.pointsByLocation);
        this.leafletElement._redraw();
      }
      if (!(0, _isEqual3.default)(this.props.options, nextProps.options)) {
        var options = (0, _extend3.default)({}, HeatMap.defaultProps.options, nextProps.options);
        this.leafletElement.setOptions(options);
        this.leafletElement._redraw();
      }
    }
  }, {
    key: 'transformPoints',
    value: function transformPoints(points, max) {
      if ((0, _isEmpty3.default)(points)) {
        return {
          pointsByLocation: [],
          maxByCount: 0
        };
      }
      var pointsByLocation = (0, _groupBy3.default)(points, function (v) {
        return [v.lat, v.lng];
      });

      var maxByCount = max || (0, _maxBy3.default)(pointsByLocation.values(), 'length').length;

      return {
        pointsByLocation: (0, _map3.default)(pointsByLocation, function (v, k) {
          var r = k.split(',');
          var f = (0, _map3.default)(r, parseFloat);
          return {
            lat: f[0],
            lng: f[1],
            alt: v.length / maxByCount
          };
        }),
        maxByCount: maxByCount
      };
    }
  }, {
    key: 'render',
    value: function render() {
      var _props2 = this.props,
          max = _props2.max,
          min = _props2.min,
          showLegend = _props2.showLegend;

      var options = (0, _extend3.default)({}, HeatMap.defaultProps.options, this.props.options);
      var legendTitle = options.legendTitle,
          legendClassName = options.legendClassName,
          gradient = options.gradient;


      var vmax = max || this.transformedPoints.maxByCount;
      var vmin = min;

      return showLegend && !(0, _isEmpty3.default)(this.transformedPoints.pointsByLocation) ? _react2.default.createElement(_Legend2.default, { max: vmax,
        min: vmin,
        gradient: gradient,
        legendClassName: legendClassName,
        legendTitle: legendTitle }) : null;
    }
  }]);
  return HeatMap;
}(_reactLeaflet.MapLayer);

HeatMap.propTypes = {
  heatpoints: _react.PropTypes.array.isRequired,
  showLegend: _react.PropTypes.bool,
  max: _react.PropTypes.number,
  min: _react.PropTypes.number,
  options: _react.PropTypes.object
};

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
      1.0: 'rgba(255,0,0,1)'
    }
  },
  showLegend: true,
  heatpoints: [],
  min: 1
};

exports.default = HeatMap;