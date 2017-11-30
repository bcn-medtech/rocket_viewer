import React, { Component } from 'react';
import { DragDropContext } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';

// components
import RktViewerFilePickerSidebar from './rkt_viewer_file_picker_sidebar/rkt_viewer_file_picker_sidebar';
import RktViewerFilePickerGrid from './rkt_viewer_file_picker_grid/rkt_viewer_file_picker_grid';
import RktViewerFilePickerViewer from './rkt_viewer_file_picker_viewer/rkt_viewer_file_picker_viewer';

//config
import config from "./../../../../config/config_dicom_types.json";

class RktViewerFilePicker extends Component {

    constructor() {
        super();

        if (config!==undefined) {

            var image_types = config.image_types;
            var assigned_targets={};
            
            for (var i = 0; i < image_types.length; i++) {
                var dicom_type = image_types[i];
                var label = dicom_type.label;

                assigned_targets[label] = false;
            }

            this.state = {
                assigned_targets: assigned_targets
            }
        }

        this.handleImgSelected = this.handleImgSelected.bind(this);
        this.handleImgAssigned = this.handleImgAssigned.bind(this);
    }

    componentDidMount() {}

    handleImgAssigned(name, state) { // image assignment so that the image is displayed in one sidebar's drop target
        // name: img_label (name of the dicom type) of the assigned/unassigned target
        // state: true/false
        
        var assigned_targets = this.state.assigned_targets;
        assigned_targets[name] = state;

        this.setState({
            assigned_targets: assigned_targets
        })
    }

    handleImgSelected(files, url, viewerType) { // image selection so that the image is displayed in the viewer
        // props of the component "viewer" are updated with the selected image's information
        this.setState({
            files_to_display: files,
            url_to_display: url,
            viewerType: viewerType
        });
    }

    renderSidebar() {
        
        var assigned_targets = this.state.assigned_targets;
        return (<RktViewerFilePickerSidebar assigned_targets={assigned_targets} handleimgassigned={this.handleImgAssigned}/>);
    }

    renderGrid() {
        return (
            <RktViewerFilePickerGrid handleimgselected={this.handleImgSelected} handleimgassigned={this.handleImgAssigned}/>
        );
    }

    renderViewer() {
        var url = this.state.url_to_display;
        var files = this.state.files_to_display;
        var viewerType = this.state.viewerType;

        return (<RktViewerFilePickerViewer url={url} files={files} viewerType={viewerType} />);
    }

    render() {

        return (
            <div className="grid-block rkt-viewer-file-picker">
                {this.renderSidebar()}
                {this.renderGrid()}
                {this.renderViewer()}
            </div>
        );
    }
}

export default DragDropContext(HTML5Backend)(RktViewerFilePicker);