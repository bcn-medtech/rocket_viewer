import React, { Component } from 'react';

export default class RktButtonSquareText extends Component {

    constructor() {
        super();
        this.state = {};
    }

    onClickRktButtonSquareText() {
        this.props.onclickbutton();
    }

    render() {

        let text = this.props.text;

        return (
            <a onClick={this.onClickRktButtonSquareText.bind(this)} className="grid-block">
                <div className="grid-block vertical rkt-button-square-text">
                    <div className="grid-block shrink align-center" >{text}</div>
                </div>
            </a>

        );
    }
}