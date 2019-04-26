import React, {PureComponent} from 'react';
import styles from './ListView.scss';
import loading from './images/loading.gif';
import arrows from './images/arrows.jpeg';

export default class PullDown extends PureComponent{
  state = {
    pullstate: 0
  }

  componentDidMount() {
    const height = this.getHeight();
    this.pullDown.style.cssText = 'margin-top:'+(-height)+'px;';
  }

	getHeight = () => {
	  return this.pullDown.offsetHeight;
	}

	changState = (state) => {
	  const pullstate = this.state.pullstate;
	  if (pullstate != state){
	    this.setState({
	      pullstate: state
	    });
	  }

	}

	getPullDown = (view) => {
	  this.pullDown = view;
	}

	render() {
	  const {pullDownTexts} = this.props;
	  const pullstate = this.state.pullstate;
	  const value = pullDownTexts[pullstate];
	  const cls = `${styles.pullDown}`;
	  let loadImg = arrows;
	  let loadImgCls = styles.arrowsimg;

	  if (pullstate == 1){
	    loadImgCls = `${styles.arrowsimg} ${styles.arrowsimg_active}`;
	  } else if (pullstate == 2){
	    loadImg = loading;
	    loadImgCls = styles.lodingimg;
	  }

	  return (
	    <div ref={this.getPullDown} className={cls}>
	      {pullstate != 3?<img className={loadImgCls} src={loadImg}/>:null}
	      <span>{value}</span>
	    </div>
	  );
	}
}