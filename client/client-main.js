import {render} from 'react-dom';

import './css/main.css';
// Required for Bootstrap
import 'expose?$!expose?jQuery!jquery';

import {createRouter} from 'client/configuration/routing.jsx';
import AuthService from './services/auth';

const auth = new AuthService();

auth
    .tryBuildSession()
    .always(() => {
        render(
            createRouter({auth}),
            document.getElementById('rootElement'));
    });