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
            openToolboxList: false
        };
    }

    componentDidMount() {

        if (isObjectAFunction(this.props.onsetcurrentitem)) {

            this.setState({
                currentItem: this.props.currentitem
            });
        }
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

    renderToolboxListItems(items) {
        var openToolboxList = this.state.openToolboxList;
        if (openToolboxList) {
            return (
                items.map((item) => {
                    return (
                        <RktToolboxListItem toolboxlistitem={item} onclicktoolboxlistitem={this.onClickToolboxListItem.bind(this)} key={newId()} />
                    )
                })
            );
        }
    }

    openAndCloseToolboxList(event) {
        this.setState({
            openToolboxList: !this.state.openToolboxList
        });
    }

    onClickToolboxListItem(toolboxListItem) {

        if (isObjectAFunction(this.props.onsetcurrentitem)) {

            this.setState({
                currentItem: toolboxListItem
            });

            this.props.onsetcurrentitem(toolboxListItem);
        }

        // When an item is clicked, its div changes of color
        // IT DOES NOT WORK FOR THE MOMENT
        if (this.state.currentItemID !== undefined) {

            console.log("Previous item");
            console.log(document.getElementById(this.state.currentItemID));
            document.getElementById(this.state.currentItemID).style.backgroundColor = "";

            this.changeBackgroundColorSelectedItem(toolboxListItem)
        }
        else {

            this.changeBackgroundColorSelectedItem(toolboxListItem)
        }
        // END when an item is clicked, its div changes its color

        if (isObjectAFunction(this.props.onclickitem)) {
            this.props.onclickitem(toolboxListItem);
        }
    }

    changeBackgroundColorSelectedItem(toolboxListItem) {
        document.getElementById(toolboxListItem).style.backgroundColor = "rgba(76, 175, 80, 0.2)";

        this.setState({
            currentItemID: toolboxListItem
        });
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
                <div className="grid-block vertical">
                    {this.renderToolboxListItems(items)}
                </div>
            </div>
        );
    }
}