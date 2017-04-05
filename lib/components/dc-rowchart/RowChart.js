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

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _extend2 = require('lodash/extend');

var _extend3 = _interopRequireDefault(_extend2);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDom = require('react-dom');

var _reactDom2 = _interopRequireDefault(_reactDom);

var _dc = require('dc/dc');

var _dc2 = _interopRequireDefault(_dc);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Use dc/dc.js instead of dc/index.js for crossfilter2 compatibility
var RowChart = function (_React$Component) {
  (0, _inherits3.default)(RowChart, _React$Component);

  function RowChart() {
    (0, _classCallCheck3.default)(this, RowChart);
    return (0, _possibleConstructorReturn3.default)(this, (RowChart.__proto__ || (0, _getPrototypeOf2.default)(RowChart)).apply(this, arguments));
  }

  (0, _createClass3.default)(RowChart, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      var _props = this.props,
          width = _props.width,
          height = _props.height,
          dimension = _props.dimension,
          group = _props.group,
          options = _props.options;

      var DOMNode = _reactDom2.default.findDOMNode(this);

      // Create a dc.js rowChart
      var chart = _dc2.default.rowChart(DOMNode);
      this.chart = this.setChartProperties(chart, width, height, dimension, group, options);
      this.chart.render();
    }
  }, {
    key: 'componentDidUpdate',
    value: function componentDidUpdate() {
      this.chart.redraw();
    }
  }, {
    key: 'setChartProperties',
    value: function setChartProperties(chart, width, height, dimension, group, options) {
      var margins = options.margins,
          label = options.label,
          elasticX = options.elasticX;

      var defaultOptions = {
        height: height,
        width: width,
        margins: margins || {
          top: 20,
          right: 20,
          bottom: 30,
          left: 20
        },
        dimension: dimension,
        group: group,
        elasticX: elasticX || true,
        label: label || function (d) {
          return d.key;
        }
      };
      chart.options((0, _extend3.default)({}, defaultOptions, options));

      return chart;
    }
  }, {
    key: 'render',
    value: function render() {
      var name = this.props.name;

      return _react2.default.createElement('div', { id: name });
    }
  }]);
  return RowChart;
}(_react2.default.Component);

RowChart.propTypes = {
  name: _react.PropTypes.string.isRequired,
  width: _react.PropTypes.number,
  height: _react.PropTypes.number,
  dimension: _react.PropTypes.object.isRequired,
  group: _react.PropTypes.object.isRequired,
  options: _react.PropTypes.object
};

RowChart.defaultProps = {
  height: 300,
  width: 200,
  options: {
    margins: {
      top: 20,
      right: 20,
      bottom: 30,
      left: 20
    },
    elasticX: true,
    label: function label(d) {
      return d.key;
    }
  }
};

exports.default = RowChart;