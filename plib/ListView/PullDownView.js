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

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _react = _interopRequireWildcard(require("react"));

var _ListView = _interopRequireDefault(require("./ListView.scss"));

var _loading = _interopRequireDefault(require("./images/loading.gif"));

var _arrows = _interopRequireDefault(require("./images/arrows.jpeg"));

var PullDown =
/*#__PURE__*/
function (_PureComponent) {
  (0, _inherits2.default)(PullDown, _PureComponent);

  function PullDown() {
    var _getPrototypeOf2;

    var _this;

    (0, _classCallCheck2.default)(this, PullDown);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = (0, _possibleConstructorReturn2.default)(this, (_getPrototypeOf2 = (0, _getPrototypeOf3.default)(PullDown)).call.apply(_getPrototypeOf2, [this].concat(args)));
    _this.state = {
      pullstate: 0
    };

    _this.getHeight = function () {
      return _this.pullDown.offsetHeight;
    };

    _this.changState = function (state) {
      var pullstate = _this.state.pullstate;

      if (pullstate != state) {
        _this.setState({
          pullstate: state
        });
      }
    };

    _this.getPullDown = function (view) {
      _this.pullDown = view;
    };

    return _this;
  }

  (0, _createClass2.default)(PullDown, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      var height = this.getHeight();
      this.pullDown.style.cssText = 'margin-top:' + -height + 'px;';
    }
  }, {
    key: "render",
    value: function render() {
      var pullDownTexts = this.props.pullDownTexts;
      var pullstate = this.state.pullstate;
      var value = pullDownTexts[pullstate];
      var cls = "".concat(_ListView.default.pullDown);
      var loadImg = _arrows.default;
      var loadImgCls = _ListView.default.arrowsimg;

      if (pullstate == 1) {
        loadImgCls = "".concat(_ListView.default.arrowsimg, " ").concat(_ListView.default.arrowsimg_active);
      } else if (pullstate == 2) {
        loadImg = _loading.default;
        loadImgCls = _ListView.default.lodingimg;
      }

      return _react.default.createElement("div", {
        ref: this.getPullDown,
        className: cls
      }, pullstate != 3 ? _react.default.createElement("img", {
        className: loadImgCls,
        src: loadImg
      }) : null, _react.default.createElement("span", null, value));
    }
  }]);
  return PullDown;
}(_react.PureComponent);

exports.default = PullDown;