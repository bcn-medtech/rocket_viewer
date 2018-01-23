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
import { generateRandomColors, initLinesToShow,intChartOptions } from './rkt_chart_line_actions';


export default class RktChartLine extends Component {

    constructor() {
        super();

        this.state = {

        }

        this.brush_loaded = false;
    }

    loadLines(lines, labels) {

        var colors = generateRandomColors(labels);
        var lines_to_show = initLinesToShow(labels);
        var charts_options = intChartOptions();

        this.setState({
            lines: lines,
            labels: labels,
            colors: colors,
            lines_to_show: lines_to_show,
            charts_options: charts_options
        });

        this.brush_loaded = false;

    }

    componentDidMount() {

        var lines = this.props.lines;
        var labels = this.props.lines_names;
        this.loadLines(lines, labels);
    }

    /*componentWillReceiveProps(nextProps){

    }*/

    selectItemToShow(item) {

        var lines_to_show = this.state.lines_to_show;

        if (item in lines_to_show) {

            lines_to_show[item] = !lines_to_show[item];

            this.setState({
                lines_to_show: lines_to_show
            });
        }
    }

    updateChartOptions(option){

        var charts_options = this.state.charts_options;

        if(option in charts_options){

            charts_options[option] = !charts_options[option];

            this.setState({
                charts_options:charts_options
            });

        }
    }

    renderChart(lines, name, color, options) {

        var width = document.body.clientWidth;
        
        var cartesian_grid;
        var axis_x;
        var axis_y;

        //var brush_dom_element;
        /*if (!this.brush_loaded) {
            brush_dom_element = <Brush x={0} y={0} />;
            this.brush_loaded = true;
        }*/

        var divLabelChart = {
            color: color,
            marginTop: "50px"
        };

        

        if(options.show_cartesian_grid){
            cartesian_grid = <CartesianGrid stroke="#ffffff26" strokeDasharray="5 5" />;
        }

        if(options.show_axis){
            axis_x = <XAxis/>
            axis_y = <YAxis/>
        }   

        return (
            <div className="grid-block rkt_chart_line_chart">
                <div style={divLabelChart} className="rkt_chart_line_chart_label">{name}</div>
                <LineChart width={width} height={150} data={lines} syncId="anyId"
                    margin={{ top: 40, right: 30, left: 0, bottom: 0 }}>
                    {/*brush_dom_element*/}
                    <Tooltip />
                    {cartesian_grid}
                    {axis_x}
                    {axis_y}
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
            var lines_to_show = this.state.lines_to_show;
            var charts_options = this.state.charts_options;

            return (

                <div className="grid-block vertical ">

                    {

                        lines_names.map((name) => {

                            if (lines_to_show[name]) {

                                return (

                                    this.renderChart(lines, name, colors[name],charts_options)

                                )
                            }

                        })
                    }

                </div>
            );
        }

    }

    renderChartsMenu() {

        if (this.state.labels) {

            var labels = this.state.labels;
            var colors = this.state.colors;
            var lines_to_show = this.state.lines_to_show;

            return (
                <div className="grid-block">

                    {
                        labels.map((label) => {

                            var style;

                            if (lines_to_show[label]) {
                                style = {
                                    color: colors[label]
                                }
                            }

                            return (
                                <a><div style={style} className="rkt_chart_line_bottom_menu_button" onClick={this.selectItemToShow.bind(this, label)}>{label}</div></a>
                            )
                        })

                    }

                </div>
            );
        }
    }

    renderChartsMenuOptions() {

        if (this.state.labels) {

            var charts_options = this.state.charts_options;
            var button_show_cartesian_grid = <a><div className="grid-block rkt_chart_line_bottom_menu_button" onClick={this.updateChartOptions.bind(this,"show_cartesian_grid")}>Show cartesian grid</div></a>;
            var button_show_axis = <a><div className="grid-block rkt_chart_line_bottom_menu_button" onClick={this.updateChartOptions.bind(this,"show_axis")}>Show Axis</div></a>;

            if(charts_options.show_cartesian_grid){
                button_show_cartesian_grid = <a><div className="grid-block rkt_chart_line_bottom_menu_button_selected" onClick={this.updateChartOptions.bind(this,"show_cartesian_grid")}>Show cartesian grid</div></a>;
            }

            if(charts_options.show_axis){
                button_show_axis = <a><div className="grid-block rkt_chart_line_bottom_menu_button_selected" onClick={this.updateChartOptions.bind(this,"show_axis")}>Show Axis</div></a>;
            }

            return (
                <div className="grid-block shrink">
                    {button_show_cartesian_grid}
                    {button_show_axis}
                </div>
            );
        }
    }

    render() {

        return (
            <div id="rkt_chart_line" className="grid-block">

                {this.renderCharts()}
                <div className="grid-block rkt_chart_line_bottom_menu">
                    {this.renderChartsMenu()}
                    {this.renderChartsMenuOptions()}
                </div>

            </div>
        );
    }
}


