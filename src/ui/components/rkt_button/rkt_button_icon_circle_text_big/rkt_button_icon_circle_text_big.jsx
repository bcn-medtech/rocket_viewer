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
import {isObjectEmpty} from './../../../../modules/rkt_module_object.js';

export default class RktButtonIconCircleTextBig extends Component {

    constructor() {
        super();
        this.state = {};
    }

    onClickButton() {
        this.props.onclickbutton();
    }

    render() {

        var style;
        var tittle = this.props.text;
        var icon = this.props.icon;
        var selected = this.props.selected;

        if(selected === "true"){
            style = "grid-block shrink align-center rkt-button-icon-circle-text-big-selected"; 
        }else{
            style = "grid-block shrink align-center rkt-button-icon-circle-text-big"; 
        }

        return (
            <div className="grid-block vertical shrink">
                <div className="grid-block align-center">
                    <a>
                        <div className={style} onClick={this.onClickButton.bind(this)}>
                            {icon}
                        </div>
                    </a>
                </div>
                <div className="grid-block shrink align-center">
                    <label>{tittle}</label>
                </div>
            </div>
        );
    }
}