/*
# Rocket viewer is (c) BCNMedTech, UNIVERSITAT POMPEU FABRA
#
# Rocket viewer is free software: you can redistribute it and/or modify
# it under the terms of the GNU Affero General Public License as
# published by the Free Software Foundation, either version 3 of the
# License, or (at your option) any later version.
#
# Rocket viewer is distributed in the hope that it will be useful,
# but WITHOUT ANY WARRANTY; without even the implied warranty of
# MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
# GNU Affero General Public License for more details.
#
# You should have received a copy of the GNU Affero General Public License
# along with this program.  If not, see <http://www.gnu.org/licenses/>.
#
# Authors:
# Carlos Yagüe Méndez
# María del Pilar García
# Daniele Pezzatini
# Contributors: 
# Sergio Sánchez Martínez
*/

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
            submitted_inputs: {}
        };
    }

    componentDidMount() {

    }

    componentWillReceiveProps(nextProps) {

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
        )
    }

    renderToolboxTableInputsItems(items) {

        return (
            items.map((item) => {
                return (
                    <RktToolboxTableInputsItem toolboxtableinputsitem={item} key={newId()} ref={item.name} />
                )
            })
        );
    }

    onSubmittingInputs(event) {
        
        // we obtain values of the different input forms
        var myComponent = this;
        var names = Object.keys(myComponent.refs);
        var variables = [];

        for (var i = 0; i < names.length; i++) {

            var name = names[i];
            var value = myComponent.refs[name].state.value;
            var variable = {};

            variable["name"] = name;
            variable["value"] = value;

            variables.push(variable);

        }

        // and send them to the main component
        myComponent.props.onsubmitinputs(variables, function (if_valid_inputs) {

            // once values are submitted and send to the main component, 
            // the toolbox table list is updated

            // if the values were valid
            if (if_valid_inputs) {

                // we update the placeholder of the different items -->
                // the new placeholders will be the submitted values
                myComponent.updatePlaceholdersItems();
            }

            // finally, values of the items will be always erased
            myComponent.eraseValuesItems();

        });

    }

    updatePlaceholdersItems() {
        var myComponent = this;
        var names = Object.keys(myComponent.refs);

        for (var i = 0; i < names.length; i++) {

            var name = names[i];
            var value = myComponent.refs[name].state.value;

            // we update the placeholder of the different items
            myComponent.refs[name].props.toolboxtableinputsitem.placeholder = value;

        }
    }

    eraseValuesItems() {
        var myComponent = this;
        var names = Object.keys(myComponent.refs);

        for (var i = 0; i < names.length; i++) {

            var name = names[i];
            // values of the items are erased
            myComponent.refs[name].setState({
                value: ""
            });

        }
    }

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