import React, { Component } from 'react';

//components
import RktModalTodoList from "./../../../rkt_modal/rkt_modal_todo_list/rkt_modal_todo_list";
import RktViewerFilePickerSidebarDropTarget from "./rkt_viewer_file_picker_sidebar_drop_target/rkt_viewer_file_picker_sidebar_drop_target";

export default class RktViewerFilePickerSidebar extends Component {

    constructor() {
        super();

        this.state = {
            isModalTodoListOpen: false
        }

        this.openAndCloseModalTodoList = this.openAndCloseModalTodoList.bind(this);
        this.renderModalTodoList = this.renderModalTodoList.bind(this);
        this.saveNewConfigList = this.saveNewConfigList.bind(this);
        this.renderDicomPlaceholders = this.renderDicomPlaceholders.bind(this);

    }

    openAndCloseModalTodoList() {
        this.setState({
            isModalTodoListOpen: !this.state.isModalTodoListOpen
        });
    }

    renderModalTodoList() {
        if (this.state.isModalTodoListOpen) {
            return (
                <RktModalTodoList
                    title={"Write DICOM typologies"}
                    ontodolistsave={this.saveNewConfigList}
                    closemodaltodolist={this.openAndCloseModalTodoList}
                />
            );
        }
    }

    saveNewConfigList(new_config_items) {
        var new_config = {};
        new_config["image_types"] = [];

        for (var i = 0; i < new_config_items.length; i++) {
            var current_label = new_config_items[i];
            new_config["image_types"].push({ "label": current_label, "needCalibration": true });
        }

        this.props.onconfigchange(new_config);
    }

    renderDicomPlaceholders() {
        var sidebar_targets_info = this.props.sidebar_targets_info;

        if (sidebar_targets_info) {

            var keys_sidebar_targets_info = Object.keys(sidebar_targets_info); // ["0", "1", ... , "n"]

            return (
                <div className="grid-block vertical drop-targets-items">
                    {keys_sidebar_targets_info.map((key) => {

                        var sidebar_targets_item_info = this.props.sidebar_targets_info[key];
                        // sidebar_targets_item_info = {"index":key, "label": ?, "isAssigned":true/false, "index_source":?};

                        return (
                            <RktViewerFilePickerSidebarDropTarget
                                index={key}
                                sidebar_targets_item_info={sidebar_targets_item_info}
                                onimgdragdrop={this.props.onimgdragdrop}
                            />
                        )
                    })}

                </div>

            );

        } else {
            return <p>Loading</p>
        }
    }

    render() {
        return (
            <div className="grid-block medium-2 vertical file-picker-sidebar" >
                <div className="grid-block shrink" style={{ justifyContent: "center", padding:"10px" }}>
                    <a className="grid-block shrink open-modal-todo-list-button" onClick={this.openAndCloseModalTodoList}>
                        SET DICOM TYPOLOGIES
                    </a>
                </div>
                {this.renderModalTodoList()}
                {this.renderDicomPlaceholders()}
            </div>
        );
    }
}