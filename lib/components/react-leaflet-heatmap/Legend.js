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

var _sortBy2 = require('lodash/fp/sortBy');

var _sortBy3 = _interopRequireDefault(_sortBy2);

var _join2 = require('lodash/fp/join');

var _join3 = _interopRequireDefault(_join2);

var _keys2 = require('lodash/fp/keys');

var _keys3 = _interopRequireDefault(_keys2);

var _map2 = require('lodash/fp/map');

var _map3 = _interopRequireDefault(_map2);

var _flow2 = require('lodash/fp/flow');

var _flow3 = _interopRequireDefault(_flow2);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

require('./style.css');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Legend = function (_Component) {
  (0, _inherits3.default)(Legend, _Component);

  function Legend() {
    (0, _classCallCheck3.default)(this, Legend);
    return (0, _possibleConstructorReturn3.default)(this, (Legend.__proto__ || (0, _getPrototypeOf2.default)(Legend)).apply(this, arguments));
  }

  (0, _createClass3.default)(Legend, [{
    key: 'shouldComponentUpdate',
    value: function shouldComponentUpdate(nextProps) {
      return nextProps !== this.props;
    }
  }, {
    key: 'makeGradientStyle',
    value: function makeGradientStyle(gradient) {
      var gradientStyle = (0, _flow3.default)(_keys3.default, (0, _map3.default)(parseFloat), (0, _sortBy3.default)(function (v) {
        return v;
      }), (0, _map3.default)(function (v) {
        return '' + gradient[v] + v * 100 + '%';
      }), (0, _join3.default)(', '))(gradient);

      return {
        background: ['linear-gradient(to right, ' + gradientStyle + ')']
      };
    }
  }, {
    key: 'render',
    value: function render() {
      var _props = this.props,
          max = _props.max,
          min = _props.min,
          gradient = _props.gradient,
          legendClassName = _props.legendClassName,
          legendTitle = _props.legendTitle;


      return _react2.default.createElement(
        'div',
        { className: legendClassName },
        _react2.default.createElement(
          'h4',
          null,
          legendTitle
        ),
        _react2.default.createElement('img', { style: this.makeGradientStyle(gradient) }),
        _react2.default.createElement(
          'div',
          null,
          _react2.default.createElement(
            'span',
            { className: 'legend-min' },
            min
          ),
          _react2.default.createElement(
            'span',
            { className: 'legend-max' },
            max
          )
        )
      );
    }
  }]);
  return Legend;
}(_react.Component);

Legend.propTypes = {
  max: _react.PropTypes.number.isRequired,
  min: _react.PropTypes.number.isRequired,
  gradient: _react.PropTypes.object.isRequired,
  legendTitle: _react.PropTypes.string,
  legendClassName: _react.PropTypes.string
};

Legend.defaultProps = {
  legendTitle: 'Totals',
  legendClassName: 'map-legend'
};

exports.default = Legend;