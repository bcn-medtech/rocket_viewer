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
import {readSignals} from './rkt_viewer_ecg_actions';

export default class RktViewerECG extends Component {

    constructor() {
        super();

        this.state = {
            signal:false
        };
    }

    loadSignals(files){

        var myComponent = this;
        
        readSignals(files,function(result){
            
            if(result){

                myComponent.setState({
                    signals:result
                });

            }

        });

    }

    componentDidMount() {
        
        var files = this.props.files;
        this.loadSignals(files);

    }

    componentWillReceiveProps(nextProps) {

        var files = nextProps.files;
        this.loadSignals(files);

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
            <div className="grid-block">
                {this.renderCharts()}
            </div>
        );
    }
}