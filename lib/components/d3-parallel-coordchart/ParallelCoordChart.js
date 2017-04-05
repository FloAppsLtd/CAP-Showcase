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

var _isEqual2 = require('lodash/isEqual');

var _isEqual3 = _interopRequireDefault(_isEqual2);

var _extend2 = require('lodash/extend');

var _extend3 = _interopRequireDefault(_extend2);

var _has2 = require('lodash/has');

var _has3 = _interopRequireDefault(_has2);

var _forEach2 = require('lodash/forEach');

var _forEach3 = _interopRequireDefault(_forEach2);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDom = require('react-dom');

var _reactDom2 = _interopRequireDefault(_reactDom);

var _d = require('d3');

var _d2 = _interopRequireDefault(_d);

require('./parallel-coordinates/d3.parcoords');

var _reactSizeme = require('react-sizeme');

var _reactSizeme2 = _interopRequireDefault(_reactSizeme);

require('./parallel-coordinates/d3.parcoords.css');

require('./style.css');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var ParallelCoordChart = function (_React$Component) {
  (0, _inherits3.default)(ParallelCoordChart, _React$Component);

  function ParallelCoordChart() {
    (0, _classCallCheck3.default)(this, ParallelCoordChart);
    return (0, _possibleConstructorReturn3.default)(this, (ParallelCoordChart.__proto__ || (0, _getPrototypeOf2.default)(ParallelCoordChart)).apply(this, arguments));
  }

  (0, _createClass3.default)(ParallelCoordChart, [{
    key: 'onBrush',
    value: function onBrush(data) {
      var _this2 = this;

      // Set font bold to the indicator label being brushed
      var labels = this.pc.svg.selectAll('text.label')[0];
      (0, _forEach3.default)(labels, function (v) {
        var newClassName = (0, _has3.default)(_this2.pc.brushExtents(), v.__data__) ? 'label selected-column' : 'label';
        v.setAttribute('class', newClassName);
      });

      // Call the function to return the data from the brushed indicators
      this.props.onBrush(data, this.pc.brushExtents());
    }
  }, {
    key: 'componentDidMount',
    value: function componentDidMount() {
      var self = this;
      var _props$size = this.props.size,
          width = _props$size.width,
          height = _props$size.height;
      var _props = this.props,
          minWidth = _props.minWidth,
          minHeight = _props.minHeight,
          dimensions = _props.dimensions,
          data = _props.data,
          hideAxis = _props.hideAxis,
          colorFn = _props.colorFn,
          options = _props.options;
      var margin = options.margin,
          alpha = options.alpha,
          dimensionTitleRotation = options.dimensionTitleRotation,
          nullValueSeparator = options.nullValueSeparator,
          mode = options.mode,
          composite = options.composite,
          brushMode = options.brushMode;

      var DOMNode = _reactDom2.default.findDOMNode(this);

      var defaultOptions = {
        width: minWidth || width,
        height: minHeight || height,
        color: colorFn,
        margin: margin || {
          top: 70,
          right: 30,
          bottom: 30,
          left: 30
        },
        alpha: alpha || 0.35,
        dimensionTitleRotation: dimensionTitleRotation || -50,
        nullValueSeparator: nullValueSeparator || 'top'
      };

      this.pc = _d2.default.parcoords((0, _extend3.default)({}, defaultOptions, options))(DOMNode);

      this.pc = this.pc.width(minWidth || width).height(minHeight || height).mode(mode || 'queue').data(data).dimensions(dimensions).hideAxis(hideAxis).composite(composite || 'darker').render().shadows().reorderable().brushMode(brushMode || '1D-axes').render().updateAxes().on('brushend', function (d) {
        return self.onBrush(d);
      });

      this.pc.svg.selectAll('text.label').attr('transform', 'translate(0,0) rotate(-50)').attr('text-anchor', 'left');
    }
  }, {
    key: 'shouldComponentUpdate',
    value: function shouldComponentUpdate(nextProps) {
      return !(0, _isEqual3.default)(this.props.hideAxis, nextProps.hideAxis) || !(0, _isEqual3.default)(this.props.size.width, nextProps.size.width);
    }
  }, {
    key: 'componentDidUpdate',
    value: function componentDidUpdate(prevProps) {
      var _props2 = this.props,
          dimensions = _props2.dimensions,
          hideAxis = _props2.hideAxis,
          initBrushExtents = _props2.initBrushExtents,
          size = _props2.size;


      if (size.width && !(0, _isEqual3.default)(size.width, prevProps.size.width)) {
        this.pc = this.pc.width(size.width).render().updateAxes();
      }
      var brushExtents = initBrushExtents || this.pc.brushExtents();

      this.pc = this.pc.dimensions(dimensions).hideAxis(hideAxis).render().updateAxes().brushExtents(brushExtents);

      this.pc.svg.selectAll('text.label').attr('transform', 'translate(0,0) rotate(-50)').attr('text-anchor', 'left');
    }
  }, {
    key: 'render',
    value: function render() {
      var name = this.props.name;

      return _react2.default.createElement('div', { id: name,
        className: 'parcoords' });
    }
  }]);
  return ParallelCoordChart;
}(_react2.default.Component); // d3.parcoods extend the d3.js object
//
// Inspired by https://github.com/Git-me-outta-here/react-parallel-coordinates
//

ParallelCoordChart.propTypes = {
  name: _react.PropTypes.string.isRequired,
  minHeight: _react.PropTypes.number,
  minWidth: _react.PropTypes.number,
  data: _react.PropTypes.array.isRequired,
  hideAxis: _react.PropTypes.array,
  dimensions: _react.PropTypes.object.isRequired,
  onBrush: _react.PropTypes.func,
  initBrushExtents: _react.PropTypes.object,
  colorFn: _react.PropTypes.func,
  size: _react.PropTypes.object,
  options: _react.PropTypes.object
};

ParallelCoordChart.defaultProps = {
  hideAxis: [],
  dimensions: {},
  onBrush: function onBrush() {},
  initBrushExtents: {},
  colorFn: null,
  options: {
    alpha: 0.35,
    dimensionTitleRotation: -50,
    margin: {
      top: 70,
      right: 30,
      bottom: 30,
      left: 30
    },
    nullValueSeparator: 'top',
    mode: 'queue',
    composite: 'darker',
    brushMode: '1D-axes'
  }
};

exports.default = (0, _reactSizeme2.default)({
  monitorHeight: false,
  monitorWidth: true
})(ParallelCoordChart);