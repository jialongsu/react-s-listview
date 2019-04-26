/**
 * Created by sujialong on 2017/5/25.
 */
import React, {Component} from 'react';
import PropTypes from 'prop-types';
import Iscroll from './lib/iscroll-probe';
import styles from './ListView.scss';
import PullUp from './PullUpView';
import PullDown from './PullDownView';
import Lazyload from './LazyloadView';

export default class ListView extends Component{

	static propTypes = {
	  dataSource: PropTypes.array, //列表数据源
	  renderRow: PropTypes.any, //列表item布局样式 尽量使用内边距(padding)调整间距
	  renderHeader: PropTypes.func, // 列表头部布局
	  renderFooter: PropTypes.func, // 列表尾部布局
	  isRefreshPullDown: PropTypes.bool, //是否启用下拉刷新
	  isRefreshPullUp: PropTypes.bool, //是否启用上拉加载
	  onPullDownRefrsh: PropTypes.func, //下拉刷新回调事件
	  onPullUpRefrsh: PropTypes.func, //上拉加载回调事件
	  pullDownTexts: PropTypes.array, //下拉刷新提示文字
	  pullUpTexts: PropTypes.array, //下拉刷新提示文字
	  pullDown: PropTypes.object, //下拉刷新布局
	  pullUp: PropTypes.object, //上拉加载布局
	  pullUpLoading: PropTypes.bool, //是否显示上拉加载样式
	  loadMore: PropTypes.bool, //是否上拉加载
	  horizontal: PropTypes.bool,
	  startY: PropTypes.number,
	  startX: PropTypes.number,
	  isLazyload: PropTypes.bool, //懒加载
	  itemClassName: PropTypes.string, //item class
	  itemHeight: PropTypes.string, //懒加载item的高度
	  placeholder: PropTypes.any, //懒加载未加载时显示的占位布局
	  contentContainerCls: PropTypes.string, //item容器样式
	  className: PropTypes.string, //容器样式
	}

	static defaultProps = {
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
	  renderHeader: () => null,
	  renderFooter: () => null,
	}

	constructor(props) {
	  super(props);
	  const randomId = this.rand();
	  this.state = {
	    wrapperId: 'wrapper_'+randomId,
	    scrollerId: 'scroll_'+randomId
	  };
	}

	/**
	 * 获取scroller随机id
	 * @returns {string}
	 */
	rand() {
	  let pre = 0;
	  const inc = 2;
	  pre += inc;
	  let randNum = pre + (Math.random() * inc);
	  randNum = randNum.toString();
	  const length = randNum.length;
	  let randNums = randNum.substring(length-3, length);
	  let time = new Date().getTime();
	  time = time.toString();
	  const timeLen = time.length;
	  time = time.substring(timeLen-3, timeLen);
	  randNums += time;
	  return randNums;
	}

	componentDidMount(){
	  const {horizontal, loadMore, startY, startX} = this.props;
	  const {wrapperId, scrollerId} = this.state;
	  this.isLoadMore = loadMore;
	  const pullDown_height = this.pullDown ? parseFloat(this.pullDown.getHeight()) : 0;
	  const {isPc} = this.deviceOs();
	  const options = {
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
	    minScrollX: 0,
	  };

	  //设置横向滚动宽度
	  const scroller = document.getElementById(scrollerId),
	    scrollWidth = scroller.scrollWidth,
	    scrollHeight = scroller.scrollHeight;
	  this.oldScrollHeight = scrollHeight;
	  this.scroller = scroller;
	  if (this.props.horizontal){
	    scroller.style.cssText = `width:${scrollWidth}px`;
	  }
	  //实例化iscroll
	  this.list = new Iscroll(`#${wrapperId}`, options);
	  // 修复iscroll在新版chrome和其他新版浏览器(Android 7.0)无法滚动bug
	  document.addEventListener('touchmove', this.handlerTouchmove, this.isPassive() ? {
	    capture: false,
	    passive: false
	  } : false);
	  this._bindScrollEvent();
	}

	componentWillUnmount() {
	  if (this.list) {
	    this.list.destroy();
	    this.list = null;
	  }
	  this.timer && clearTimeout(this.timer);
	  document.removeEventListener('touchmove', this.handlerTouchmove);
	}

	handlerTouchmove = (e) => {
	  e.preventDefault();
	}

	shouldComponentUpdate(nextProps) {
	  // 列表发生了变化, 那么应该在componentDidUpdate时调用iscroll进行refresh
	  this.itemsChanged = nextProps.dataSource.length !== this.props.dataSource.length;
	  return true;
	}

