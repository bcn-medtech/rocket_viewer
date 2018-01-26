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
//Components
import RktChartLine from './../../rkt_chart/rkt_chart_line/rkt_chart_line';
//actions
import {readSignalsFromBlob,readSignalsFromURL} from './rkt_viewer_ecg_actions';
//modules
import {isObjectEmpty} from './../../../../modules/rkt_module_object';

export default class RktViewerECG extends Component {

    constructor() {
        super();

        this.state = {
            signals:false
        };

    }

    loadSignalsFromLocalhost(files){

        var myComponent = this;
        
        readSignalsFromBlob(files,function(result){
            
            if(result){

                myComponent.setState({
                    signals:result
                });

            }

        });

    }

    loadSignalsFromURL(url){

        var myComponent = this;

        readSignalsFromURL(url,function(result){

            if(result){

                myComponent.setState({
                    signals:result
                });
            }
        });
    }

    componentDidMount() {
        
        var url = this.props.url;
        var files = this.props.files;

        if(!isObjectEmpty(url)){

            this.loadSignalsFromURL(url);
        }else{
            this.loadSignalsFromLocalhost(files);
        }

    }

    componentWillReceiveProps(nextProps) {

        var files = nextProps.files;
        var url = nextProps.url;
        this.loadSignalsFromLocalhost(files);

    }

    renderCharts(){

        var signals = this.state.signals;
        
        if(signals){
            var curves = signals.signals;
            var curves_names = signals.signals_names;
            return (<RktChartLine lines={curves} lines_names={curves_names}/>)
        }

    }

    render() {

        return (
            <div className="grid-block" id="ecg-viewer">
                <div className="grid-block">{this.renderCharts()}</div>
            </div>
        );
    }
}