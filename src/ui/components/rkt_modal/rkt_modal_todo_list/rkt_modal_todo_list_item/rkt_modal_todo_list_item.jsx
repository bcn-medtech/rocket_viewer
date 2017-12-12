import React, { Component } from 'react';

//modules
//import { isObjectEmpty, isObjectAFunction } from './../../../../modules/rkt_module_object';
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
        this.props.removeitem(index);
    }

    renderModalTodoListItem(modaltodolistitem) {
        return (
            <p>{modaltodolistitem}</p>
        )
    }

    render() {
        var modaltodolistitem = this.props.modaltodolistitem;
        var index = this.props.index;

        return (
            <div className="grid-block rkt-modal-todo-list-item shrink" >
                {this.renderModalTodoListItem(modaltodolistitem)}
                <div className="grid-block shrink rkt-modal-todo-list-item-erase-button">
                    <RktButtonDeleteIcon onClick={this.removeModalTodoListItem} />
                </div>
            </div>
        );
    }
}