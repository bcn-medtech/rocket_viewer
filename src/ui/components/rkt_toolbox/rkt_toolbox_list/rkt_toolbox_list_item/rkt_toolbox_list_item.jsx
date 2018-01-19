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

export default class RktToolboxListItem extends Component {

    constructor() {
        super();
        this.state = {};
    }


    onClickToolboxListItem(toolboxListItem) {

        this.props.onclicktoolboxlistitem(toolboxListItem);
    }

    renderToolboxListItem(toolboxListItem) {
        return (
            <div className={this.props.isSelected ? "grid-block shrink rkt-toolbox-list-item selected" : "grid-block shrink rkt-toolbox-list-item"}
                id={toolboxListItem}
                onClick={this.onClickToolboxListItem.bind(this, toolboxListItem)}>
                <a>{toolboxListItem}</a>
            </div>
        );
    }

    render() {
        var toolboxListItem = this.props.toolboxlistitem;

        return (
            <div className="grid-block vertical shrink">
                {this.renderToolboxListItem(toolboxListItem)}
            </div>
        );
    }
}