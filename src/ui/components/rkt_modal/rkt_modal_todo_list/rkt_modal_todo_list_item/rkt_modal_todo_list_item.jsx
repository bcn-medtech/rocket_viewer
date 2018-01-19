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
import RktButtonDeleteIcon from "./../../../rkt_button/rkt_button_delete_icon/rkt_button_delete_icon";

export default class RktModalTodoListItem extends Component {

    constructor() {

        super();
        this.state = {
            selectedItem: undefined
        };

        this.removeModalTodoListItem = this.removeModalTodoListItem.bind(this);
    }

    componentDidMount() { }

    removeModalTodoListItem(index) {
        var index = this.props.index;
        this.props.removeitem(index);
    }

    renderModalTodoListItem(modaltodolistitem) {
        return (
            <div className="grid-block"><p>{modaltodolistitem}</p></div>
        )
    }

    render() {
        var modaltodolistitem = this.props.modaltodolistitem;
        
        return (
            <div className="grid-block rkt-modal-todo-list-item shrink" >
                {this.renderModalTodoListItem(modaltodolistitem)}
                <div className="grid-block rkt-modal-todo-list-item-erase-button shrink">
                    <RktButtonDeleteIcon onClick={this.removeModalTodoListItem} className="grid-block shrink" />
                </div>
            </div>
        );
    }
}