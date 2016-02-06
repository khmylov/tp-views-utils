import React from 'react'
import {render} from 'react-dom';

import App from './App.jsx'
import ViewTreeModel from './models/viewTree';

const model = new ViewTreeModel();
const app = React.createElement(App, {
    model: model
});
render(app, document.getElementById('rootElement'));