	componentDidUpdate() {
	  // 仅当列表高度发生了变更，才调用iscroll的refresh重新计算滚动条信息
	  if (this.oldScrollHeight != this.scroller.scrollHeight) {
	    this.itemsChanged = false;
	    //item未指定高度,如图片加载,需等图片加载完成再进行刷新
	    this.timer && clearTimeout(this.timer);
	    this.timer = setTimeout(() => {
	      this.list.refresh();
	    }, 250);
	    this.oldScrollHeight = this.scroller.scrollHeight;
	  }
	  if (!this.isPullUpRefrsh){
	    this.setLoadmore(this.props.loadMore);
	  }
	}

	_bindScrollEvent = () => {
	  const list = this.list;
	  list.on('scrollStart', this._onScrollStart);
	  list.on('scroll', this._onScroll);
	  // list.on("scrollEnd",this._onScrollEnd);
	}

	deviceOs() {
	  const ua = navigator.userAgent,
	    isWindowsPhone = /(?:Windows Phone)/.test(ua),
	    isSymbian = /(?:SymbianOS)/.test(ua) || isWindowsPhone,
	    isAndroid = /(?:Android)/.test(ua),
	    isFireFox = /(?:Firefox)/.test(ua),
	    // isChrome = /(?:Chrome|CriOS)/.test(ua),
	    isTablet = /(?:iPad|PlayBook)/.test(ua) || (isAndroid && !/(?:Mobile)/.test(ua)) || (isFireFox && /(?:Tablet)/.test(ua)),
	    isPhone = /(?:iPhone)/.test(ua) && !isTablet,
	    isPc = !isPhone && !isAndroid && !isSymbian && !isTablet && !isWindowsPhone;
	  return {
	    isTablet: isTablet,
	    isPhone: isPhone,
	    isAndroid: isAndroid,
	    isPc: isPc
	  };
	}

	isPassive() {
	  let supportsPassiveOption = false;
	  try {
	    addEventListener('test', null, Object.defineProperty({}, 'passive', {
	      get: function () {
	        supportsPassiveOption = true;
	      }
	    }));
	  } catch (e) {}
	  return supportsPassiveOption;
	}

	refresh = () => {
	  this.list.refresh();
	}

	getScroller = () => {
	  return this.list;
	}

	onTouchStart = () => {
	  const {onTouchStart} = this.props;
	  this.isTouching = true;
	  this.list.isTouching = true;
	  onTouchStart && onTouchStart();
	}

	onTouchEnd = () => {
	  const {isRefreshPullDown, onTouchEnd} = this.props;
	  onTouchEnd && onTouchEnd();
	  if (!isRefreshPullDown) return;
	  const pullDown = this.pullDown,
	    pullDown_height = pullDown.getHeight(),
	    y = this.list.y;
	  this.isTouching = false;
	  this.list.isTouching = false;
	  this.pullDownRester = y !== 0 && y > -pullDown_height && y < pullDown_height;
	  !this.isPullDownRefrshing && this._pullDownRefrshing();
	}

    _onScrollStart = () => {
      const {scrollerHeight, scroller} = this.list;
      const {clientHeight} = scroller;
      //解决高度变化无法滑动到底部的问题
      if (!(clientHeight === scrollerHeight)) {
        this.refresh();
      }
    }

	_onScroll = () => {
	  const list = this.list,
	    {isRefreshPullDown, isRefreshPullUp} = this.props;
	  if (list){
	    const {y} = list;
	    isRefreshPullDown && this._pullDownRefrsh(y, list);
	    isRefreshPullUp && this._pullUpRefrsh(y, list);
	  }
	}

	/**
     * 下拉刷新
     * @param y
     * @param list
     * @private
     */
	_pullDownRefrsh(y, list) {
	  const pullDown = this.pullDown,
	    pullDown_height = pullDown.getHeight(),
	    isPullDownRefrsh = this.isPullDownRefrsh;

	  // 解决当内容太少时，drag 或 scroll 不起作用，我们通过重新设置 hasVerticalScroll 为 true 来激活拖拽或滚动
	  if (y ===  -pullDown_height){
	    list.hasVerticalScroll = true;
	  }
	  if (y >=  pullDown_height && !isPullDownRefrsh && this.isTouching){
	    pullDown.changState(1);
	    this.isPullDownRefrsh = true;
	  }

	}

