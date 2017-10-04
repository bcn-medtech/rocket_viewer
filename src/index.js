import React from 'react';
import ReactDOM from 'react-dom';
import './../node_modules/foundation-apps/dist/css/foundation-apps.min.css';
import './index.css';
import App from './ui/App.jsx';
import registerServiceWorker from './registerServiceWorker';

ReactDOM.render(<App />, document.getElementById('root'));
registerServiceWorker();
