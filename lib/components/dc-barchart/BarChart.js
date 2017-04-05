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

var _find2 = require('lodash/find');

var _find3 = _interopRequireDefault(_find2);

var _extend2 = require('lodash/extend');

var _extend3 = _interopRequireDefault(_extend2);

var _isNil2 = require('lodash/isNil');

var _isNil3 = _interopRequireDefault(_isNil2);

var _isEqual2 = require('lodash/isEqual');

var _isEqual3 = _interopRequireDefault(_isEqual2);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDom = require('react-dom');

var _reactDom2 = _interopRequireDefault(_reactDom);

var _d = require('d3');

var _d2 = _interopRequireDefault(_d);

var _dc = require('dc/dc');

var _dc2 = _interopRequireDefault(_dc);

var _d3Tip = require('d3-tip');

var _d3Tip2 = _interopRequireDefault(_d3Tip);

var _server = require('react-dom/server');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Use dc/dc.js instead of dc/index.js for crossfilter2 compatibility
var BarChart = function (_React$Component) {
  (0, _inherits3.default)(BarChart, _React$Component);

  function BarChart() {
    (0, _classCallCheck3.default)(this, BarChart);
    return (0, _possibleConstructorReturn3.default)(this, (BarChart.__proto__ || (0, _getPrototypeOf2.default)(BarChart)).apply(this, arguments));
  }

  (0, _createClass3.default)(BarChart, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      var _props = this.props,
          width = _props.width,
          height = _props.height,
          dimension = _props.dimension,
          group = _props.group,
          xRange = _props.xRange,
          yRange = _props.yRange,
          getChartID = _props.getChartID,
          rangeFilter = _props.rangeFilter,
          rangeChartID = _props.rangeChartID,
          children = _props.children,
          options = _props.options;

      var DOMNode = _reactDom2.default.findDOMNode(this);

      // Create a dc.js barChart
      var chart = _dc2.default.barChart(DOMNode);
      this.chart = this.setChartProperties(chart, width, height, dimension, group, xRange, yRange, rangeFilter, rangeChartID, children, options);
      this.chart.render();

      if (getChartID) {
        getChartID(this.chart.chartID());
      }
    }
  }, {
    key: 'componentDidUpdate',
    value: function componentDidUpdate(prevProps) {
      var _props2 = this.props,
          width = _props2.width,
          height = _props2.height,
          dimension = _props2.dimension,
          group = _props2.group,
          xRange = _props2.xRange,
          yRange = _props2.yRange,
          getChartID = _props2.getChartID,
          rangeFilter = _props2.rangeFilter,
          rangeChartID = _props2.rangeChartID,
          children = _props2.children,
          options = _props2.options;


      if (!(0, _isEqual3.default)(xRange, prevProps.xRange) || !(0, _isEqual3.default)(yRange, prevProps.yRange)) {
        this.chart = this.setChartProperties(this.chart, width, height, dimension, group, xRange, yRange, rangeChartID, rangeFilter, children, options);
        this.chart.rescale();
      } else {
        this.chart.redraw();
      }

      if (!(0, _isEqual3.default)(rangeChartID, prevProps.rangeChartID)) {
        this.chart = this.setChartProperties(this.chart, width, height, dimension, group, xRange, yRange, rangeChartID, rangeFilter, children, options);
        this.chart.render();
      } else {
        this.chart.redraw();
      }

      if (getChartID) {
        getChartID(this.chart.chartID());
        this.chart.redraw();
      }

      if (!(0, _isEqual3.default)(rangeFilter, prevProps.rangeFilter)) {
        this.chart.filter(null); // Clear filters before applying new ones
        if (rangeFilter) {
          this.chart.filter(_dc2.default.filters.TwoDimensionalFilter(rangeFilter));
        } else {
          _dc2.default.redrawAll();
        }
        this.chart.redraw();
      }
    }
  }, {
    key: 'setChartProperties',
    value: function setChartProperties(chart, width, height, dimension, group, xRange, yRange, rangeChartID, rangeFilter, toolTipHtml, options) {
      var margins = options.margins,
          valueAccessor = options.valueAccessor,
          x = options.x,
          y = options.y,
          xUnits = options.xUnits,
          renderVerticalGridLines = options.renderVerticalGridLines,
          transitionDuration = options.transitionDuration,
          yAxisTicks = options.yAxisTicks,
          mouseZoomable = options.mouseZoomable,
          brushOn = options.brushOn;


      var defaultOptions = {
        width: width,
        height: height,
        margins: margins || {
          top: 20,
          right: 20,
          bottom: 30,
          left: 20
        },
        dimension: dimension,
        group: group,
        valueAccessor: valueAccessor || function (d) {
          return d.value.count;
        },
        xUnits: xUnits || _d2.default.time.hours,
        x: x || _d2.default.time.scale().domain(xRange),
        brushOn: brushOn || true,
        elasticY: (0, _isNil3.default)(yRange),
        mouseZoomable: mouseZoomable || false,
        renderVerticalGridLines: renderVerticalGridLines || true,
        transitionDuration: transitionDuration || 500
      };

      chart.options((0, _extend3.default)({}, defaultOptions, options));

      if (!(0, _isNil3.default)(yRange)) {
        chart.y(y || _d2.default.scale.linear().domain(yRange));
      }

      chart.yAxis().ticks(!(0, _isNil3.default)(yAxisTicks) ? yAxisTicks : 4);

      chart.on('renderlet', function (ch) {
        // Create toolTip ----
        // TODO: separate into it's own function passing the offset,
        // className, Html element as parameters.
        if (toolTipHtml) {
          // Remove all previous d3-tip elements
          _d2.default.selectAll('.d3-tip').remove();
          var toolTip = (0, _d3Tip2.default)().attr('class', 'd3-tip').offset([0, 0]).html(function (d) {
            return (0, _server.renderToStaticMarkup)(toolTipHtml({
              data: d.data
            }));
          });

          var bar = ch.selectAll('rect.bar');

          if (!bar.empty()) {
            bar.call(toolTip);

            bar.on('mouseover', function (d) {
              toolTip.show(d, this);
            });

            bar.on('mouseout', function (d) {
              toolTip.hide(d, this);
            });
          }
        }
        // ----

        ch.selectAll('g.x text').attr('transform', 'translate(-25,9) rotate(-20)');
      });

      if (rangeChartID) {
        var rangeChart = (0, _find3.default)(_dc2.default.chartRegistry.list(), function (v) {
          return v.chartID() === rangeChartID;
        });
        chart.rangeChart(rangeChart);
      }

      return chart;
    }
  }, {
    key: 'render',
    value: function render() {
      var name = this.props.name;

      return _react2.default.createElement('div', { id: name });
    }
  }]);
  return BarChart;
}(_react2.default.Component);

