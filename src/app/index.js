import * as React from 'react';
import * as ReactDOM from 'react-dom';

import AppRouter from './router';

import './styles/index.scss';
import './styles/font-family.scss';

ReactDOM.render(
  <AppRouter />,
  document.getElementById('root'),
);
