'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _objectWithoutProperties2 = require('babel-runtime/helpers/objectWithoutProperties');

var _objectWithoutProperties3 = _interopRequireDefault(_objectWithoutProperties2);

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

var _isFunction2 = require('lodash/isFunction');

var _isFunction3 = _interopRequireDefault(_isFunction2);

var _leaflet = require('leaflet');

var _react = require('react');

var _reactLeaflet = require('react-leaflet');

var _topojson = require('topojson');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var TopoJSON = function (_Path) {
  (0, _inherits3.default)(TopoJSON, _Path);

  function TopoJSON() {
    (0, _classCallCheck3.default)(this, TopoJSON);
    return (0, _possibleConstructorReturn3.default)(this, (TopoJSON.__proto__ || (0, _getPrototypeOf2.default)(TopoJSON)).apply(this, arguments));
  }

  (0, _createClass3.default)(TopoJSON, [{
    key: 'componentWillMount',
    value: function componentWillMount() {
      (0, _get3.default)(TopoJSON.prototype.__proto__ || (0, _getPrototypeOf2.default)(TopoJSON.prototype), 'componentWillMount', this).call(this);
      var _props = this.props,
          data = _props.data,
          props = (0, _objectWithoutProperties3.default)(_props, ['data']);


      function topoTogeoJSON(topology) {
        if (topology.type === 'Topology') {
          return (0, _map3.default)(topology.objects, function (v) {
            return (0, _topojson.feature)(topology, v);
          });
        } else {
          return topology;
        }
      }

      this.leafletElement = (0, _leaflet.geoJSON)(topoTogeoJSON(data), props);
    }
  }, {
    key: 'componentDidUpdate',
    value: function componentDidUpdate(prevProps) {
      if ((0, _isFunction3.default)(this.props.style)) {
        this.setStyle(this.props.style);
      } else {
        this.setStyleIfChanged(prevProps, this.props);
      }
    }
  }]);
  return TopoJSON;
}(_reactLeaflet.Path);

TopoJSON.propTypes = {
  data: _react.PropTypes.oneOfType([_react.PropTypes.array, _react.PropTypes.object]).isRequired
};

exports.default = TopoJSON;