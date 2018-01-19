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

//actions
import { lookForElementInArray } from "./rkt_modal_todo_list_actions";
//utils
import newId from './../../../../utils/newid.js';
//components
import RktButtonDeleteIcon from "./../../rkt_button/rkt_button_delete_icon/rkt_button_delete_icon";
import RktModalTodoListItem from './rkt_modal_todo_list_item/rkt_modal_todo_list_item';

export default class RktModalTodoList extends Component {

    constructor() {

        super();
        this.state = {
            input: "",
            items: [],
            closed: false,
        };

        this.closeModal = this.closeModal.bind(this);
        this.onInputChange = this.onInputChange.bind(this);
        this.addTodoListItem = this.addTodoListItem.bind(this);
        this.removeTodoListItem = this.removeTodoListItem.bind(this);
        this.onClickLoadListButton = this.onClickLoadListButton.bind(this);

    }

    componentDidMount() {
        var items = JSON.parse(localStorage.getItem("config-image-selection"));

        this.setState({
            items: items
        });
    }

    closeModal() {
        this.setState({
            items: [],
            closed: true
        });

        var myComponent = this;

        setTimeout(function () {
            myComponent.props.closemodaltodolist();
        }, 500);
    }

    onInputChange(e) {
        this.setState({ input: e.target.value });
    }

    addTodoListItem(e) {
        e.preventDefault();
        var items = this.state.items;

        if ((this.state.input === undefined) || (this.state.input.trim() === "")) alert("You have to write an item");
        else {
            var input = this.state.input.trim();
            var isNewElement = lookForElementInArray(input, items);

            if (isNewElement) items.push(input); // we add the new item to the "items" array
            else alert("You cannot repeat items in the list");
        }

        this.setState({
            items: items,
            input: ""
        });
    }

    renderModalInputField() {
        return (
            <div className="grid-block shrink rkt-modal-todo-list-input-area">
                <form className="grid-block" onSubmit={this.addTodoListItem}>
                    <input className="grid-block"
                        type="text"
                        value={this.state.input}
                        placeholder={""}
                        onChange={this.onInputChange} />
                </form>
            </div>
        )
    }

    removeTodoListItem(index) {
        var items = this.state.items;
        items.splice(index, 1);

        this.setState({
            items: items
        });
    }

    renderModalTodoListItems() {
        var items = this.state.items;

        if (items.length > 0) {
            return (
                <div className="grid-block vertical rkt-modal-todo-list-items">
                    {items.map((item, key) => {
                        return (
                            <RktModalTodoListItem
                                key={newId()}
                                index={key}
                                modaltodolistitem={item}
                                removeitem={this.removeTodoListItem}
                            />
                        )
                    })}
                </div>
            );
        }
    }

    onClickLoadListButton() {
        var items = this.state.items;

        this.closeModal();
        this.props.onClickLoadListButton(items);
    }

    renderModalLoadListButton() {
        var items = this.state.items;

        // There has to be a list with items
        var load_button_id;
        if (items.length === 0) load_button_id = "disabled-button";
        else if (items.length > 0) load_button_id = "enabled-button";

        return (
            <div className="grid-block shrink" style={{ justifyContent: "center", padding: "10px", bottom: "0px" }}>
                <a className="grid-block shrink rkt-modal-todo-list-load-button" id={load_button_id} onClick={this.onClickLoadListButton}>
                    LOAD LIST
                </a>
            </div>
        );
    }

    render() {

        var title = this.props.title;

        var modal_id = "rkt-modal-todo-list-open";

        if (!this.state.closed) {
            modal_id = "rkt-modal-todo-list-open";
        } else {
            modal_id = "rkt-modal-todo-list-closed";
        }

        return (
            <div className="grid-block rkt-modal-todo-list shrink vertical" id={modal_id} >
                <div className="grid-block shrink rkt-modal-todo-list-close-button">
                    <RktButtonDeleteIcon onClick={this.closeModal} />
                </div>
                <div className="grid-block">
                    <div className="grid-block small-2">&nbsp;</div>
                    <div className="grid-block vertical">
                        <div className="grid-block shrink rkt-modal-todo-list-title">
                            <h2>{title}</h2>
                        </div>
                        {this.renderModalInputField()}
                        <div className="grid-block">
                            {this.renderModalTodoListItems()}
                        </div>
                        {this.renderModalLoadListButton()}
                    </div>
                    <div className="grid-block small-2">&nbsp;</div>
                </div>
            </div>
        );
    }
}