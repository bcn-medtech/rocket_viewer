import React, { Component } from 'react';

//modules
import { isObjectEmpty, isObjectAFunction } from './../../../../modules/rkt_module_object';
//utils
import newId from './../../../../utils/newid.js';
//components
import RktToolboxListItem from './rkt_toolbox_list_item/rkt_toolbox_list_item';

export default class RktToolboxList extends Component {

    constructor() {

        console.log("constructor");
        super();
        this.state = {
            currentItem: {},
            currentItemID: undefined,
            openToolboxList: false
        };
    }

    componentDidMount() {

        // this.setState({
        //     currentItem: {},
        //     currentItemID: undefined,
        //     openToolboxList: false
        // });

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
            openToolboxList: !this.state.openToolboxList
        });
    }

    renderToolboxListItems(items, onclickitem) {
        var openToolboxList = this.state.openToolboxList;

        if (openToolboxList) {

            if ((this.props.extratoolboxinfo) && (this.props.addextratoolboxfunction)) {
                // we add an extra toolbox to the current toolbox list
                var extra_toolbox_info = this.props.extratoolboxinfo;

                return (
                    <div className="grid-block vertical rkt-toolbox-list-content">
                        <div className="grid-block vertical rkt-toolbox-list-items">
                            {items.map((item) => {
                                return (
                                    <RktToolboxListItem toolboxlistitem={item} onclicktoolboxlistitem={this.onClickToolboxListItem.bind(this)} key={newId()} />
                                )
                            })}
                        </div>
                        <div className="grid-block vertical extra-rkt-toolbox">
                            {this.props.addextratoolboxfunction(extra_toolbox_info)}
                        </div>
                    </div>
                );

            } else {
                // we render a default toolbox list (that is, only its items)
                return (
                    <div className="rkt-toolbox-list-content">
                        {items.map((item) => {
                            return (
                                <RktToolboxListItem toolboxlistitem={item} onclicktoolboxlistitem={this.onClickToolboxListItem.bind(this)} key={newId()} />
                            )
                        })}
                    </div>
                );
            }
        }
    }

    onClickToolboxListItem(toolboxListItem) {

        // different functions (defined in this.props.onclickitem) 
        // are executed when clicking an item
        if (this.props.onclickitem.length > 0) {
            var functions_to_execute = this.props.onclickitem;
            var to_execute;

            for (var i = 0; i < functions_to_execute.length; i++) {
                to_execute = functions_to_execute[i];

                if (isObjectAFunction(to_execute)) {
                    to_execute(toolboxListItem);
                }
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