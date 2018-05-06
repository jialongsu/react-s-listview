'use strict';
import React, {Component} from 'react';
import 'common/baseStyle/BaseStyle.scss';

export default class App extends Component{

    render(){
        return(
            <div id="approot">
                {this.props.children}
            </div>
        );
    }
}