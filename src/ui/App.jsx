/*
# Rocket viewer is (c) BCNMedTech, UNIVERSITAT POMPEU FABRA
#
# Rocket viewer is free software: you can redistribute it and/or modify
# it under the terms of the GNU Affero General Public License as
# published by the Free Software Foundation, either version 3 of the
# License, or (at your option) any later version.
#
# Rocket viewer is distributed in the hope that it will be useful,
# but WITHOUT ANY WARRANTY; without even the implied warranty of
# MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
# GNU Affero General Public License for more details.
#
# You should have received a copy of the GNU Affero General Public License
# along with this program.  If not, see <http://www.gnu.org/licenses/>.
#
# Authors:
# Carlos Yagüe Méndez
# María del Pilar García
# Daniele Pezzatini
# Contributors: 
# Sergio Sánchez Martínez
*/

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