	_pullDownRefrshing() {
	  const list = this.list;

	  if (this.isPullDownRefrsh && !this.isTouching){
	    const pullDown = this.pullDown;
	    this.isPullDownRefrshing = true;
	    list.isTouching = true;
	    // list.scrollTo(0,this.pullDown.getHeight(),250);
	    pullDown.changState(2);
	    const onPullDownRefrsh = this.props.onPullDownRefrsh;
	    new Promise((resolve, reject) => {
	      onPullDownRefrsh && onPullDownRefrsh(resolve, reject);
	    }).then(() => {
	        this.setPullDownRefrshEnd();
	        this.isPullDownRefrsh = false;
	        this.isPullDownRefrshing = false;
	        list.enable();
	      }).
	      catch((error) => {
	        this.setPullDownRefrshEnd();
	        this.isPullDownRefrsh = false;
	        this.isPullDownRefrshing = false;
	        list.enable();
	        console.error('error:', error);
	      });
	  }
	}

	setPullDownRefrshEnd = () => {
	  const pullDown = this.pullDown;
	  // pullDown.changState(3);
	  setTimeout(() => {
	    const list = this.list;
	    // const pullDown_height = pullDown.getHeight();
	    pullDown.changState(0);
	    this.isPullDownRefrsh = false;
	    // list.scrollTo(0,-(pullDown_height+3),250);
	    list.isTouching = false;
	    list.scrollTo(0, 0, 250);
	  }, 580);
	}

	/**
	 * 上拉加载
	 * @param y
	 * @param list
	 * @private
	 */
	setLoadmore = (type) => {
	  this.isLoadMore = type;
	  let state = 0;
	  if (!type){
	    state = 1;
	  } else {
	    state = 0;
	  }
	  this.setPullUpRefrshEnd(state);
	}

	_pullUpRefrsh(y, list) {
	  if (!this.isLoadMore) return;
	  const {maxScrollY} = list;
	  if (y <= maxScrollY && !this.isPullUpRefrsh){
	    const onPullUpRefrsh = this.props.onPullUpRefrsh;
	    this.isPullUpRefrsh = true;
	    new Promise((resolve, reject) => {
	      onPullUpRefrsh && onPullUpRefrsh(() => {
	        setTimeout(() => {
	          resolve();
	        }, 250);
	      }, reject);
	    }).then((state) => {
	        this.setPullUpRefrshEnd(state);
	      }).
	      catch((error) => {
	        this.setPullUpRefrshEnd(error);
	        console.error('error:', error);
	      });
	  }
	}

	setPullUpRefrshEnd = (state) => {
	  const pullUp = this.pullUp;
	  this.isPullUpRefrsh = false;
	  pullUp && pullUp.changState(state);
	}

	getPullUp = (view) => {
	  this.pullUp = view;
	}

	getPullDown = (view) => {
	  this.pullDown = view;
	}

	getScrollView = (view) => {
	  this.scroller = view;
	}

	renderRowItem() {
	  const {dataSource, renderRow, isLazyload, itemHeight, itemClassName, placeholder} = this.props;
	  return dataSource.map((item, i) => {
	    const props = {
	      data: item,
	      index: i
	    };
	    return isLazyload ?
	      <Lazyload
	        key={`lazyload-${i}`}
	        height={itemHeight}
	        itemClassName={itemClassName}
	        placeholder={placeholder}
	        getScroller={this.getScroller}
	      >
	        {renderRow(props)}
	      </Lazyload>
	      : renderRow(props);
	  });
	}

	render(){
	  const {
	      style,
	      className='',
	      pullDownTexts,
	      pullUpTexts,
	      pullDown,
	      pullUp,
	      pullUpLoading,
	      loadMore,
	      isRefreshPullDown,
	      isRefreshPullUp,
	      renderHeader,
	      renderFooter,
	      contentContainerCls,
	    } = this.props,
	    {wrapperId, scrollerId} = this.state;
	  return (
	    <div
	      id={wrapperId}
	      className={`${className} ${styles.wrapper}`}
	      style={style}
	      onMouseDown={this.onTouchStart}
	      onMouseUp={this.onTouchEnd}
	      onTouchStart={this.onTouchStart}
	      onTouchEnd={this.onTouchEnd}
	    >
	      <div
	        id={scrollerId}
	        className={styles.scroller}
	        ref={this.getScrollView}
	      >

	        {
	          isRefreshPullDown &&
							<PullDown
							  ref={this.getPullDown}
							  pullDown={pullDown}
							  pullDownTexts={pullDownTexts}
							/>
	        }
	        {renderHeader && renderHeader()}
	        <div className={`${contentContainerCls}`}>
	          {this.renderRowItem()}
	        </div>
	        {renderFooter && renderFooter()}
	        {
	          isRefreshPullUp &&
							<PullUp
							  ref={this.getPullUp}
							  loadMore={loadMore}
							  pullUp={pullUp}
							  pullUpLoading={pullUpLoading}
							  pullUpTexts={pullUpTexts}
							/>
	        }
	      </div>
	    </div>
	  );

	}
}

export const LazyloadView = Lazyload;