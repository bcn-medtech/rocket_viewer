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

//import components
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, AreaChart, Brush, Area, ResponsiveContainer } from 'recharts';
//import actions
import { generateRandomColors } from './rkt_chart_line_actions';


export default class RktChartLine extends Component {

    constructor() {
        super();

        this.state = {

        }

        this.brush_loaded = false;
    }

    loadLines(lines, labels) {

        var colors = generateRandomColors(labels);

        this.setState({
            lines: lines,
            labels: labels,
            colors: colors
        })

    }

    componentDidMount() {

        var lines = this.props.lines;
        var labels = this.props.lines_names;

        this.loadLines(lines, labels);
    }

    /*componentWillReceiveProps(nextProps){

    }*/

    renderChart(lines, name, color) {

        var width = document.body.clientWidth;
        var brush_dom_element;

        if (!this.brush_loaded) {
            brush_dom_element = <Brush x={0} y={0} />;
            this.brush_loaded = true;
        }

        var divLabelChart = {
            color: color,
            marginTop: "50px"
        };

        return (
            <div className="grid-block rkt_chart_line_chart">
                <div style={divLabelChart} className="rkt_chart_line_chart_label">{name}</div>
                <LineChart width={width} height={150} data={lines} syncId="anyId"
                    margin={{ top: 40, right: 30, left: 0, bottom: 0 }}>
                    {brush_dom_element}
                    <Tooltip />
                    <CartesianGrid stroke="#ffffff26" strokeDasharray="5 5" />
                    <Line type='monotone' dataKey={name} stroke={color} fill={color} dot={false} />
                </LineChart>
            </div>
        )
    }

    renderCharts() {

        if (this.state.lines) {
            
            var lines = this.state.lines;
            var lines_names = this.state.labels;
            var colors = this.state.colors;

            return (

                <div className="grid-block vertical ">

                    {

                        lines_names.map((name) => {

                            return (

                                this.renderChart(lines, name, colors[name])

                            )
                        })
                    }

                </div>
            );
        }

    }

    renderChartsMenu() {

        if (this.state.lines) {
            
            var lines = this.props.lines;
            var lines_names = this.props.lines_names;
            var colors = generateRandomColors(lines_names);

            return (
                <div className="grid-block rkt_chart_line_bottom_menu">
                    hola que tal
                </div>
            );
        }
    }

    render() {

        return (
            <div id="rkt_chart_line" className="grid-block">

                {this.renderCharts()}
                {this.renderChartsMenu()}

            </div>
        );
    }
}


