// src/index.js

import ReactDOM from 'react-dom';

// Can remove this once we completely switch to Bootstrap
import './index.css';

import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import './css/app.css';
import { makeMainRoutes } from './routes';

const routes = makeMainRoutes();

ReactDOM.render(routes, document.getElementById('root'));
