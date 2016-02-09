import React from 'react'
import {Router, Route} from 'react-router'
import {render} from 'react-dom'

import './css/main.css'

import 'expose?$!expose?jQuery!jquery';

import routes from './routes'
import App from './App.jsx'

import CopyCardSettingsPage from './components/copyCardSettings/page.jsx'

const routeConfig = {
    path: '/',
    component: App,
    childRoutes: [
        {path: routes.copyCardSettings, component: CopyCardSettingsPage}
    ]
};

render(
    React.createElement(Router, {routes: routeConfig}),
    document.getElementById('rootElement'));