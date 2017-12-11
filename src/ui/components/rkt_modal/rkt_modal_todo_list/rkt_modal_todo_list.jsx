import React, { Component } from 'react';

//modules
import { isObjectEmpty, isObjectAFunction } from './../../../../modules/rkt_module_object';
// //actions
// import { saveAsJSONObject } from "./rkt_modal_todo_list_actions";
//utils
import newId from './../../../../utils/newid.js';
//components
import CloseButton from "./../../rkt_button/rkt_button_delete_icon/rkt_button_delete_icon";
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
        this.onTodoListSave = this.onTodoListSave.bind(this);

        console.log("Modal construction")

    }

    componentDidMount() { }

    closeModal() {
        console.log("Close modal");
        this.setState({ 
            items: [],
            closed: true 
        });

        var myComponent = this;

        setTimeout(function(){ 
            myComponent.props.closemodaltodolist();
        }, 500);
        
    }

    renderModalInputField() {
        return (
            <div className="grid-block shrink rkt-modal-todo-list-input-area">
                <input type="text" value={this.state.input} className="grid-block rkt-modal-todo-list-input-field" placeholder="" onChange={this.onInputChange} />
                <div className="grid-block shrink">
                    <a className="rkt-modal-todo-list-submit-button" onClick={this.addTodoListItem}>
                        Submit
                    </a>
                </div>
            </div>
        )
    }

    onInputChange(e) {
        this.setState({ input: e.target.value.trim() });
    }

    addTodoListItem(e) {
        var items = this.state.items;
        var input = this.state.input;
        items.push(input);

        this.setState({
            items: items,
            input: ""
        });
    }

    renderModalTodoListItems() {

        var items = this.state.items;
        console.log(items);
        console.log(items.length);

        if (items.length > 0) {
            console.log("WE CAN RENDER THE LIST ITEMS!");
            return (
                <div className="grid-block vertical rkt-modal-todo-list-items">
                    {items.map((item) => {
                        console.log(item);
                        return(<h3>{item}</h3>)
                    })}
                </div>
            )
        }
    }

    renderModalLoadListButton() {
        var items = this.state.items;

        if (items.length > 0) {
            return (
                <div className="grid-block shrink">
                    <a className="grid-block rkt-modal-todo-list-load-button" onClick={this.onTodoListSave}>
                        Load list
                    </a>
                </div>
            );
        }
    }

    onTodoListSave(e) {
        var items = this.state.items;

        console.log("onTodoListSave");
        this.closeModal();
        this.props.ontodolistsave(items);
    }

    render() {

        var title = this.props.title;


        var style = "grid-block rkt-modal-todo-list shrink vertical";

        if (!this.state.closed) {
            style = "grid-block rkt-modal-todo-list shrink vertical";
        } else {
            style = "grid-block rkt-modal-todo-list-closed shrink vertical";
        }

        return (
            <div className={style} >
                <div className="grid-block shrink rkt-modal-todo-list-close-button">
                    <CloseButton onClick={this.closeModal} />
                </div>
                <div className="grid-block shrink rkt-modal-todo-list-title">
                    <h2>{title}</h2>
                </div>
                {this.renderModalInputField()}
                {this.renderModalTodoListItems()}
                {this.renderModalLoadListButton()}
            </div>
        );
    }
}