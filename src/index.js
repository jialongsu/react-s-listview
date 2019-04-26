/**
 * Created by sujialong on 2017/6/6.
 */
import React from 'react';
import {render} from 'react-dom';
import RootRouter from './RootRouter';
import ('./styles/base/base.scss');

render(
  <RootRouter/>,
  document.getElementById('app')
);