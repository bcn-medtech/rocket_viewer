import React, { Component } from 'react';

export default class RktButtonIconCircleTextLittle extends Component {

    constructor() {
        super();
        this.state = {};
    }

    onClickButton() {
        this.props.onclickbutton();
    }

    render() {

        var tittle = this.props.text;
        var icon = this.props.icon;

        return (
            <div className="grid-block vertical shrink">
                <div className="grid-block align-center">
                    <a>
                        <div className="grid-block shrink align-center rkt-button-icon-circle-text-little" onClick={this.onClickButton.bind(this)}>
                            {icon}
                        </div>
                    </a>
                </div>
                <div className="grid-block shrink align-center">
                    <label>{tittle}</label>
                </div>
            </div>
        );
    }
}