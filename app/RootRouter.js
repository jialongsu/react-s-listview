/**
/**
 * Created by sujialong on 2017/6/7.
 */
import React, {Component} from 'react';
import {
    BrowserRouter,
    Route,
    Switch
} from 'react-router-dom';
import App from './pages/App';
import demoList from './pages/demo/demoList';


export default class RootRouter extends Component{

    constructor(props) {
		super(props);
    }

    _renderRoute = ({history, location}) => {

		return(
            <div id="reactroot">
                <App key={location.pathname}>
                    <Switch>
                        <Route location={location} exact path="/" component={demoList}/>
						<Route location={location} path="/demoList" component={demoList}/>
						<Route location={location} component={demoList}/>
                    </Switch>
                </App>
			</div>
		)
	}

    render(){
        const {NODE_ENV, BUILD_TYPE} = process.env;
        const supportsHistory = 'pushState' in window.history;
        const basename = NODE_ENV == "dev" ? "/" : "/pet/petUser"
        return(
            <BrowserRouter
				basename={basename}
				keyLength={12}
				forceRefresh={!supportsHistory}>
				<Route render={this._renderRoute} />
			</BrowserRouter>
        );
    }
}
