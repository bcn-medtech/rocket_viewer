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

        if (config !== undefined) {

            var image_types = config.image_types;

            // "assigned_sidebar_targets": targets of the sidebar that have been assigned with an image -->
            // Object: {"name_target_1": true/false, ..., "name_target_n": true/false}, for a SIDEBAR component with "n" targets
            var assigned_sidebar_targets = {};

            // "assigned_grid_labels": grid content thumbnails that have a (sidebar) label assigend -->
            // Object: {0: "name_assigned_label_0"/false, ..., m: "name_assigned_label_0"/false}, for a GRID CONTENT component with "m" thumbnails
            var assigned_grid_labels = {};

            for (var i = 0; i < image_types.length; i++) {

                // assigned_sidebar_targets
                var dicom_type = image_types[i];
                var label = dicom_type.label;

                assigned_sidebar_targets[label] = false;

                // assigned_grid_labels
                assigned_grid_labels[i] = false;
            }

            this.state = {
                assigned_sidebar_targets: assigned_sidebar_targets,
                assigned_grid_labels: assigned_grid_labels
            }
        }

        this.onImgSelection = this.onImgSelection.bind(this);
        this.onImgDragAndDrop = this.onImgDragAndDrop.bind(this);
    }

    componentDidMount() { }

    /* SIDEBAR component */
    onImgDragAndDrop(name_sidebar_target, state_sidebar_target, index_grid) { // an image is dragged from the GRID and dropped in the SIDEBAR
        // name_sidebar_target: img_label (name of the dicom type) of the assigned/unassigned target
        // state_sidebar_target (of the sidebar target): true (is assigned)/false (is not assigned)
        // index_grid: index of the thumbnail of the grid in which we have to assign a label

        console.log("---> ON IMG DRAG AND DROP (name_sidebar_target, state_sidebar_target, index_grid)");
        console.log(name_sidebar_target);
        console.log(state_sidebar_target);
        console.log(index_grid);

        // assigned_sidebar_targets
        var assigned_sidebar_targets = this.state.assigned_sidebar_targets;
        assigned_sidebar_targets[name_sidebar_target] = state_sidebar_target;

        // assigned_grid_labels
        var assigned_grid_labels = this.state.assigned_grid_labels;

        if (state_sidebar_target) { // in a new grid label assignment ("state_sidebar_target = true")
        
            // we check whether the sidebar label is already assigned to a grid thumbnail
            var image_types = config.image_types;

            for (var i = 0; i < Object.keys(assigned_grid_labels).length; i++) {
                var grid_label_to_check = i;
                for (var j = 0; j < image_types.length; j++) {
                    var name_label_to_check = image_types[j].label;
                    
                    if (assigned_grid_labels[grid_label_to_check] === name_label_to_check) {
                        // this grid thumbnail cannot have the assigned sidebar label any more
                        assigned_grid_labels[grid_label_to_check] = false;
                    }
                }
            }

            // and we assign the current sidebar label to the current grid thumbnail
            assigned_grid_labels[index_grid] = name_sidebar_target;

        } else { // in a cancel grid label assignment ("state_sidebar_target = false")

            assigned_grid_labels[index_grid] = false;

        }

        console.log("ASSIGNED SIDEBAR TARGETS");
        console.log(assigned_sidebar_targets);
        console.log("ASSIGNED GRID LABELS");
        console.log(assigned_grid_labels);

        this.setState({
            assigned_sidebar_targets: assigned_sidebar_targets,
            assigned_grid_labels: assigned_grid_labels
        })
    }

    renderSidebar() {
        var assigned_sidebar_targets = this.state.assigned_sidebar_targets;
        return (<RktViewerFilePickerSidebar assigned_sidebar_targets={assigned_sidebar_targets} onimgdragdrop={this.onImgDragAndDrop} />);
    }

    /* GRID component */
    onImgSelection(files, url, viewerType) { // an image of the GRID is selected to be displayed on the VIEWER
        // props of the VIEWER are updated with the selected image's information
        this.setState({
            files_to_display: files,
            url_to_display: url,
            viewerType: viewerType
        });
    }

    renderGrid() {
        var assigned_grid_labels = this.state.assigned_grid_labels;
        return (
            <RktViewerFilePickerGrid assigned_grid_labels={assigned_grid_labels} onimgselection={this.onImgSelection} onimgdragdrop={this.onImgDragAndDrop} />
        );
    }

    /* VIEWER component */
    renderViewer() {
        var url = this.state.url_to_display;
        var files = this.state.files_to_display;
        var viewerType = this.state.viewerType;

        return (<RktViewerFilePickerViewer url={url} files={files} viewerType={viewerType} />);
    }
    /*  */

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