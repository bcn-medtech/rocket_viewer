import React, { Component } from 'react';

export default class RktToolboxTableInputsItem extends Component {

    constructor() {
        super();
        this.state = {
            
        };
    }

    onChangeInput() {

    } // I'M NOT SURE IF I WILL NEED A "onChangeInput" FUNCTION

    render() {

        var type = this.props.toolboxtableinputsitem.type;
        var name = this.props.toolboxtableinputsitem.name;
        var extra_info_name = this.props.toolboxtableinputsitem.extra_info_name;
        var placeholder = this.props.toolboxtableinputsitem.placeholder;

        return (
            <div className="grid-block vertical shrink rkt-toolbox-table-inputs-item" >
                <label>{name+" "+extra_info_name}</label>
                <input type={type}
                    placeholder={placeholder}
                    onChange={this.onChangeInput.bind(this)} />
            </div>
        );
    }
}