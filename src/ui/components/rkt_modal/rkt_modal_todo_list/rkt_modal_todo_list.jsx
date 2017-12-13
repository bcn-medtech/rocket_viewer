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
            input: undefined,
            items: [],
            closed: false,
        };

        this.closeModal = this.closeModal.bind(this);
        this.onInputChange = this.onInputChange.bind(this);
        this.addTodoListItem = this.addTodoListItem.bind(this);
        this.removeTodoListItem = this.removeTodoListItem.bind(this);
        this.onTodoListSave = this.onTodoListSave.bind(this);

    }

    componentDidMount() { }

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

    renderModalInputField() {

        // The user has to *write* an item
        var submit_button_id;
        if ((this.state.input === undefined) || (this.state.input.trim() === "")) submit_button_id = "disabled-button";
        else submit_button_id = "enabled-button";

        return (
            <div className="grid-block shrink rkt-modal-todo-list-input-area">
                <input className="grid-block rkt-modal-todo-list-input-field"
                    type="text"
                    value={this.state.input}
                    placeholder={""}
                    onChange={this.onInputChange}
                />
                <div className="grid-block shrink">
                    <a className="rkt-modal-todo-list-submit-button" id={submit_button_id} onClick={this.addTodoListItem}>
                        Submit
                    </a>
                </div>
            </div>
        )
    }

    addTodoListItem(e) {
        var items = this.state.items;
        var input = this.state.input.trim();

        var isNewElement = lookForElementInArray(input, items);

        if (isNewElement) items.push(input); // we add the new item to the "items" array
        else alert("You cannot repeat items in the list");

        this.setState({
            items: items,
            input: ""
        });

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


    renderModalLoadListButton() {
        var items = this.state.items;

        // There has to be a list with items
        var load_button_id;
        if (items.length === 0) load_button_id = "disabled-button";
        else if (items.length > 0) load_button_id = "enabled-button";

        return (
            <div className="grid-block shrink" style={{ justifyContent: "center", padding: "10px", bottom: "0px" }}>
                <a className="grid-block shrink rkt-modal-todo-list-load-button" id={load_button_id} onClick={this.onTodoListSave}>
                    LOAD LIST
                    </a>
            </div>
        );
    }

    onTodoListSave(e) {
        var items = this.state.items;

        this.closeModal();
        this.props.ontodolistsave(items);
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
                <div className="grid-block shrink rkt-modal-todo-list-title">
                    <h2>{title}</h2>
                </div>
                {this.renderModalInputField()}
                <div className="grid-block">
                    {this.renderModalTodoListItems()}
                </div>
                {this.renderModalLoadListButton()}
            </div>
        );
    }
}