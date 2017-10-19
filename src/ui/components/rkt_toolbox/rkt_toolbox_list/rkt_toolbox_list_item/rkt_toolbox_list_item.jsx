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
            <div className="grid-block shrink rkt-toolbox-list-item" id={toolboxListItem} onClick={this.onClickToolboxListItem.bind(this, toolboxListItem)}>
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