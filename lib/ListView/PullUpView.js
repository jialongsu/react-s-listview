import React, {PureComponent} from 'react';
import styles from './ListView.scss';
import loading from './images/loading.gif';

export default class PullUp extends PureComponent{
  state = {
    pullstate: this.props.pullUpLoading ? 0 : 1
  }

	getHeight = () => {
	  return this.pullUp.offsetHeight;
	}

	changState = (state) => {
	  const pullstate = this.state.pullstate;
	  if ((state === 0 || state === 1) && pullstate != state){
	    this.setState({
	      pullstate: state
	    });
	  }
	}

	getPullUp = (view) => {
	  this.pullUp = view;
	}

	render() {
	  const {pullUpTexts, loadMore} = this.props;
	  const pullstate = loadMore?this.state.pullstate:1;
	  const value = pullUpTexts[pullstate];
	  return (
	    <div ref={this.getPullUp} className={styles.pullUp}>
	      {pullstate === 0?<img className={styles.lodingimg} src={loading}/>:null}
	      <span>{value}</span>
	    </div>
	  );
	}
}