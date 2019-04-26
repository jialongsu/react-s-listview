import React, {PureComponent} from 'react';
import styles from './ListView.scss';
import PropTypes from 'prop-types';

export default class LazyloadView extends PureComponent{

	static propTypes = {
	  height: PropTypes.string,
	  getScroller: PropTypes.func,
	  placeholder: PropTypes.any,
	  itemClassName: PropTypes.string,
	}

	static defaultProps = {
	  height: '0px'
	}

	state = {
	  isVisible: false
	}

	componentDidMount() {
	  const {clientHeight, offsetTop, parentElement} = this.lazyloadItem;
	  this.screenHeight = window.innerHeight; // 内容显示高度
	  this.offsetTop = offsetTop || parentElement.offsetTop;
	  this.itemClientHeight = clientHeight;

	  setTimeout(() => {
	    const scroller = this.props.getScroller();
	    scroller.on('scroll', this._onScroll);
	    this.scroller = scroller;
	    this._onScroll();
	  }, 100);
	}

	componentWillUnmount() {
	  //销毁滚动监听
	  const scroller = this.scroller;
	  scroller && scroller.off('scroll', this._onScroll);
	}

	_onScroll = () => {
	  const {offsetTop, scroller, screenHeight, itemClientHeight} = this;
	  const scroll_y = Math.abs(scroller.y);
	  const scroll_min_y = offsetTop + itemClientHeight - scroll_y; // 距离顶部的距离
	  const scroll_max_y = offsetTop - scroll_y; //距离底部的距离
	  if (scroll_min_y >= 0 && scroll_max_y <= screenHeight) {
	    //item显示后销毁滚动监听
	    scroller.off('scroll', this._onScroll);
	    this.setState({
	      isVisible: true
	    });
	  }
	}

	getLazyloadItem = (view) => {
	  this.lazyloadItem = view;
	}

	render() {
	  const {children, height, itemClassName, style, placeholder} = this.props;
	  const {isVisible} = this.state;
	  const itemStyle = style || {};
	  if (height && height !== '0px') {
	    itemStyle.height = height;
	  }
	  return (
	    <div ref={this.getLazyloadItem} className={itemClassName} style={itemStyle}>
	      {isVisible ? children : (placeholder ? placeholder : <div className={styles.placeholder}/>)}
	    </div>
	  );
	}
}