BarChart.propTypes = {
  name: _react.PropTypes.string.isRequired,
  width: _react.PropTypes.number,
  height: _react.PropTypes.number,
  dimension: _react.PropTypes.object.isRequired,
  group: _react.PropTypes.object.isRequired,
  xRange: _react.PropTypes.array.isRequired,
  yRange: _react.PropTypes.array,
  rangeChartID: _react.PropTypes.number,
  getChartID: _react.PropTypes.func,
  rangeFilter: _react.PropTypes.array,
  children: _react.PropTypes.func,
  options: _react.PropTypes.object
};

BarChart.defaultProps = {
  width: 600,
  height: 200,
  yRange: null,
  rangeChartID: null,
  children: null,
  rangeFilter: null,
  options: {
    margins: {
      top: 10,
      right: 20,
      bottom: 30,
      left: 20
    },
    keyAccessor: function keyAccessor(d) {
      return d.key;
    },
    valueAccessor: function valueAccessor(d) {
      return d.value.count;
    },
    xUnits: _d2.default.time.hours,
    brushOn: true,
    gap: 5,
    centerBar: true,
    mouseZoomable: false,
    renderTitle: false,
    renderHorizontalGridLines: true,
    renderVerticalGridLines: true,
    transitionDuration: 500,
    yAxisTicks: 4
  }
};

exports.default = BarChart;