# React-S-ListView

这是一个基于JavaScript原生实现的react组件，实现了上拉加载更多，和下拉刷新，以及懒加载的列表组件

![](https://github.com/1035901787/react-s-listview/blob/master/source/20180506112030.gif)

# 安装

```sh
npm install react-s-listview or  yarn add react-s-listview
```

# 使用

```js
import ListView from 'react-s-listview';

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
            resolve();
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
                isLazyload={true} //懒加载
                itemHeight={`${313 / 37.5}rem`} //选用懒加载时，需指定item的高度，否则懒加载将无效
                itemClassName={styles.listCon}
                onPullDownRefrsh={this._onPullDownRefrsh}
                onPullUpRefrsh={this._onPullUpRefrsh}
            />
        )
    }
}

```

# 属性

|属性         | 值类型          | 默认值  | 描述  |
| ------------- |:-------------:| -----:| -----:|
| dataSource     | array | [] | 列表数据源 |
| renderRow      | any      |   无 |   列表item布局 |
| renderHeader      | any      |   无 |   列表头部布局 |
| renderFooter      | any      |   无 |   列表尾部布局 |
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

# 内置组件-LazyloadView

使用场景：list列表中，item高度不一致，如下：

```js
import ListView, {LazyloadView} from 'components/ListView/ListView';

export default class Demo extends PureComponent {

    state = {
        ary: [1, 2, 3, 4, 5, 6, 7, 8, 9, 1, 2]
    }

    componentDidMount() {
        this.listView = this.refs['listview'];
    }

    _getScrollView = () => {
		return this.listView.getScroller();
	}

    _onPullDownRefrsh = async (resolve, reject) => {
	};

	_onPullUpRefrsh = async (resolve, reject) => {
        const {ary} = this.state;
        this.setState({
            ary: ary.concat([1, 2, 3])
        });
        resolve(0);
    };

    _renderRow = ({data, index}) => {
        const {router} = this.props;
        let item, height;
        if(index % 2 === 0) {
            item = <div style={{backgroundColor: '#000', height: '100%'}}/>;
            height = 100;
        }else {
            item = <div style={{backgroundColor: 'red', height: '100%'}}/>;
            height = 150;
        }
        return (
            <LazyloadView
                key={index}
                getScroller={this._getScrollView}
                height={`${height / 37.5}rem`}>
                {item}
            </LazyloadView>
        );
    }

    render(){
        const {router} = this.props;
        const {ary} = this.state;
        return(
            <ListView
                ref="listview"
                dataSource={ary}
                renderRow={this._renderRow}
                startY={0}
                loadMore={true}
                onPullDownRefrsh={this._onPullDownRefrsh}
                onPullUpRefrsh={this._onPullUpRefrsh}/>
        )
    }
}
```

# 属性-LazyloadView

|属性         | 值类型          | 默认值  | 描述  |
| ------------- |:-------------:| -----:| -----:|
| height     | string | '0px' | item高度（必传） |
| getScroller     | func | 无 | 获取listview对象 |
| placeholder     | any | 默认 | item未显示时占位 |
| itemClassName     | string | 无 | item class |

![](https://github.com/1035901787/react-s-listview/blob/master/source/20180507111145.gif)