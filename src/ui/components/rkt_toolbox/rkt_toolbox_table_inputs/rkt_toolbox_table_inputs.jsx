import React, { Component } from 'react';

//modules
//import { isObjectEmpty, isObjectAFunction } from './../../../../modules/rkt_module_object';
//utils
import newId from './../../../../utils/newid.js';
// components
import RktToolboxTableInputsItem from './rkt_toolbox_table_inputs_item/rkt_toolbox_table_inputs_item';

export default class RktToolboxTableInputs extends Component {

    constructor() {
        super();
        this.state = {
            //openToolboxTableInputs: true
        };
    }

    componentDidMount() {

        // if (isObjectAFunction(this.props.onsetcurrentitem)) {

        //     this.setState({
        //         currentItem: this.props.currentitem
        //     });
        // }
    }

    componentWillReceiveProps(nextProps) {

        // if (!isObjectEmpty(this.state.currentItem)) {
        //     if (this.state.currentItem.id !== nextProps.currentitem.id) {
        //         this.setState({
        //             currentItem: nextProps.currentitem
        //         });
        //     }
        // }
    }

    renderToolboxTableInputs(title, items) {

        return (
            <div className="grid-block shrink vertical" >
                <div className="grid-block shrink rkt-toolbox-table-inputs-title" >
                    <label>{title}</label>
                </div>
                {this.renderToolboxTableInputsItems(items)}
                <div className="grid-block vertical rkt-toolbox-table-inputs-submit-button" onClick={this.onSubmittingInputs.bind(this)}>
                    <a>Submit values</a>
                </div>
            </div>
        );

    }
    renderToolboxTableInputsItems(items) {

        return (
            items.map((item) => {
                return (
                    <RktToolboxTableInputsItem toolboxtableinputsitem={item} key={newId()} />
                )
            })
        );
    }

    onSubmittingInputs(event) {
        // obtain values of the different input forms
        // var items = this.props.items;

        // items.map((item) => {
        //     return (
        //         <RktToolboxTableInputsItem toolboxtableinputsitem={item} key={newId()} />
        //     )
        // }) // HOW?
        // execute the function of vtk actions "changeMinMaxLabels"

    } // TO DO

    render() {

        var title = this.props.title;
        var items = this.props.items;

        return (
            <div className="grid-block vertical rkt-toolbox-table-inputs-items">
                {this.renderToolboxTableInputs(title, items)}
            </div>

        );
    }
}