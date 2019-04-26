
import React, {Component} from 'react';

export default class App extends Component{

  render(){
    return (
      <div id='approot'>
        {this.props.children}
      </div>
    );
  }
}