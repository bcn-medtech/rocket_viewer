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
import { isObjectEmpty, isObjectAFunction } from './../../../../modules/rkt_module_object';
//utils
import newId from './../../../../utils/newid.js';
//components
import RktToolboxListItem from './rkt_toolbox_list_item/rkt_toolbox_list_item';

export default class RktToolboxList extends Component {

    constructor() {

        super();
        this.state = {
            currentItem: {},
            currentItemID: undefined,
            display_extra_toolbox: false,
            isToolboxListOpen: false,
        };

    }

    componentDidMount() {

    }

    componentWillReceiveProps(nextProps) {

        if (!isObjectEmpty(this.state.currentItem)) {
            if (this.state.currentItem.id !== nextProps.currentitem.id) {
                this.setState({
                    currentItem: nextProps.currentitem
                });
            }
        }
    }

    openAndCloseToolboxList(event) {

        this.setState({
            isToolboxListOpen: !this.state.isToolboxListOpen
        });

    }

    renderToolboxListItems(items) {

        // we will only render items if we ask to open the toolbox list
        if (this.state.isToolboxListOpen) {

            // If this toolbox list can have an extra toolbox
            if ((this.props.extratoolboxinfo) && (this.props.addextratoolboxfunction)) {

                // and we ask it to display it
                if (this.state.display_extra_toolbox) {

                    // we add the extra toolbox
                    var extra_toolbox_info;

                    if (this.state.updated_extra_info !== undefined) {
                        extra_toolbox_info = this.state.updated_extra_info;
                    } else {
                        extra_toolbox_info = this.props.extratoolboxinfo;
                    }

                    return (
                        <div className="grid-block vertical rkt-toolbox-list-content">
                            <div className="grid-block vertical rkt-toolbox-list-items">
                                {items.map((item) => {
                                    return (
                                        <RktToolboxListItem
                                            toolboxlistitem={item}
                                            isSelected={item === this.state.selectedImg}
                                            onclicktoolboxlistitem={this.onClickToolboxListItem.bind(this)}
                                            key={newId()}
                                        />
                                    )
                                })}
                            </div>
                            <div className="grid-block vertical extra-rkt-toolbox">
                                {this.props.addextratoolboxfunction(extra_toolbox_info)}
                            </div>
                        </div>
                    );

                } else {

                    // if we do not ask to display the extra toolbox, we render a default toolbox list      
                    return (
                        <div className="rkt-toolbox-list-content">
                            <div className="grid-block vertical rkt-toolbox-list-items">
                                {items.map((item) => {
                                    return (
                                        <RktToolboxListItem
                                            toolboxlistitem={item}
                                            isSelected={item === this.state.selectedImg}
                                            onclicktoolboxlistitem={this.onClickToolboxListItem.bind(this)}
                                            key={newId()}
                                        />
                                    )
                                })}
                            </div>
                        </div>
                    );
                }

            } else {

                // if the toolbox list cannot have an extra toolbox, we display a default toolbox list
                return (
                    <div className="rkt-toolbox-list-content">
                        <div className="grid-block vertical rkt-toolbox-list-items">
                            {items.map((item) => {
                                return (
                                    <RktToolboxListItem
                                        toolboxlistitem={item}
                                        isSelected={item === this.state.selectedImg}
                                        onclicktoolboxlistitem={this.onClickToolboxListItem.bind(this)}
                                        key={newId()}
                                    />
                                )
                            })}
                        </div>
                    </div>
                );

            }
        }
    }

    onClickToolboxListItem(toolboxListItem) {
        var myComponent = this;
        var main_component_function;

        this.setState({
            selectedImg: toolboxListItem
        });

        // Two cases
        if ((myComponent.props.extratoolboxinfo) && (myComponent.props.onclickitem.length > 0)) {
            // if the toolbox list has an extra toolbox, two functions will be applied when
            // clicking an item:
            // 1st: a function that changes info in the main component
            // 2nd: another function that retrieves the ToolboxListItem an displays its info in the extra toolbox

            // 1st:
            main_component_function = myComponent.props.onclickitem[0];
            main_component_function(toolboxListItem);

            // 2nd:
            var retrieve_info_extra_toolbox_function = myComponent.props.onclickitem[1];
            var extra_toolbox_info = myComponent.props.extratoolboxinfo;

            retrieve_info_extra_toolbox_function(toolboxListItem, extra_toolbox_info, function (updated_info) {

                if (updated_info) {
                    myComponent.setState({
                        updated_extra_info: updated_info,
                        display_extra_toolbox: true
                    });

                } else {

                    // if there is no updated info, the toolbox list will not display the extra toolbox
                    myComponent.setState({
                        display_extra_toolbox: false
                    });
                }

            });


        } else {

            if (this.props.onclickitem.length === 1) {
                main_component_function = myComponent.props.onclickitem[0];
                main_component_function(toolboxListItem);
            }
        }
    }

    render() {

        var title = this.props.title;
        var items = this.props.items;

        var numItems = items.length;

        return (
            <div className="grid-block shrink vertical" >
                <div className="grid-block shrink rkt-toolbox-list-title" onClick={this.openAndCloseToolboxList.bind(this)}>
                    <a>{title}&nbsp;({numItems})</a>
                </div>
                {this.renderToolboxListItems(items)}
            </div>
        );
    }
}