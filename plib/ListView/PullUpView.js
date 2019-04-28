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

(function () {
  var enterModule = (typeof reactHotLoaderGlobal !== 'undefined' ? reactHotLoaderGlobal : require('react-hot-loader')).enterModule;
  enterModule && enterModule(module);
})();

var PullUp =
/*#__PURE__*/
function (_PureComponent) {
  (0, _inherits2.default)(PullUp, _PureComponent);

  function PullUp() {
    var _getPrototypeOf2;

    var _this;

    (0, _classCallCheck2.default)(this, PullUp);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = (0, _possibleConstructorReturn2.default)(this, (_getPrototypeOf2 = (0, _getPrototypeOf3.default)(PullUp)).call.apply(_getPrototypeOf2, [this].concat(args)));
    _this.state = {
      pullstate: _this.props.pullUpLoading ? 0 : 1
    };

    _this.getHeight = function () {
      return _this.pullUp.offsetHeight;
    };

    _this.changState = function (state) {
      var pullstate = _this.state.pullstate;

      if ((state === 0 || state === 1) && pullstate != state) {
        _this.setState({
          pullstate: state
        });
      }
    };

    _this.getPullUp = function (view) {
      _this.pullUp = view;
    };

    return _this;
  }

  (0, _createClass2.default)(PullUp, [{
    key: "render",
    value: function render() {
      var _this$props = this.props,
          pullUpTexts = _this$props.pullUpTexts,
          loadMore = _this$props.loadMore;
      var pullstate = loadMore ? this.state.pullstate : 1;
      var value = pullUpTexts[pullstate];
      return _react.default.createElement("div", {
        ref: this.getPullUp,
        className: _ListView.default.pullUp
      }, pullstate === 0 ? _react.default.createElement("img", {
        className: _ListView.default.lodingimg,
        src: _loading.default
      }) : null, _react.default.createElement("span", null, value));
    }
  }, {
    key: "__reactstandin__regenerateByEval",
    // @ts-ignore
    value: function __reactstandin__regenerateByEval(key, code) {
      // @ts-ignore
      this[key] = eval(code);
    }
  }]);
  return PullUp;
}(_react.PureComponent);

exports.default = PullUp;
;

(function () {
  var reactHotLoader = (typeof reactHotLoaderGlobal !== 'undefined' ? reactHotLoaderGlobal : require('react-hot-loader')).default;

  if (!reactHotLoader) {
    return;
  }

  reactHotLoader.register(PullUp, "PullUp", "/Users/sujialong/Documents/myPlugins_NPM/react-s-listview/lib/ListView/PullUpView.js");
})();

;

(function () {
  var leaveModule = (typeof reactHotLoaderGlobal !== 'undefined' ? reactHotLoaderGlobal : require('react-hot-loader')).leaveModule;
  leaveModule && leaveModule(module);
})();