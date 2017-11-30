import React, {Component} from 'react';

export default class DeleteIcon extends Component {

    constructor() {
        super();

        this.handleClick = this.handleClick.bind(this);
        this.render = this.render.bind(this);

    }

    handleClick(ev){
        ev.preventDefault();
        ev.stopPropagation();
        this.props.onClick()
    }

    render() {
        return (
            <span className="fi-x-circle deleteIconButton" onClick={this.handleClick}></span>
        );
    }
}