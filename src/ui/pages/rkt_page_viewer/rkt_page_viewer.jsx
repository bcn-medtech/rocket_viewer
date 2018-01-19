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
//components
import RktViewer from './../../components/rkt_viewer/rkt_viewer.jsx';

export default class RktPageViewer extends Component {

  setUrl(url) {
    
    if (url !== false) {
        var browserHistory = this.props.history;
        browserHistory.push("/viewer"+url);

    } else {
        alert("URL not compatible");
    }
  }

  render() {

    return (
      <div className="grid-frame rkt-page-viewer">
        <RktViewer set_url={this.setUrl.bind(this)}/>
      </div>
    );
  }
}