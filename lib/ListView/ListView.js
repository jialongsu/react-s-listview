'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.LazyloadView = exports.default = undefined;

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

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

var _class, _temp, _class4, _temp3; /**
                                     * Created by sujialong on 2017/5/25.
                                     */


var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _iscrollProbe = require('../iscroll/iscroll-probe');

var _iscrollProbe2 = _interopRequireDefault(_iscrollProbe);

var _ListView = require('./ListView.scss');

var _ListView2 = _interopRequireDefault(_ListView);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var loading = require('./images/loading.gif');
var arrows = require('./images/arrows.jpeg');

var ListView = (_temp = _class = function (_PureComponent) {
	(0, _inherits3.default)(ListView, _PureComponent);

	function ListView(props) {
		(0, _classCallCheck3.default)(this, ListView);

		var _this = (0, _possibleConstructorReturn3.default)(this, (ListView.__proto__ || (0, _getPrototypeOf2.default)(ListView)).call(this, props));

		_this._bindScrollEvent = function () {
			var myScroll = _this.myList;
			// myScroll.on("scrollStart",this._onScrollStart);
			myScroll.on("scroll", _this._onScroll);
			// myScroll.on("scrollEnd",this._onScrollEnd);
		};

		_this.getScroller = function () {
			return _this.myList;
		};

		_this.onTouchStart = function () {
			_this.isTouching = true;
			_this.myList.isTouching = true;
		};

		_this.onTouchEnd = function () {
			var _this$props = _this.props,
			    isRefreshPullDown = _this$props.isRefreshPullDown,
			    isRefreshPullUp = _this$props.isRefreshPullUp;

			if (!isRefreshPullDown) return;
			var pullDown = _this.pullDown,
			    pullDown_height = pullDown.getHeight(),
			    y = _this.myList.y;
			_this.isTouching = false;
			_this.myList.isTouching = false;
			_this.pullDownRester = y !== 0 && y > -pullDown_height && y < pullDown_height;
			!_this.isPullDownRefrshing && _this._pullDownRefrshing();
			// this._resterListPosition();
		};

		_this._onScroll = function () {
			var list = _this.myList,
			    _this$props2 = _this.props,
			    isRefreshPullDown = _this$props2.isRefreshPullDown,
			    isRefreshPullUp = _this$props2.isRefreshPullUp;

			if (list) {
				var y = list.y;

				isRefreshPullDown && _this._pullDownRefrsh(y, list);
				isRefreshPullUp && _this._pullUpRefrsh(y, list);
			}
		};

		_this._resterListPosition = function () {
			// if(this.pullDownRester && !this.isPullDownRefrsh){
			//     const pullDown_height = this.pullDown.getHeight();
			//     const list = this.myList;
			//     // list.scrollTo(0,0,250);
			//     if(list.y === -pullDown_height)this.pullDownRester = false;
			// }
		};

		_this.setPullDownRefrshEnd = function () {
			var pullDown = _this.pullDown;
			// pullDown.changState(3);
			setTimeout(function () {
				var list = _this.myList;
				var pullDown_height = pullDown.getHeight();
				pullDown.changState(0);
				_this.isPullDownRefrsh = false;
				// list.scrollTo(0,-(pullDown_height+3),250);
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


	(0, _createClass3.default)(ListView, [{
		key: 'rand',
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
		key: 'componentDidMount',
		value: function componentDidMount() {
			var _props = this.props,
			    horizontal = _props.horizontal,
			    loadMore = _props.loadMore,
			    startY = _props.startY,
			    startX = _props.startX;
			var _state = this.state,
			    wrapperId = _state.wrapperId,
			    scrollerId = _state.scrollerId;

			this.pullDown = this.refs["pullDown"];
			this.pullUp = this.refs["pullUp"];
			this.scroller = this.refs["scroller"];
			this.isLoadMore = loadMore;
			var pullDown_height = this.pullDown ? parseFloat(this.pullDown.getHeight()) : 0;

			var _deviceOs = this.deviceOs(),
			    isPc = _deviceOs.isPc;

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
				preventDefault: isPc, //true or false
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
			};

			//设置横向滚动宽度
			var scroller = document.getElementById(scrollerId),
			    scrollWidth = scroller.scrollWidth,
			    scrollHeight = scroller.scrollHeight;
			this.oldScrollHeight = scrollHeight;
			this.scroller = scroller;
			if (this.props.horizontal) {
				scroller.style.cssText = 'width:' + scrollWidth + 'px';
			}
			//实例化iscroll
			this.myList = new _iscrollProbe2.default('#' + wrapperId, options);
			// 修复iscroll在新版chrome和其他新版浏览器(Android 7.0)无法滚动bug
			document.addEventListener('touchmove', function (e) {
				e.preventDefault();
			}, this.isPassive() ? {
				capture: false,
				passive: false
			} : false);
			this._bindScrollEvent();
		}
	}, {
		key: 'componentWillUnmount',
		value: function componentWillUnmount() {
			if (this.myList) {
				this.myList.destroy();
				this.myList = null;
			}
			this.timer && clearTimeout(this.timer);
		}
	}, {
		key: 'shouldComponentUpdate',
		value: function shouldComponentUpdate(nextProps, nextState) {
			// 列表发生了变化, 那么应该在componentDidUpdate时调用iscroll进行refresh
			this.itemsChanged = nextProps.dataSource.length !== this.props.dataSource.length;
			return true;
		}
	}, {
		key: 'componentDidUpdate',
		value: function componentDidUpdate() {
			var _this2 = this;

			// 仅当列表高度发生了变更，才调用iscroll的refresh重新计算滚动条信息
			if (this.oldScrollHeight != this.scroller.scrollHeight) {
				this.itemsChanged = false;
				//item未指定高度,如图片加载,需等图片加载完成再进行刷新
				this.timer = setTimeout(function () {
					_this2.myList.refresh();
				}, 250);
				this.oldScrollHeight = this.scroller.scrollHeight;
			}
			if (!this.isPullUpRefrsh) {
				this.setLoadmore(this.props.loadMore);
			}
		}
	}, {
		key: 'deviceOs',
		value: function deviceOs() {
			var ua = navigator.userAgent,
			    isWindowsPhone = /(?:Windows Phone)/.test(ua),
			    isSymbian = /(?:SymbianOS)/.test(ua) || isWindowsPhone,
			    isAndroid = /(?:Android)/.test(ua),
			    isFireFox = /(?:Firefox)/.test(ua),
			    isChrome = /(?:Chrome|CriOS)/.test(ua),
			    isTablet = /(?:iPad|PlayBook)/.test(ua) || isAndroid && !/(?:Mobile)/.test(ua) || isFireFox && /(?:Tablet)/.test(ua),
			    isPhone = /(?:iPhone)/.test(ua) && !isTablet,
			    isPc = !isPhone && !isAndroid && !isSymbian;
			return {
				isTablet: isTablet,
				isPhone: isPhone,
				isAndroid: isAndroid,
				isPc: isPc
			};
		}
	}, {
		key: 'isPassive',
		value: function isPassive() {
			var supportsPassiveOption = false;
			try {
				addEventListener("test", null, Object.defineProperty({}, 'passive', {
					get: function get() {
						supportsPassiveOption = true;
					}
				}));
			} catch (e) {}
			return supportsPassiveOption;
		}

		// _onScrollStart = () => {
		// }

	}, {
		key: '_pullDownRefrsh',


		// _onScrollEnd = () => {
		//
		// }

		/**
   * 下拉刷新
   * @param y
   * @param list
   * @private
   */
		value: function _pullDownRefrsh(y, list) {
			var pullDown = this.pullDown,
			    pullDown_height = pullDown.getHeight(),
			    isPullDownRefrsh = this.isPullDownRefrsh;

			// 解决当内容太少时，drag 或 scroll 不起作用，我们通过重新设置 hasVerticalScroll 为 true 来激活拖拽或滚动
			if (y === -pullDown_height) {
				list.hasVerticalScroll = true;
			}
			if (y >= pullDown_height && !isPullDownRefrsh && this.isTouching) {
				pullDown.changState(1);
				this.isPullDownRefrsh = true;
			}
		}
	}, {
		key: '_pullDownRefrshing',
		value: function _pullDownRefrshing() {
			var _this3 = this;

			var list = this.myList;

			if (this.isPullDownRefrsh && !this.isTouching) {
				var pullDown = this.pullDown;
				this.isPullDownRefrshing = true;
				list.isTouching = true;
				// list.scrollTo(0,this.pullDown.getHeight(),250);
				pullDown.changState(2);
				var onPullDownRefrsh = this.props.onPullDownRefrsh;
				var promise = new _promise2.default(function (resolve, reject) {
					onPullDownRefrsh && onPullDownRefrsh(resolve, reject);
				});
				promise.then(function (succeed) {
					_this3.setPullDownRefrshEnd();
					_this3.isPullDownRefrsh = false;
					_this3.isPullDownRefrshing = false;
					list.enable();
				}).catch(function (error) {
					_this3.setPullDownRefrshEnd();
					_this3.isPullDownRefrsh = false;
					_this3.isPullDownRefrshing = false;
					list.enable();
					console.error("error:" + error);
				});
			}
			// else{
			//     this._resterListPosition();
			// }
		}

		/**
   * 重置listview为初始化位置
   * @private
   */


		/**
   * 上拉加载
   * @param y
   * @param list
   * @private
   */

	}, {
		key: '_pullUpRefrsh',
		value: function _pullUpRefrsh(y, list) {
			var _this4 = this;

			if (!this.isLoadMore) return;
			var maxScrollY = list.maxScrollY;

			if (y <= maxScrollY && !this.isPullUpRefrsh) {
				var onPullUpRefrsh = this.props.onPullUpRefrsh;
				this.isPullUpRefrsh = true;
				var promise = new _promise2.default(function (resolve, reject) {
					onPullUpRefrsh && onPullUpRefrsh(function () {
						setTimeout(function () {
							resolve();
						}, 250);
					}, reject);
				});
				promise.then(function (state) {
					_this4.setPullUpRefrshEnd(state);
				}).catch(function (error) {
					_this4.setPullUpRefrshEnd(error);
					console.error("error:" + error);
				});
			}
		}
	}, {
		key: 'renderRowItem',
		value: function renderRowItem() {
			var _this5 = this;

			var _props2 = this.props,
			    dataSource = _props2.dataSource,
			    renderRow = _props2.renderRow,
			    isLazyload = _props2.isLazyload,
			    itemHeight = _props2.itemHeight,
			    itemClassName = _props2.itemClassName,
			    placeholder = _props2.placeholder;

			return dataSource.map(function (item, i) {
				var props = {
					data: item,
					index: i
				};
				return isLazyload ? _react2.default.createElement(
					LazyloadView,
					{
						key: 'lazyload-' + i,
						height: itemHeight,
						itemClassName: itemClassName,
						placeholder: placeholder,
						getScroller: _this5.getScroller },
					renderRow(props)
				) : renderRow(props);
			});
		}
	}, {
		key: 'render',
		value: function render() {
			var _props3 = this.props,
			    style = _props3.style,
			    className = _props3.className,
			    children = _props3.children,
			    pullDownTexts = _props3.pullDownTexts,
			    pullUpTexts = _props3.pullUpTexts,
			    pullDown = _props3.pullDown,
			    pullUp = _props3.pullUp,
			    pullUpLoading = _props3.pullUpLoading,
			    loadMore = _props3.loadMore,
			    isRefreshPullDown = _props3.isRefreshPullDown,
			    isRefreshPullUp = _props3.isRefreshPullUp,
			    _state2 = this.state,
			    wrapperId = _state2.wrapperId,
			    scrollerId = _state2.scrollerId;


			return _react2.default.createElement(
				'div',
				{ id: wrapperId,
					className: className + ' ' + _ListView2.default.wrapper,
					style: style,
					onMouseDown: this.onTouchStart,
					onMouseUp: this.onTouchEnd,
					onTouchStart: this.onTouchStart,
					onTouchEnd: this.onTouchEnd },
				_react2.default.createElement(
					'div',
					{ id: scrollerId,
						className: _ListView2.default.scroller,
						ref: "scroller" },
					isRefreshPullDown && _react2.default.createElement(PullDown, {
						ref: "pullDown",
						pullDown: pullDown,
						pullDownTexts: pullDownTexts }),
					this.renderRowItem(),
					isRefreshPullUp && _react2.default.createElement(PullUp, {
						ref: "pullUp",
						loadMore: loadMore,
						pullUp: pullUp,
						pullUpLoading: pullUpLoading,
						pullUpTexts: pullUpTexts })
				)
			);
		}
	}]);
	return ListView;
}(_react.PureComponent), _class.propTypes = {
	dataSource: _propTypes2.default.array, //列表数据源
	renderRow: _propTypes2.default.any, //列表item布局样式 尽量使用内边距(padding)调整间距
	isRefreshPullDown: _propTypes2.default.bool, //是否启用下拉刷新
	isRefreshPullUp: _propTypes2.default.bool, //是否启用上拉加载
	onPullDownRefrsh: _propTypes2.default.func, //下拉刷新回调事件
	onPullUpRefrsh: _propTypes2.default.func, //上拉加载回调事件
	pullDownTexts: _propTypes2.default.array, //下拉刷新提示文字
	pullUpTexts: _propTypes2.default.array, //下拉刷新提示文字
	pullDown: _propTypes2.default.object, //下拉刷新布局
	pullUp: _propTypes2.default.object, //上拉加载布局
	pullUpLoading: _propTypes2.default.bool, //是否显示上拉加载样式
	loadMore: _propTypes2.default.bool, //是否上拉加载
	horizontal: _propTypes2.default.bool,
	startY: _propTypes2.default.number,
	startX: _propTypes2.default.number,
	isLazyload: _propTypes2.default.bool, //懒加载
	itemClassName: _propTypes2.default.string, //item class
	itemHeight: _propTypes2.default.string, //懒加载item的高度
	placeholder: _propTypes2.default.any //懒加载未加载时显示的占位布局
}, _class.defaultProps = {
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
	itemHeight: 0
}, _temp);
exports.default = ListView;

var PullDown = function (_PureComponent2) {
	(0, _inherits3.default)(PullDown, _PureComponent2);

	function PullDown(props) {
		(0, _classCallCheck3.default)(this, PullDown);

		var _this6 = (0, _possibleConstructorReturn3.default)(this, (PullDown.__proto__ || (0, _getPrototypeOf2.default)(PullDown)).call(this, props));

		_this6.getHeight = function () {
			return _this6.pullDown.offsetHeight;
		};

		_this6.changState = function (state) {
			var pullstate = _this6.state.pullstate;
			if (pullstate != state) {
				_this6.setState({
					pullstate: state
				});
			}
		};

		_this6.state = {
			pullstate: 0
		};
		return _this6;
	}

	(0, _createClass3.default)(PullDown, [{
		key: 'componentDidMount',
		value: function componentDidMount() {
			this.pullDown = this.refs["pullDown"];
			var height = this.getHeight();
			this.pullDown.style.cssText = "margin-top:" + -height + "px;";
		}
	}, {
		key: 'render',
		value: function render() {
			var _props4 = this.props,
			    pullDownTexts = _props4.pullDownTexts,
			    pullDown = _props4.pullDown;

			var pullstate = this.state.pullstate;
			var value = pullDownTexts[pullstate];
			var cls = '' + _ListView2.default.pullDown;
			var loadImg = arrows;
			var loadImgCls = _ListView2.default.arrowsimg;

			if (pullstate == 1) {
				loadImgCls = _ListView2.default.arrowsimg + ' ' + _ListView2.default.arrowsimg_active;
			} else if (pullstate == 2) {
				loadImg = loading;
				loadImgCls = _ListView2.default.lodingimg;
			}

			return _react2.default.createElement(
				'div',
				{ ref: "pullDown", className: cls },
				pullstate != 3 ? _react2.default.createElement('img', { className: loadImgCls, src: loadImg }) : null,
				_react2.default.createElement(
					'span',
					null,
					value
				)
			);
		}
	}]);
	return PullDown;
}(_react.PureComponent);

var PullUp = function (_PureComponent3) {
	(0, _inherits3.default)(PullUp, _PureComponent3);

	function PullUp(props) {
		(0, _classCallCheck3.default)(this, PullUp);

		var _this7 = (0, _possibleConstructorReturn3.default)(this, (PullUp.__proto__ || (0, _getPrototypeOf2.default)(PullUp)).call(this, props));

		_this7.getHeight = function () {
			return _this7.pullUp.offsetHeight;
		};

		_this7.changState = function (state) {
			var pullstate = _this7.state.pullstate;
			if ((state === 0 || state === 1) && pullstate != state) {
				_this7.setState({
					pullstate: state
				});
			}
		};

		_this7.state = {
			pullstate: _this7.props.pullUpLoading ? 0 : 1
		};
		return _this7;
	}

	(0, _createClass3.default)(PullUp, [{
		key: 'componentDidMount',
		value: function componentDidMount() {
			this.pullUp = this.refs["pullUp"];
		}
	}, {
		key: 'render',
		value: function render() {
			var _props5 = this.props,
			    pullUpTexts = _props5.pullUpTexts,
			    pullUp = _props5.pullUp,
			    loadMore = _props5.loadMore;

			var pullstate = loadMore ? this.state.pullstate : 1;
			var value = pullUpTexts[pullstate];

			return _react2.default.createElement(
				'div',
				{ ref: "pullUp", className: _ListView2.default.pullUp },
				pullstate === 0 ? _react2.default.createElement('img', { className: _ListView2.default.lodingimg, src: loading }) : null,
				_react2.default.createElement(
					'span',
					null,
					value
				)
			);
		}
	}]);
	return PullUp;
}(_react.PureComponent);

var LazyloadView = exports.LazyloadView = (_temp3 = _class4 = function (_PureComponent4) {
	(0, _inherits3.default)(LazyloadView, _PureComponent4);

	function LazyloadView() {
		var _ref;

		var _temp2, _this8, _ret;

		(0, _classCallCheck3.default)(this, LazyloadView);

		for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
			args[_key] = arguments[_key];
		}

		return _ret = (_temp2 = (_this8 = (0, _possibleConstructorReturn3.default)(this, (_ref = LazyloadView.__proto__ || (0, _getPrototypeOf2.default)(LazyloadView)).call.apply(_ref, [this].concat(args))), _this8), _this8.state = {
			isVisible: false
		}, _this8._onScroll = function () {
			var _this9 = _this8,
			    offsetTop = _this9.offsetTop,
			    scroller = _this9.scroller,
			    screenHeight = _this9.screenHeight,
			    itemClientHeight = _this9.itemClientHeight;

			var scroll_y = Math.abs(scroller.y);
			var scroll_min_y = offsetTop + itemClientHeight - scroll_y; // 距离顶部的距离
			var scroll_max_y = offsetTop - scroll_y; //距离底部的距离

			if (scroll_min_y >= 0 && scroll_max_y <= screenHeight) {
				//item显示后销毁滚动监听
				scroller.off("scroll", _this8._onScroll);
				_this8.setState({
					isVisible: true
				});
			}
		}, _temp2), (0, _possibleConstructorReturn3.default)(_this8, _ret);
	}

	(0, _createClass3.default)(LazyloadView, [{
		key: 'componentDidMount',
		value: function componentDidMount() {
			var _this10 = this;

			var _refs$lazyloadItem = this.refs['lazyloadItem'],
			    clientHeight = _refs$lazyloadItem.clientHeight,
			    offsetTop = _refs$lazyloadItem.offsetTop;

			this.screenHeight = window.innerHeight; // 内容显示高度
			this.offsetTop = offsetTop;
			this.itemClientHeight = clientHeight;
			setTimeout(function () {
				var scroller = _this10.props.getScroller();
				scroller.on("scroll", _this10._onScroll);
				_this10.scroller = scroller;
				_this10._onScroll();
			}, 100);
		}
	}, {
		key: 'componentWillUnmount',
		value: function componentWillUnmount() {
			//销毁滚动监听
			this.scroller.off("scroll", this._onScroll);
		}
	}, {
		key: 'render',
		value: function render() {
			var _props6 = this.props,
			    children = _props6.children,
			    height = _props6.height,
			    itemClassName = _props6.itemClassName,
			    style = _props6.style,
			    placeholder = _props6.placeholder;
			var isVisible = this.state.isVisible;

			var itemStyle = style || {};
			if (height && height !== '0px') {
				itemStyle.height = height;
			}
			return _react2.default.createElement(
				'div',
				{ ref: 'lazyloadItem', className: itemClassName, style: itemStyle },
				isVisible ? children : placeholder ? placeholder : _react2.default.createElement('div', { className: _ListView2.default.placeholder })
			);
		}
	}]);
	return LazyloadView;
}(_react.PureComponent), _class4.propTypes = {
	height: _propTypes2.default.string,
	getScroller: _propTypes2.default.func,
	placeholder: _propTypes2.default.any,
	itemClassName: _propTypes2.default.string
}, _class4.defaultProps = {
	height: '0px'
}, _temp3);