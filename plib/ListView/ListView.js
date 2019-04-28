"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.LazyloadView = exports.default = void 0;

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _react = _interopRequireWildcard(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _iscrollProbe = _interopRequireDefault(require("./lib/iscroll-probe"));

var _ListView = _interopRequireDefault(require("./ListView.scss"));

var _PullUpView = _interopRequireDefault(require("./PullUpView"));

var _PullDownView = _interopRequireDefault(require("./PullDownView"));

var _LazyloadView = _interopRequireDefault(require("./LazyloadView"));

(function () {
  var enterModule = (typeof reactHotLoaderGlobal !== 'undefined' ? reactHotLoaderGlobal : require('react-hot-loader')).enterModule;
  enterModule && enterModule(module);
})();

var ListView =
/*#__PURE__*/
function (_Component) {
  (0, _inherits2.default)(ListView, _Component);

  function ListView(props) {
    var _this;

    (0, _classCallCheck2.default)(this, ListView);
    _this = (0, _possibleConstructorReturn2.default)(this, (0, _getPrototypeOf2.default)(ListView).call(this, props));

    _this.handlerTouchmove = function (e) {
      e.preventDefault();
    };

    _this._bindScrollEvent = function () {
      var list = _this.list;
      list.on('scrollStart', _this._onScrollStart);
      list.on('scroll', _this._onScroll); // list.on("scrollEnd",this._onScrollEnd);
    };

    _this.refresh = function () {
      _this.list.refresh();
    };

    _this.getScroller = function () {
      return _this.list;
    };

    _this.onTouchStart = function () {
      var onTouchStart = _this.props.onTouchStart;
      _this.isTouching = true;
      _this.list.isTouching = true;
      onTouchStart && onTouchStart();
    };

    _this.onTouchEnd = function () {
      var _this$props = _this.props,
          isRefreshPullDown = _this$props.isRefreshPullDown,
          onTouchEnd = _this$props.onTouchEnd;
      onTouchEnd && onTouchEnd();
      if (!isRefreshPullDown) return;
      var pullDown = _this.pullDown,
          pullDown_height = pullDown.getHeight(),
          y = _this.list.y;
      _this.isTouching = false;
      _this.list.isTouching = false;
      _this.pullDownRester = y !== 0 && y > -pullDown_height && y < pullDown_height;
      !_this.isPullDownRefrshing && _this._pullDownRefrshing();
    };

    _this._onScrollStart = function () {
      var _this$list = _this.list,
          scrollerHeight = _this$list.scrollerHeight,
          scroller = _this$list.scroller;
      var clientHeight = scroller.clientHeight; //解决高度变化无法滑动到底部的问题

      if (!(clientHeight === scrollerHeight)) {
        _this.refresh();
      }
    };

    _this._onScroll = function () {
      var list = _this.list,
          _this$props2 = _this.props,
          isRefreshPullDown = _this$props2.isRefreshPullDown,
          isRefreshPullUp = _this$props2.isRefreshPullUp;

      if (list) {
        var y = list.y;
        isRefreshPullDown && _this._pullDownRefrsh(y, list);
        isRefreshPullUp && _this._pullUpRefrsh(y, list);
      }
    };

    _this.setPullDownRefrshEnd = function () {
      var pullDown = _this.pullDown; // pullDown.changState(3);

      setTimeout(function () {
        var list = _this.list; // const pullDown_height = pullDown.getHeight();

        pullDown.changState(0);
        _this.isPullDownRefrsh = false; // list.scrollTo(0,-(pullDown_height+3),250);

        list.isTouching = false;
        list.scrollTo(0, 0, 250);
      }, 580);
    };

    _this.setLoadmore = function (type) {
      _this.isLoadMore = type;
      var state = 0;

      if (!type) {
        state = 1;
      } else {
        state = 0;
      }

      _this.setPullUpRefrshEnd(state);
    };

    _this.setPullUpRefrshEnd = function (state) {
      var pullUp = _this.pullUp;
      _this.isPullUpRefrsh = false;
      pullUp && pullUp.changState(state);
    };

    _this.getPullUp = function (view) {
      _this.pullUp = view;
    };

    _this.getPullDown = function (view) {
      _this.pullDown = view;
    };

    _this.getScrollView = function (view) {
      _this.scroller = view;
    };

    var randomId = _this.rand();

    _this.state = {
      wrapperId: 'wrapper_' + randomId,
      scrollerId: 'scroll_' + randomId
    };
    return _this;
  }
  /**
   * 获取scroller随机id
   * @returns {string}
   */


  (0, _createClass2.default)(ListView, [{
    key: "rand",
    value: function rand() {
      var pre = 0;
      var inc = 2;
      pre += inc;
      var randNum = pre + Math.random() * inc;
      randNum = randNum.toString();
      var length = randNum.length;
      var randNums = randNum.substring(length - 3, length);
      var time = new Date().getTime();
      time = time.toString();
      var timeLen = time.length;
      time = time.substring(timeLen - 3, timeLen);
      randNums += time;
      return randNums;
    }
  }, {
    key: "componentDidMount",
    value: function componentDidMount() {
      var _this$props3 = this.props,
          horizontal = _this$props3.horizontal,
          loadMore = _this$props3.loadMore,
          startY = _this$props3.startY,
          startX = _this$props3.startX;
      var _this$state = this.state,
          wrapperId = _this$state.wrapperId,
          scrollerId = _this$state.scrollerId;
      this.isLoadMore = loadMore;
      var pullDown_height = this.pullDown ? parseFloat(this.pullDown.getHeight()) : 0;

      var _this$deviceOs = this.deviceOs(),
          isPc = _this$deviceOs.isPc;

      var options = {
        //是否显示滚动条
        scrollbars: false,
        // 支持鼠标事件
        mouseWheel: false,
        // 拖拽超过上下界后出现弹射动画效果，用于实现下拉/上拉刷新
        bounce: true,
        //水平滚动
        scrollX: horizontal,
        //垂直滚动
        scrollY: !horizontal,
        // 默认iscroll会拦截元素的默认事件处理函数，我们需要响应onClick，因此要配置
        preventDefault: isPc,
        //true or false
        // 禁止缩放
        zoom: false,
        //滑动探针灵敏度-1,2,3
        probeType: 3,
        startY: startY,
        startX: startX,
        // useTransition:false,
        // useTransform:false,
        //arno.su create
        minScrollY: pullDown_height,
        minScrollX: 0
      }; //设置横向滚动宽度

      var scroller = document.getElementById(scrollerId),
          scrollWidth = scroller.scrollWidth,
          scrollHeight = scroller.scrollHeight;
      this.oldScrollHeight = scrollHeight;
      this.scroller = scroller;

      if (this.props.horizontal) {
        scroller.style.cssText = "width:".concat(scrollWidth, "px");
      } //实例化iscroll


      this.list = new _iscrollProbe.default("#".concat(wrapperId), options); // 修复iscroll在新版chrome和其他新版浏览器(Android 7.0)无法滚动bug

      document.addEventListener('touchmove', this.handlerTouchmove, this.isPassive() ? {
        capture: false,
        passive: false
      } : false);

      this._bindScrollEvent();
    }
  }, {
    key: "componentWillUnmount",
    value: function componentWillUnmount() {
      if (this.list) {
        this.list.destroy();
        this.list = null;
      }

      this.timer && clearTimeout(this.timer);
      document.removeEventListener('touchmove', this.handlerTouchmove);
    }
  }, {
    key: "shouldComponentUpdate",
    value: function shouldComponentUpdate(nextProps) {
      // 列表发生了变化, 那么应该在componentDidUpdate时调用iscroll进行refresh
      this.itemsChanged = nextProps.dataSource.length !== this.props.dataSource.length;
      return true;
    }
  }, {
    key: "componentDidUpdate",
    value: function componentDidUpdate() {
      var _this2 = this;

      // 仅当列表高度发生了变更，才调用iscroll的refresh重新计算滚动条信息
      if (this.oldScrollHeight != this.scroller.scrollHeight) {
        this.itemsChanged = false; //item未指定高度,如图片加载,需等图片加载完成再进行刷新

        this.timer && clearTimeout(this.timer);
        this.timer = setTimeout(function () {
          _this2.list.refresh();
        }, 250);
        this.oldScrollHeight = this.scroller.scrollHeight;
      }

      if (!this.isPullUpRefrsh) {
        this.setLoadmore(this.props.loadMore);
      }
    }
  }, {
    key: "deviceOs",
    value: function deviceOs() {
      var ua = navigator.userAgent,
          isWindowsPhone = /(?:Windows Phone)/.test(ua),
          isSymbian = /(?:SymbianOS)/.test(ua) || isWindowsPhone,
          isAndroid = /(?:Android)/.test(ua),
          isFireFox = /(?:Firefox)/.test(ua),
          // isChrome = /(?:Chrome|CriOS)/.test(ua),
      isTablet = /(?:iPad|PlayBook)/.test(ua) || isAndroid && !/(?:Mobile)/.test(ua) || isFireFox && /(?:Tablet)/.test(ua),
          isPhone = /(?:iPhone)/.test(ua) && !isTablet,
          isPc = !isPhone && !isAndroid && !isSymbian && !isTablet && !isWindowsPhone;
      return {
        isTablet: isTablet,
        isPhone: isPhone,
        isAndroid: isAndroid,
        isPc: isPc
      };
    }
  }, {
    key: "isPassive",
    value: function isPassive() {
      var supportsPassiveOption = false;

      try {
        addEventListener('test', null, Object.defineProperty({}, 'passive', {
          get: function get() {
            supportsPassiveOption = true;
          }
        }));
      } catch (e) {}

      return supportsPassiveOption;
    }
  }, {
    key: "_pullDownRefrsh",

    /**
        * 下拉刷新
        * @param y
        * @param list
        * @private
        */
    value: function _pullDownRefrsh(y, list) {
      var pullDown = this.pullDown,
          pullDown_height = pullDown.getHeight(),
          isPullDownRefrsh = this.isPullDownRefrsh; // 解决当内容太少时，drag 或 scroll 不起作用，我们通过重新设置 hasVerticalScroll 为 true 来激活拖拽或滚动

      if (y === -pullDown_height) {
        list.hasVerticalScroll = true;
      }

      if (y >= pullDown_height && !isPullDownRefrsh && this.isTouching) {
        pullDown.changState(1);
        this.isPullDownRefrsh = true;
      }
    }
  }, {
    key: "_pullDownRefrshing",
    value: function _pullDownRefrshing() {
      var _this3 = this;

      var list = this.list;

      if (this.isPullDownRefrsh && !this.isTouching) {
        var pullDown = this.pullDown;
        this.isPullDownRefrshing = true;
        list.isTouching = true; // list.scrollTo(0,this.pullDown.getHeight(),250);

        pullDown.changState(2);
        var onPullDownRefrsh = this.props.onPullDownRefrsh;
        new Promise(function (resolve, reject) {
          onPullDownRefrsh && onPullDownRefrsh(resolve, reject);
        }).then(function () {
          _this3.setPullDownRefrshEnd();

          _this3.isPullDownRefrsh = false;
          _this3.isPullDownRefrshing = false;
          list.enable();
        }).catch(function (error) {
          _this3.setPullDownRefrshEnd();

          _this3.isPullDownRefrsh = false;
          _this3.isPullDownRefrshing = false;
          list.enable();
          console.error('error:', error);
        });
      }
    }
  }, {
    key: "_pullUpRefrsh",
    value: function _pullUpRefrsh(y, list) {
      var _this4 = this;

      if (!this.isLoadMore) return;
      var maxScrollY = list.maxScrollY;

      if (y <= maxScrollY && !this.isPullUpRefrsh) {
        var onPullUpRefrsh = this.props.onPullUpRefrsh;
        this.isPullUpRefrsh = true;
        new Promise(function (resolve, reject) {
          onPullUpRefrsh && onPullUpRefrsh(function () {
            setTimeout(function () {
              resolve();
            }, 250);
          }, reject);
        }).then(function (state) {
          _this4.setPullUpRefrshEnd(state);
        }).catch(function (error) {
          _this4.setPullUpRefrshEnd(error);

          console.error('error:', error);
        });
      }
    }
  }, {
    key: "renderRowItem",
    value: function renderRowItem() {
      var _this5 = this;

      var _this$props4 = this.props,
          dataSource = _this$props4.dataSource,
          renderRow = _this$props4.renderRow,
          isLazyload = _this$props4.isLazyload,
          itemHeight = _this$props4.itemHeight,
          itemClassName = _this$props4.itemClassName,
          placeholder = _this$props4.placeholder;
      return dataSource.map(function (item, i) {
        var props = {
          data: item,
          index: i
        };
        return isLazyload ? _react.default.createElement(_LazyloadView.default, {
          key: "lazyload-".concat(i),
          height: itemHeight,
          itemClassName: itemClassName,
          placeholder: placeholder,
          getScroller: _this5.getScroller
        }, renderRow(props)) : renderRow(props);
      });
    }
  }, {
    key: "render",
    value: function render() {
      var _this$props5 = this.props,
          style = _this$props5.style,
          _this$props5$classNam = _this$props5.className,
          className = _this$props5$classNam === void 0 ? '' : _this$props5$classNam,
          pullDownTexts = _this$props5.pullDownTexts,
          pullUpTexts = _this$props5.pullUpTexts,
          pullDown = _this$props5.pullDown,
          pullUp = _this$props5.pullUp,
          pullUpLoading = _this$props5.pullUpLoading,
          loadMore = _this$props5.loadMore,
          isRefreshPullDown = _this$props5.isRefreshPullDown,
          isRefreshPullUp = _this$props5.isRefreshPullUp,
          renderHeader = _this$props5.renderHeader,
          renderFooter = _this$props5.renderFooter,
          contentContainerCls = _this$props5.contentContainerCls,
          _this$state2 = this.state,
          wrapperId = _this$state2.wrapperId,
          scrollerId = _this$state2.scrollerId;
      return _react.default.createElement("div", {
        id: wrapperId,
        className: "".concat(className, " ").concat(_ListView.default.wrapper),
        style: style,
        onMouseDown: this.onTouchStart,
        onMouseUp: this.onTouchEnd,
        onTouchStart: this.onTouchStart,
        onTouchEnd: this.onTouchEnd
      }, _react.default.createElement("div", {
        id: scrollerId,
        className: _ListView.default.scroller,
        ref: this.getScrollView
      }, isRefreshPullDown && _react.default.createElement(_PullDownView.default, {
        ref: this.getPullDown,
        pullDown: pullDown,
        pullDownTexts: pullDownTexts
      }), renderHeader && renderHeader(), _react.default.createElement("div", {
        className: "".concat(contentContainerCls)
      }, this.renderRowItem()), renderFooter && renderFooter(), isRefreshPullUp && _react.default.createElement(_PullUpView.default, {
        ref: this.getPullUp,
        loadMore: loadMore,
        pullUp: pullUp,
        pullUpLoading: pullUpLoading,
        pullUpTexts: pullUpTexts
      })));
    }
  }, {
    key: "__reactstandin__regenerateByEval",
    // @ts-ignore
    value: function __reactstandin__regenerateByEval(key, code) {
      // @ts-ignore
      this[key] = eval(code);
    }
  }]);
  return ListView;
}(_react.Component);

exports.default = ListView;
ListView.propTypes = {
  dataSource: _propTypes.default.array,
  //列表数据源
  renderRow: _propTypes.default.any,
  //列表item布局样式 尽量使用内边距(padding)调整间距
  renderHeader: _propTypes.default.func,
  // 列表头部布局
  renderFooter: _propTypes.default.func,
  // 列表尾部布局
  isRefreshPullDown: _propTypes.default.bool,
  //是否启用下拉刷新
  isRefreshPullUp: _propTypes.default.bool,
  //是否启用上拉加载
  onPullDownRefrsh: _propTypes.default.func,
  //下拉刷新回调事件
  onPullUpRefrsh: _propTypes.default.func,
  //上拉加载回调事件
  pullDownTexts: _propTypes.default.array,
  //下拉刷新提示文字
  pullUpTexts: _propTypes.default.array,
  //下拉刷新提示文字
  pullDown: _propTypes.default.object,
  //下拉刷新布局
  pullUp: _propTypes.default.object,
  //上拉加载布局
  pullUpLoading: _propTypes.default.bool,
  //是否显示上拉加载样式
  loadMore: _propTypes.default.bool,
  //是否上拉加载
  horizontal: _propTypes.default.bool,
  startY: _propTypes.default.number,
  startX: _propTypes.default.number,
  isLazyload: _propTypes.default.bool,
  //懒加载
  itemClassName: _propTypes.default.string,
  //item class
  itemHeight: _propTypes.default.string,
  //懒加载item的高度
  placeholder: _propTypes.default.any,
  //懒加载未加载时显示的占位布局
  contentContainerCls: _propTypes.default.string,
  //item容器样式
  className: _propTypes.default.string //容器样式

};
ListView.defaultProps = {
  dataSource: [],
  isRefreshPullDown: true,
  isRefreshPullUp: true,
  pullDownTexts: ['下拉刷新', '释放刷新', '加载中', '刷新成功'],
  pullUpTexts: ['正在加载...', '没有更多数据了...'],
  pullUpLoading: true,
  loadMore: true,
  horizontal: false,
  startY: 0,
  startX: 0,
  isLazyload: false,
  itemHeight: '0px',
  contentContainerCls: '',
  className: '',
  renderHeader: function renderHeader() {
    return null;
  },
  renderFooter: function renderFooter() {
    return null;
  }
};
var LazyloadView = _LazyloadView.default;
exports.LazyloadView = LazyloadView;
;

(function () {
  var reactHotLoader = (typeof reactHotLoaderGlobal !== 'undefined' ? reactHotLoaderGlobal : require('react-hot-loader')).default;

  if (!reactHotLoader) {
    return;
  }

  reactHotLoader.register(ListView, "ListView", "/Users/sujialong/Documents/myPlugins_NPM/react-s-listview/lib/ListView/ListView.js");
  reactHotLoader.register(LazyloadView, "LazyloadView", "/Users/sujialong/Documents/myPlugins_NPM/react-s-listview/lib/ListView/ListView.js");
})();

;

(function () {
  var leaveModule = (typeof reactHotLoaderGlobal !== 'undefined' ? reactHotLoaderGlobal : require('react-hot-loader')).leaveModule;
  leaveModule && leaveModule(module);
})();