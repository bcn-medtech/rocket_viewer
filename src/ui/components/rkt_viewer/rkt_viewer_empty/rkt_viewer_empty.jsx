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
//utils
import newId from './../../../../utils/newid';
//modules
import { createURL } from './rkt_viewer_empty_actions.js';
//config viewers
import configViewers from './../../../../config/config_viewers.json';
//components
import RktCardViewer from './../../rkt_card/rkt_card_viewer/rkt_card_viewer';

export default class RktComponentTemplate extends Component {

    constructor() {
        super();
        this.state = {};
    }

    inputHandleChange(e) {
        this.setState({ input: e.target.value });
    }

    // setURL() {

    //     var config = this.props.config;
    //     var host = config.host;
    //     var port = config.port;
    //     var urlapp = host + ":" + port;
    //     var newURL = createURL(this.state.input, urlapp);
    //     this.props.seturl(newURL);
    // }

    setURLFromCard(url) {
        this.props.seturl(url);
    }

    renderCards() {

        var viewers = configViewers.viewers;

        return (
            viewers.map((item) => {
                return (
                    <RktCardViewer viewer={item} seturl={this.setURLFromCard.bind(this)} key={newId()} />
                )
            })
        );
    }

    render() {
      
        return (
            <div className="grid-block" style={{overflow:"hidden"}}>
                <div className="grid-block rkt-viewer-empty-dragbox-icon">
                    <svg className="grid-block" viewBox="0 -200 500 1000">
                        <g>
                            <g>
                                <path className="head" d="M428.719,63.242C387.936,22.46,333.713,0,276.04,0S164.142,22.46,123.36,63.242
                                    c-40.361,40.362-62.776,93.883-63.234,150.892l-39.292,78.584c-1.756,3.512-0.513,7.784,2.856,9.804l36.429,21.858V440.36
                                c0,4.15,3.364,7.515,7.515,7.515h72.642v56.611c0,4.15,3.364,7.515,7.515,7.515s7.515-3.365,7.515-7.515V440.36
                                c0-4.15-3.364-7.515-7.515-7.515H75.147v-112.72c0-2.639-1.385-5.086-3.649-6.444l-34.111-20.467l36.966-73.932
                                c0.522-1.044,0.794-2.193,0.794-3.361c0-110.772,90.12-200.892,200.892-200.892s200.892,90.12,200.892,200.892
                                c0,62.247-28.164,119.964-77.27,158.356c-1.822,1.424-2.887,3.608-2.887,5.921v124.287c0,4.15,3.364,7.515,7.515,7.515
                                s7.515-3.365,7.515-7.515V383.823c50.992-41.246,80.157-102.228,80.157-167.901C491.961,158.247,469.502,104.024,428.719,63.242z"/>
                            </g>
                        </g>
                        <g>
                            <g>
                                <path className="box" d="M457.697,218.624l-48.094-48.094c-0.478-0.478-1.041-0.905-1.63-1.235l-70.735-39.789
                                    c-3.614-2.035-8.198-0.751-10.234,2.866c-2.034,3.617-0.751,8.199,2.866,10.233l59.091,33.239l-112.923,63.519l-112.922-63.519
                                l59.887-33.687c3.617-2.035,4.901-6.617,2.866-10.233c-2.035-3.618-6.617-4.901-10.234-2.866l-71.466,40.2
                                c-0.449,0.242-0.884,0.549-1.271,0.88l-56.11,48.094c-3.831,3.284-3.299,9.556,1.024,12.149l52.46,31.477v42.237
                                c0,2.714,1.465,5.218,3.831,6.55l128.251,72.141c1.525,0.856,3.304,1.14,5.017,0.832c0.848-0.152,1.671-0.442,2.421-0.87
                                l128.182-72.103c2.366-1.331,3.831-3.835,3.831-6.55v-47.046l44.445-26.667C460.372,227.908,461.1,222.027,457.697,218.624z
                                M104.485,222.857l44.202-37.887l113.626,63.915l-50.866,38.15L104.485,222.857z M396.776,299.7l-113.221,63.687V348.18
                                c0-4.15-3.364-7.515-7.515-7.515s-7.515,3.365-7.515,7.515v15.207l-113.221-63.687v-28.824l52.745,31.647
                                c2.591,1.556,5.958,1.382,8.374-0.432l52.102-39.076v49.096c0,4.15,3.364,7.515,7.515,7.515s7.515-3.365,7.515-7.515v-47.786
                                l43.704,37.461c2.429,2.081,6.014,2.385,8.756,0.738l60.761-36.456V299.7z M332.927,286.848l-43.843-37.579l113.922-64.081
                                l37.259,37.258L332.927,286.848z"/>
                            </g>
                        </g>
                        <g>
                            <g>
                                <path className="arrow" d="M347.345,165.62c-0.958-3.118-3.918-5.306-7.181-5.306h-24.548V71.64c0-4.15-3.364-7.515-7.515-7.515
                                    s-7.515,3.365-7.515,7.515v96.188c0,4.15,3.364,7.515,7.515,7.515h5.86l-37.923,23.702l-37.922-23.702h5.86
                                c4.15,0,7.515-3.365,7.515-7.515V71.64c0-4.15-3.364-7.515-7.515-7.515s-7.515,3.365-7.515,7.515v88.673h-24.548
                                c-3.353,0-6.299,2.22-7.223,5.444c-0.925,3.222,0.397,6.667,3.24,8.444l64.125,40.078c2.411,1.508,5.554,1.508,7.965,0
                                l64.125-40.078C347.003,172.416,348.334,168.837,347.345,165.62z"/>
                            </g>
                        </g>
                    </svg>
                </div>
                <div className="grid-block shrink vertical" style={{overflowY:"scroll"}}>
                    {this.renderCards()}
                </div>
            </div>
        );
    }
}