"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf3 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _assertThisInitialized2 = _interopRequireDefault(require("@babel/runtime/helpers/assertThisInitialized"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _react = _interopRequireWildcard(require("react"));

var _ListView = _interopRequireDefault(require("./ListView.scss"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var LazyloadView =
/*#__PURE__*/
function (_PureComponent) {
  (0, _inherits2.default)(LazyloadView, _PureComponent);

  function LazyloadView() {
    var _getPrototypeOf2;

    var _this;

    (0, _classCallCheck2.default)(this, LazyloadView);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = (0, _possibleConstructorReturn2.default)(this, (_getPrototypeOf2 = (0, _getPrototypeOf3.default)(LazyloadView)).call.apply(_getPrototypeOf2, [this].concat(args)));
    _this.state = {
      isVisible: false
    };

    _this._onScroll = function () {
      var _assertThisInitialize = (0, _assertThisInitialized2.default)(_this),
          offsetTop = _assertThisInitialize.offsetTop,
          scroller = _assertThisInitialize.scroller,
          screenHeight = _assertThisInitialize.screenHeight,
          itemClientHeight = _assertThisInitialize.itemClientHeight;

      var scroll_y = Math.abs(scroller.y);
      var scroll_min_y = offsetTop + itemClientHeight - scroll_y; // 距离顶部的距离

      var scroll_max_y = offsetTop - scroll_y; //距离底部的距离

      if (scroll_min_y >= 0 && scroll_max_y <= screenHeight) {
        //item显示后销毁滚动监听
        scroller.off('scroll', _this._onScroll);

        _this.setState({
          isVisible: true
        });
      }
    };

    _this.getLazyloadItem = function (view) {
      _this.lazyloadItem = view;
    };

    return _this;
  }

  (0, _createClass2.default)(LazyloadView, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      var _this2 = this;

      var _this$lazyloadItem = this.lazyloadItem,
          clientHeight = _this$lazyloadItem.clientHeight,
          offsetTop = _this$lazyloadItem.offsetTop,
          parentElement = _this$lazyloadItem.parentElement;
      this.screenHeight = window.innerHeight; // 内容显示高度

      this.offsetTop = offsetTop || parentElement.offsetTop;
      this.itemClientHeight = clientHeight;
      setTimeout(function () {
        var scroller = _this2.props.getScroller();

        scroller.on('scroll', _this2._onScroll);
        _this2.scroller = scroller;

        _this2._onScroll();
      }, 100);
    }
  }, {
    key: "componentWillUnmount",
    value: function componentWillUnmount() {
      //销毁滚动监听
      var scroller = this.scroller;
      scroller && scroller.off('scroll', this._onScroll);
    }
  }, {
    key: "render",
    value: function render() {
      var _this$props = this.props,
          children = _this$props.children,
          height = _this$props.height,
          itemClassName = _this$props.itemClassName,
          style = _this$props.style,
          placeholder = _this$props.placeholder;
      var isVisible = this.state.isVisible;
      var itemStyle = style || {};

      if (height && height !== '0px') {
        itemStyle.height = height;
      }

      return _react.default.createElement("div", {
        ref: this.getLazyloadItem,
        className: itemClassName,
        style: itemStyle
      }, isVisible ? children : placeholder ? placeholder : _react.default.createElement("div", {
        className: _ListView.default.placeholder
      }));
    }
  }]);
  return LazyloadView;
}(_react.PureComponent);

exports.default = LazyloadView;
LazyloadView.propTypes = {
  height: _propTypes.default.string,
  getScroller: _propTypes.default.func,
  placeholder: _propTypes.default.any,
  itemClassName: _propTypes.default.string
};
LazyloadView.defaultProps = {
  height: '0px'
};