import React, { Component } from 'react';

export default class RktToolboxTableInputsItem extends Component {

    constructor() {
        super();
        this.state = {
            
        };
    }

    onChangeInput(event) {

        this.setState({
            value:event.target.value
        })
    }

    getValue(){
        return this.state.value;
    }

    render() {

        var type = this.props.toolboxtableinputsitem.type;
        var name = this.props.toolboxtableinputsitem.name;
        var extra_info_name = this.props.toolboxtableinputsitem.extra_info_name;
        var placeholder = this.props.toolboxtableinputsitem.placeholder;

        return (
            <div className="grid-block vertical shrink rkt-toolbox-table-inputs-item">
                <label>{name+" "+extra_info_name}</label>
                <input type={type}
                    placeholder={placeholder}
                    onChange={this.onChangeInput.bind(this)}
                    value={this.state.value} />
            </div>
        );
    }
}