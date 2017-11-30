import React, { Component } from 'react';
//react router
import {BrowserRouter as Router,Route} from 'react-router-dom';
//css
import './App.css';
//pages
import RktPageViewer from './pages/rkt_page_viewer/rkt_page_viewer.jsx';
//import RktPageError from './pages/rkt_page_error/rkt_page_error.jsx';

class App extends Component {
  
  render() {  
    return (
      <Router>
        <div className="grid-frame rkt-app">
          <Route exact path="/" component={RktPageViewer} />
          <Route path="/viewer" component={RktPageViewer} />
          <Route path="/viewer/:format/:url" component={RktPageViewer} />
        </div>
      </Router>
    );
  }
}

export default App;
