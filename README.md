# React-S-ListView

[![Build Status][build-badge]][build]
[![Version][version-badge]][package]
[![MIT License][license-badge]][license]

这是一个基于JavaScript原生实现的react组件，实现了上拉加载更多，和下拉刷新，以及懒加载的列表组件

![这里写图片描述](https://github.com/1035901787/react-s-listview/blob/master/source/20180506112030.gif)

# 安装

```sh
npm install react-s-listview
```

# 使用

```js
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
            <div> row </div>
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

```

# 属性

|属性         | 值类型          | 默认值  | 描述  |
| ------------- |:-------------:| -----:| -----:|
| dataSource     | array | 列表数据源 | [] |
| renderRow      | any      |   无 |   列表item布局 |
| isRefreshPullDown | bool      |   true |   是否启用下拉刷新 |
| isRefreshPullUp | bool      |   true |   是否启用下拉刷新 |

