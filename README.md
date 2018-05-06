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
| isRefreshPullUp | bool      |   true |   是否启用上拉加载 |
| onPullDownRefrsh | func      |   无 |   下拉刷新回调事件 |
| onPullUpRefrsh | func      |   无 |   上拉加载回调事件 |
| pullDownTexts | array      |   ['下拉刷新', '释放刷新', '加载中', '刷新成功'] |   下拉刷新提示文字 |
| pullUpTexts | array      |   ['正在加载...', '没有更多数据了...'] |   上拉刷新提示文字 |
| pullDown | any      |   默认样式 |   下拉刷新布局 |
| pullUp | any      |   默认样式 |   上拉加载布局 |
| pullUpLoading | bool      |   true |   是否显示上拉加载样式 |
| loadMore | bool      |   true |   是否上拉加载 |
| startY | number      |   0 |   listview显示位置 |
| isLazyload | bool      |   false |   是否启用懒加载 |
| itemHeight | string      |  0  |   启用懒加载后（必传）item的高度 |
| itemClassName | string      |  无  |   启用懒加载后可设置item class |
| placeholder | any      |  无  |   懒加载未加载时显示的占位布局 |

