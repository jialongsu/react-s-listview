import React, {PureComponent} from 'react';
import styles from './styles.scss';
import ListView from '../../../lib/ListView/ListView';

export default class DemoList extends PureComponent {

    state = {
      ary: [1, 2, 3, 4, 5, 6]
    }

    _onPullDownRefrsh = (resolve) => {
      setTimeout(() => {
        this.setState({
          ary: [1, 2, 3, 4, 5, 6]
        });
        resolve();
      }, 1000);
    };

	_onPullUpRefrsh = (resolve) => {
	  const {ary} = this.state;
	  setTimeout(() => {
	    this.setState({
	      ary: ary.concat([1, 2, 3])
	    });
	    resolve(1);
	  }, 1000);
	};

    _renderRow = ({index}) => {
      return (
        <div key={index}>
          <img className={styles.image}
            src='http://img.redocn.com/sheji/20160709/shouhuizhongyangjieguangchangwudasaiwangzhanbannersheji_6658831.jpg' />
          <div className={styles.footer}>
            <div className={styles.title}>狗狗为什么喜欢--{index}</div>
            <div className={styles.dec}>狗狗为什么喜欢狗狗为什么喜欢狗狗为什么喜欢狗狗为什么喜欢狗狗为什么喜欢</div>
          </div>
        </div>
      );
    }

    render() {
      const {scrollY, loadMore} = this.videoListStore || {};
      const {ary} = this.state;
      return (
        <ListView
          style={{backgroundColor: '#fff'}}
          dataSource={ary}
          renderRow={this._renderRow}
          startY={scrollY}
          loadMore={loadMore}
          isLazyload={true} //懒加载
          itemHeight={`${313 / 37.5}rem`} //选用懒加载时，需指定item的高度，否则懒加载将无效
          itemClassName={styles.listCon}
          onPullDownRefrsh={this._onPullDownRefrsh}
          onPullUpRefrsh={this._onPullUpRefrsh}/>
      );
    }
}

