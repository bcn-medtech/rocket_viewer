import React, { Component } from 'react';
import { DragDropContext } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';

// actions
import { setConfigInfo } from "./rkt_viewer_file_picker_actions";
// components
import RktViewerFilePickerSidebar from './rkt_viewer_file_picker_sidebar/rkt_viewer_file_picker_sidebar';
import RktViewerFilePickerGrid from './rkt_viewer_file_picker_grid/rkt_viewer_file_picker_grid';
import RktViewerFilePickerViewer from './rkt_viewer_file_picker_viewer/rkt_viewer_file_picker_viewer';

//config
//import config from "./../../../../config/config_dicom_types.json";
import config from "./../../../../config/config_dicom_types_2.json";

class RktViewerFilePicker extends Component {

    constructor() {
        super();

        if (config !== undefined) {

            var sidebar_targets_info = setConfigInfo(config);

            this.state = {
                sidebar_targets_info: sidebar_targets_info, // sidebar_targets_info[i] = { "index": i, "label": label, "isAssigned": false, "index_source": undefined };
                grid_sources_info: {}
            }
        }

        this.onImgSelection = this.onImgSelection.bind(this);
        this.onImgDragAndDrop = this.onImgDragAndDrop.bind(this);
        this.onConfigChange = this.onConfigChange.bind(this);
    }

    componentDidMount() { }

    onImgDragAndDrop(index_sidebar, label_sidebar, toAssignDropTarget, index_grid) {

        var grid_sources_info = this.state.grid_sources_info; // drag source
        var sidebar_targets_info = this.state.sidebar_targets_info; // drop target

        var grid_source_to_update = grid_sources_info[index_grid];
        var sidebar_target_to_update = sidebar_targets_info[index_sidebar];

        if (!toAssignDropTarget) { // case of clicking a deleteIcon in a GRID thumbnail

            // DRAG SOURCE update: 
            // the current label of the GRID thumbnail is updated to FALSE,
            grid_source_to_update.hasLabelAssigned = false;
            grid_source_to_update.assigned_label = false;
            // and it does NOT have any target associated:
            grid_source_to_update.index_target = false;

            // DROP TARGET update: 
            // the current SIDEBAR element has NOT any GRID thumbnail assigned,
            sidebar_target_to_update.isAssigned = false;
            // and it does NOT have any source associated
            sidebar_target_to_update.index_source = false;

        } else { // case of dragging a GRID thumnail into a SIDEBAR element

            for (var i = 0; i < Object.keys(sidebar_targets_info).length; i++) {

                if (sidebar_targets_info[i].index_source === index_grid) {
                    // this sidebar element cannot have the current source associated
                    sidebar_targets_info[i].index_source = false;
                    sidebar_targets_info[i].isAssigned = false;
                }
            }

            // 2) a target (sidebar element) can only have ONE source (grid thumbnail) associated -->
            // we check whether any of the grid thumbnails has assigned the current "sidebar_label"

            for (var i = 0; i < Object.keys(grid_sources_info).length; i++) {

                if (grid_sources_info[i].assigned_label === label_sidebar) {
                    // this grid thumbnail cannot have the current sidebar label any more
                    grid_sources_info[i].assigned_label = false;
                    grid_sources_info[i].hasLabelAssigned = false;
                    grid_sources_info[i].index_target = false;
                }
            }

            // DRAG SOURCE update: 
            // the current label of the GRID thumbnail is updated,
            grid_source_to_update.hasLabelAssigned = true;
            grid_source_to_update.assigned_label = label_sidebar;
            // and it DOES have a target associated
            grid_source_to_update.index_target = index_sidebar;

            // DROP TARGET update: 
            // the current SIDEBAR element HAS a thumbnail assigned
            sidebar_target_to_update.isAssigned = true;
            // and it DOES have a source associated
            sidebar_target_to_update.index_source = index_grid;

        }

        // final update
        grid_sources_info[index_grid] = grid_source_to_update;
        sidebar_targets_info[index_sidebar] = sidebar_target_to_update;

        this.setState({
            grid_sources_info: grid_sources_info,
            sidebar_targets_info: sidebar_targets_info
        });

    }

    /* SIDEBAR component */
    onConfigChange(new_config) {
        if (new_config !== undefined) {
            //console.log("LET'S CHANGE CONFIG INFO!");
            var sidebar_targets_info = setConfigInfo(new_config);
            //console.log(sidebar_targets_info);
            var grid_sources_info = this.state.grid_sources_info;

            // in case "grid_sources_info" is already filled (after importing DICOMs into the GRID)
            if (Object.keys(grid_sources_info).length > 0) { // we update/reinitialize the labels of the grid content to "false"
                for (var i = 0; i < Object.keys(grid_sources_info).length; i++) {
                    var grid_source_to_update = grid_sources_info[i];
                    grid_source_to_update.assigned_label = false;
                    grid_source_to_update.isAssigned = false;
                }
            }

            this.setState = {
                sidebar_targets_info: sidebar_targets_info,
                grid_sources_info: grid_sources_info
            }
        }
    }

    renderSidebar() {
        var sidebar_targets_info = this.state.sidebar_targets_info;
        //console.log(sidebar_targets_info);
        return (<RktViewerFilePickerSidebar sidebar_targets_info={sidebar_targets_info} onimgdragdrop={this.onImgDragAndDrop} onconfigchange={this.onConfigChange} />);
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