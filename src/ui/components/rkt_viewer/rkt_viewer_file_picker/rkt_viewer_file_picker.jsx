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

            // "grid_sources_info": info of the drag sources (GRID CONTENT elements) of the file picker -->
            var grid_sources_info = {};

            // "sidebar_targets_info": info of the drop targets (SIDEBAR elements) of the file picker -->
            var sidebar_targets_info = {};

            // for the moment we can initialize "sidebar_targets_info":
            for (var i = 0; i < image_types.length; i++) {

                // DROP TARGET
                var dicom_type = image_types[i];
                var label = dicom_type.label;

                sidebar_targets_info[i] = {"index":i, "label": label, "isAssigned":false, "index_source_img":undefined};

            }

            this.state = {
                sidebar_targets_info: sidebar_targets_info,
                grid_sources_info: grid_sources_info
            }
        }

        this.onImgSelection = this.onImgSelection.bind(this);
        this.onImgDragAndDrop = this.onImgDragAndDrop.bind(this);
    }

    componentDidMount() { }

    /* SIDEBAR component */
    onImgDragAndDrop(index_sidebar, label_sidebar, toAssignDropTarget, index_grid) {
        
        console.log("ON IMG DRAG AND DROP (index_sidebar, label_sidebar, toAssignDropTarget, index_grid)");
        console.log(index_sidebar);
        console.log(label_sidebar);
        console.log(toAssignDropTarget);
        console.log(index_grid);

        var grid_sources_info = this.state.grid_sources_info; // drag source
        var sidebar_targets_info = this.state.sidebar_targets_info; // drop target
        
        var grid_source_to_update = grid_sources_info[index_grid];
        var sidebar_target_to_update = sidebar_targets_info[index_sidebar];
        console.log("GRID SOURCES, SIDEBAR TARGETS TO UPDATE")
        console.log(grid_source_to_update);
        console.log(sidebar_target_to_update);
        
        if (!toAssignDropTarget) { // case of clicking a deleteIcon in a GRID thumbnail

            // DRAG SOURCE update: the current label of the GRID thumbnail is updated to FALSE:
            grid_source_to_update.hasAssignedLabel = false;
            grid_source_to_update.assigned_label = false;
            // and it does NOT have any target associated:
            grid_source_to_update.index_target_element = false;

            // DROP TARGET update: the current SIDEBAR element has NOT any GRID thumbnail assigned
            sidebar_target_to_update.isAssigned = false;

        } else { // case of dragging a GRID thumnail into a SIDEBAR element

            // DRAG SOURCE update: the current label of the GRID thumbnail is updated:
            grid_source_to_update.hasAssignedLabel = true;
            //console.log(label_sidebar);
            grid_source_to_update.assigned_label = label_sidebar;
            // and it DOES have a target associated
            grid_source_to_update.index_target_element = index_sidebar;

            // DROP TARGET update: the current SIDEBAR element HAS a thumbnail assigned
            sidebar_target_to_update.isAssigned = true;
            sidebar_target_to_update.index_source_img = index_grid;
            //console.log(index_grid);

        }

        // final update
        grid_sources_info[index_grid] = grid_source_to_update;
        sidebar_targets_info[index_sidebar] = sidebar_target_to_update;

        console.log("GRID SOURCES, SIDEBAR TARGETS")
        console.log(grid_sources_info);
        console.log(sidebar_targets_info);

        this.setState({
            grid_sources_info: grid_sources_info,
            sidebar_targets_info: sidebar_targets_info
        });
        
    }

    renderSidebar() {
        var sidebar_targets_info = this.state.sidebar_targets_info;
        return (<RktViewerFilePickerSidebar sidebar_targets_info={sidebar_targets_info} onimgdragdrop={this.onImgDragAndDrop} />);
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
        var grid_sources_info = this.state.grid_sources_info;
        return (
            <RktViewerFilePickerGrid grid_sources_info={grid_sources_info} onimgselection={this.onImgSelection} onimgdragdrop={this.onImgDragAndDrop} />
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