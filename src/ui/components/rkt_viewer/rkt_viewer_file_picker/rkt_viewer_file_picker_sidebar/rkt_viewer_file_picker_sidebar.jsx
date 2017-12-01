import React, { Component } from 'react';

//components
import RktViewerFilePickerSidebarDropTarget from "./rkt_viewer_file_picker_sidebar_drop_target/rkt_viewer_file_picker_sidebar_drop_target";

//config
import config from "./../../../../../config/config_dicom_types.json";

export default class RktViewerFilePickerSidebar extends Component {

    constructor() {
        super();
        this.state = {};
        
        this.renderDicomPlaceholders = this.renderDicomPlaceholders.bind(this);
        
    }

    renderDicomPlaceholders() {
        if (config!==undefined) {
            
            let image_types = config.image_types;
            
            return (
                image_types.map((item, id) => {
                    //console.log(id);
                    return (
                        <RktViewerFilePickerSidebarDropTarget
                            index={id}
                            img_label={item.label}
                            onimgdragdrop={this.props.onimgdragdrop}
                            isAssigned={this.props.assigned_sidebar_targets[item.label]}
                        />                
                    )
                })
            );

        } else {
            return <p>Loading</p>
        } 
    }

    render() {
        return (
            <div className="grid-block medium-2 vertical file-picker-sidebar" >
                {this.renderDicomPlaceholders()}
            </div>
        );
    }
}