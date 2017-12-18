import React, { Component } from 'react';
//utils
import newId from './../../../../../utils/newid';
//components
import RktViewerImageSelectionSidebarDropTarget from "./rkt_viewer_image_selection_sidebar_drop_target/rkt_viewer_image_selection_sidebar_drop_target";

export default class RktViewerImageSelectionSidebar extends Component {

    constructor() {
        super();

        this.state = {}

        this.renderDicomPlaceholders = this.renderDicomPlaceholders.bind(this);

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
                            <RktViewerImageSelectionSidebarDropTarget
                                index={key}
                                sidebar_targets_item_info={sidebar_targets_item_info}
                                onimgdragdrop={this.props.onimgdragdrop}
                                key={newId()}
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
            <div className="grid-block medium-2 vertical image-selection-sidebar" >
                {this.renderDicomPlaceholders()}
            </div>
        );
    }
}