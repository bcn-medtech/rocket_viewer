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

import React, {Component} from 'react';

export default class RktViewerDicomMultiFrame extends Component {

    /*constructor() {
        super();
    }*/

    render() {
        
        let elementId = this.props.elementId;

        return (
            <div id={"videoControls-"+elementId} className="grid-block video-controls" style={{width: this.props.canvasWidth}}>
                <div className="medium-1 grid-block">
                    <a className="button" id={"playClip-"+elementId} onClick={this.props.onPlayClick}>
                        {this.props.isPlaying ? <i className="fi-pause" /> :  <i className="fi-play" />}
                    </a>
                </div>
                <div className="medium-9 grid-block">
                    <input type="range" id={"slice-range-"+elementId} className="input-range-stack" onInput={this.props.onChangeTime} value={this.props.currentValue} max={this.props.totalFrames} />
                </div>
                <div className="medium-2 grid-block">
                    <span className="frame-count">{this.props.currentValue+1}/{this.props.totalFrames}</span>
                </div>
            </div>
        );
    }
}