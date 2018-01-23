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
import { DragDropContext } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';

// actions
import { setConfigInfo, updateImageSelectionInfo, loadZipWithInfo } from "./rkt_viewer_image_selection_actions";
// components
import RktViewerImageSelectionSidebar from './rkt_viewer_image_selection_sidebar/rkt_viewer_image_selection_sidebar';
import RktViewerImageSelectionGrid from './rkt_viewer_image_selection_grid/rkt_viewer_image_selection_grid';
import RktViewerImageSelectionViewer from './rkt_viewer_image_selection_viewer/rkt_viewer_image_selection_viewer';
import RktModalTodoList from "./../../rkt_modal/rkt_modal_todo_list/rkt_modal_todo_list";

//config
//import config from "./../../../../config/config_dicom_types.json";
import config from "./../../../../config/config_dicom_types.json";

class RktViewerImageSelection extends Component {

    constructor() {
        super();
        
        this.state = {
            isModalTodoListOpen: false
        }
        
        if (config !== undefined) {

            if (!localStorage.getItem("config-image-selection")) {

                var image_types = [];

                for (var i = 0; i < config.image_types.length; i++) {
                    var image = config.image_types[i];
                    image_types.push(image.label);
                }

                localStorage.setItem("config-image-selection", JSON.stringify(image_types));
            }

            var sidebar_targets_info = setConfigInfo(JSON.parse(localStorage.getItem("config-image-selection")));

            this.state = {
                sidebar_targets_info: sidebar_targets_info, // sidebar_targets_info[i] = { "index": i, "label": label, "isAssigned": false, "index_source": undefined };
                grid_sources_info: {}
            }
        }

        this.onImgDragAndDrop = this.onImgDragAndDrop.bind(this);
        this.onImgSelection = this.onImgSelection.bind(this);
        this.onClickLoadButton = this.onClickLoadButton.bind(this);
        
        this.openAndCloseModalTodoList = this.openAndCloseModalTodoList.bind(this);
        this.renderModalTodoList = this.renderModalTodoList.bind(this);
        this.onConfigChange = this.onConfigChange.bind(this);
    }

    componentDidMount() { }

    onImgDragAndDrop(index_sidebar, label_sidebar, toAssignDropTarget, index_grid) {

        var grid_sources_info = this.state.grid_sources_info; // drag source
        var sidebar_targets_info = this.state.sidebar_targets_info; // drop target

        var [updated_grid_sources_info, updated_sidebar_targets_info] = updateImageSelectionInfo(grid_sources_info, sidebar_targets_info, index_sidebar, label_sidebar, toAssignDropTarget, index_grid);

        this.setState({
            grid_sources_info: updated_grid_sources_info,
            sidebar_targets_info: updated_sidebar_targets_info
        });

    }

    /* SIDEBAR component */
    renderSidebar() {
        var sidebar_targets_info = this.state.sidebar_targets_info;

        return (<RktViewerImageSelectionSidebar 
            sidebar_targets_info={sidebar_targets_info} 
            onimgdragdrop={this.onImgDragAndDrop} />
        );
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

    onClickLoadButton() {
        loadZipWithInfo(this.state.grid_sources_info);
    }

    renderGrid() {
        var grid_sources_info = this.state.grid_sources_info;
        return (
            <RktViewerImageSelectionGrid
                grid_sources_info={grid_sources_info}
                onimgselection={this.onImgSelection}
                onimgdragdrop={this.onImgDragAndDrop}
                onclicksettingsbutton={this.openAndCloseModalTodoList}
                onclickloadbutton={this.onClickLoadButton} />
        );
    }

    /* VIEWER component */
    renderViewer() {
        var url = this.state.url_to_display;
        var files = this.state.files_to_display;
        var viewerType = this.state.viewerType;

        return (<RktViewerImageSelectionViewer url={url} files={files} viewerType={viewerType} />);
    }

    /* MODAL TODO LIST component */
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
                    onClickLoadListButton={this.onConfigChange}
                    closemodaltodolist={this.openAndCloseModalTodoList}
                />
            );
        }
    }

    onConfigChange(new_image_types) {

        if (new_image_types !== undefined) {
            localStorage.setItem("config-image-selection", JSON.stringify(new_image_types));

            var updated_sidebar_targets_info = setConfigInfo(new_image_types);
            var updated_grid_sources_info = this.state.grid_sources_info;

            // in case "grid_sources_info" is already filled (after importing DICOMs into the GRID)
            if (Object.keys(updated_grid_sources_info).length > 0) { // we update/reinitialize the labels of the grid content to "false"
                for (var i = 0; i < Object.keys(updated_grid_sources_info).length; i++) {
                    var grid_source_to_update = updated_grid_sources_info[i];
                    grid_source_to_update.assigned_label = false;
                    grid_source_to_update.hasLabelAssigned = false;
                    grid_source_to_update.index_target = false;

                    updated_grid_sources_info[i] = grid_source_to_update;
                }
            }

            this.setState({
                sidebar_targets_info: updated_sidebar_targets_info,
                grid_sources_info: updated_grid_sources_info
            });
        }
    }
    /*  */

    render() {

        return (
            <div className="grid-block rkt-viewer-image-selection">
                {this.renderSidebar()}
                {this.renderGrid()}
                {this.renderViewer()}
                {this.renderModalTodoList()}
            </div>
        );
    }
}

export default DragDropContext(HTML5Backend)(RktViewerImageSelection);