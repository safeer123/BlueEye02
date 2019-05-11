import React, { Suspense, lazy } from 'react';
import { Router, Route, Redirect, Switch } from 'react-router-dom';

import history from '../utilities/history';
import ErrorBoundary from '../components/MessageScreens/ErrorBoundary';
import Home from '../components/Home';
import ViewPage from '../components/ViewPage';
import AppLoading from '../components/MessageScreens/AppLoading';
import PageNotFound from '../components/MessageScreens/PageNotFound';
import Navigate from './Navigate';

const AppRouter = props => (
  <Router history={history}>
    <ErrorBoundary>
      <Suspense fallback={<AppLoading />}>
        <Switch>

          <Route
            exact
            path="/"
            render={props => (
              <Home {...props} Navigate={Navigate} />
            )}
          />

          <Route
            path="/sample/:viewIndex"
            render={props => <ViewPage {...props} Navigate={Navigate} />}
          />

          <Route path="page-not-found" component={PageNotFound} />
          <Route render={() => (<Redirect to="page-not-found" />)} />

        </Switch>
      </Suspense>
    </ErrorBoundary>
  </Router>
);
export default AppRouter;
