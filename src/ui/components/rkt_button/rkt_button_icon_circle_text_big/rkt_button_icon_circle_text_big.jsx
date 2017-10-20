import React, { Component } from 'react';
import {isObjectEmpty} from './../../../../modules/rkt_module_object.js';

export default class RktButtonIconCircleTextBig extends Component {

    constructor() {
        super();
        this.state = {};
    }

    onClickButton() {
        this.props.onclickbutton();
    }

    render() {

        var style;
        var tittle = this.props.text;
        var icon = this.props.icon;
        var selected = this.props.selected;

        if(selected === "true"){
            style = "grid-block shrink align-center rkt-button-icon-circle-text-big-selected"; 
        }else{
            style = "grid-block shrink align-center rkt-button-icon-circle-text-big"; 
        }

        return (
            <div className="grid-block vertical shrink">
                <div className="grid-block align-center">
                    <a>
                        <div className={style} onClick={this.onClickButton.bind(this)}>
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