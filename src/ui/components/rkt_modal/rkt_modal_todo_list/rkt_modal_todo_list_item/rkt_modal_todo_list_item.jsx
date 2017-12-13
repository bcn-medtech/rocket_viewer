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