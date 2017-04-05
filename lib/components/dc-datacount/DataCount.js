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

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDom = require('react-dom');

var _reactDom2 = _interopRequireDefault(_reactDom);

var _server = require('react-dom/server');

var _dc = require('dc/dc');

var _dc2 = _interopRequireDefault(_dc);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Use dc/dc.js instead of dc/index.js for crossfilter2 compatibility

var DataCount = function (_React$Component) {
  (0, _inherits3.default)(DataCount, _React$Component);

  function DataCount() {
    (0, _classCallCheck3.default)(this, DataCount);
    return (0, _possibleConstructorReturn3.default)(this, (DataCount.__proto__ || (0, _getPrototypeOf2.default)(DataCount)).apply(this, arguments));
  }

  (0, _createClass3.default)(DataCount, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      var _props = this.props,
          dimension = _props.dimension,
          group = _props.group,
          templateAll = _props.templateAll,
          templateSome = _props.templateSome;


      var DOMNode = _reactDom2.default.findDOMNode(this);
      var chart = _dc2.default.dataCount(DOMNode);

      this.chart = this.setChartProperties(chart, dimension, group, templateAll, templateSome);
    }
  }, {
    key: 'componentDidUpdate',
    value: function componentDidUpdate() {
      this.chart.redraw();
    }
  }, {
    key: 'setChartProperties',
    value: function setChartProperties(chart, dimension, group, templateAll, templateSome) {
      chart.dimension(dimension).group(group).html({
        all: templateAll ? (0, _server.renderToStaticMarkup)(templateAll) : 'All records selected. Click on charts to apply filters',
        some: templateSome ? (0, _server.renderToStaticMarkup)(templateSome) : '%filter-count out of %total-count records selected'
      });

      return chart;
    }
  }, {
    key: 'render',
    value: function render() {
      var name = this.props.name;

      return _react2.default.createElement('div', { id: name });
    }
  }]);
  return DataCount;
}(_react2.default.Component);

DataCount.propTypes = {
  name: _react.PropTypes.string.isRequired,
  dimension: _react.PropTypes.object.isRequired,
  group: _react.PropTypes.object.isRequired,
  templateAll: _react.PropTypes.element,
  templateSome: _react.PropTypes.element
};

DataCount.defaultProps = {
  templateAll: null,
  templateSome: null
};

exports.default = DataCount;