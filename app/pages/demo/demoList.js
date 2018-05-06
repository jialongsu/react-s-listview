import React, {PureComponent} from 'react';
import styles from './styles.scss';
import ListView from 'components/ListView/ListView';

export default class DemoList extends PureComponent {

    state = {
        ary: [1, 2, 3, 4, 5, 6]
    }

    _onPullDownRefrsh = (resolve, reject) => {
        const {ary} = this.state;
        setTimeout(() => {
            this.setState({
                ary: [1, 2, 3, 4, 5, 6]
            });
            resolve();
        }, 1000);
	};

	_onPullUpRefrsh = (resolve, reject) => {
		const {ary} = this.state;
        setTimeout(() => {
            this.setState({
                ary: ary.concat([1, 2, 3])
            });
            resolve(0);
        }, 1000);
    };

    _renderRow = ({data, index}) => {
        return (
            <div>
                <img className={styles.image}
                        src="http://img.redocn.com/sheji/20160709/shouhuizhongyangjieguangchangwudasaiwangzhanbannersheji_6658831.jpg" />
                <div className={styles.footer}>
                    <div className={styles.title}>狗狗为什么喜欢</div>
                    <div className={styles.dec}>狗狗为什么喜欢狗狗为什么喜欢狗狗为什么喜欢狗狗为什么喜欢狗狗为什么喜欢</div>
                    <div className={styles.foot}>
                        <span>一小时<span className={styles.genre}>汪星人</span></span>
                        <div className={styles.right} onClick={this.ontapthumbsUp}>
                            <img className={styles.icon} src={require("img/unthumb.png")} />
                            <sapn >230</sapn>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    render() {
        const {scrollY, loadMore} = this.videoListStore || {};
        const {ary} = this.state;
        return (
            <ListView
                ref="listview"
                style={{backgroundColor: '#fff'}}
                dataSource={ary}
                renderRow={this._renderRow}
                startY={scrollY}
                loadMore={loadMore}
                isLazyload={true}
                itemHeight={`${313 / 37.5}rem`}
                itemClassName={styles.listCon}
                onPullDownRefrsh={this._onPullDownRefrsh}
                onPullUpRefrsh={this._onPullUpRefrsh}/>
        )
    }
}

