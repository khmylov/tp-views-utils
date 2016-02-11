import React from 'react';
import {Router, Route, browserHistory} from 'react-router';
import {render} from 'react-dom';
import _ from 'lodash';

import './css/main.css';
// Required for Bootstrap
import 'expose?$!expose?jQuery!jquery';

import routes from './routes';
import AuthService from './services/auth';
import App from './App.jsx';

import CopyCardSettingsPage from './components/copyCardSettings/page.jsx';
import SignInPage from './components/signIn/page.jsx';

const auth = new AuthService();

function requireAuth(nextState, replace) {
    const {pathname} = nextState.location;
    console.log('requireAuth()', pathname);
    if (_.includes(['/', routes.login, routes.logout], pathname)) {
        console.log('Allowed anonymous access');
        return;
    }

    const isLoggedIn = auth.isLoggedIn();
    console.log('Is logged in: ', isLoggedIn);
    if (!isLoggedIn) {
        replace({
            pathname: routes.login,
            state: {
                nextPathname: nextState.location.pathname
            }
        })
    }
}

// todo: maybe merge with routes module

const routeConfig = {
    path: '/',
    component: App,
    onEnter: requireAuth,
    childRoutes: [
        {
            path: routes.copyCardSettings,
            component: CopyCardSettingsPage, onEnter: requireAuth
        },
        {
            path: routes.login,
            component: SignInPage
        }
    ]
};

render(
    React.createElement(Router, {
        routes: routeConfig,
        history: browserHistory,
        createElement(Component, props) {
            return React.createElement(Component, _.assign({
                auth: auth
            }, props));
        }
    }),
    document.getElementById('rootElement'));