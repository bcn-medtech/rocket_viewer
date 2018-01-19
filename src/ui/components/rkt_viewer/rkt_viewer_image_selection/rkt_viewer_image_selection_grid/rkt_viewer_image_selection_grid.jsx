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

// components
import RktViewerImageSelectionGridStats from './rkt_viewer_image_selection_grid_stats/rkt_viewer_image_selection_grid_stats';
import RktViewerImageSelectionGridEmpty from './rkt_viewer_image_selection_grid_empty/rkt_viewer_image_selection_grid_empty';
import RktViewerImageSelectionGridContent from './rkt_viewer_image_selection_grid_content/rkt_viewer_image_selection_grid_content';

//actions
import { computeStats } from "./rkt_viewer_image_selection_grid_actions";

export default class RktViewerImageSelectionGrid extends Component {

    constructor(props) {
        super(props);
        this.state = {
            fileList: {},
            manufacturersDict: [],
            loadedDicoms: 0,
            totalDicoms: 0,
        }

        this.onFileSelection = this.onFileSelection.bind(this);
        this.onGridContentChange = this.onGridContentChange.bind(this);

    }

    /* STATS component */
    renderStatsComponent() {
        var manufacturersDict = this.state.manufacturersDict;
        var loadedFiles = this.state.loadedFiles;
        var totalFiles = this.state.totalFiles;

        return (
            <RktViewerImageSelectionGridStats
                title="Folder info"
                items={manufacturersDict}
                onclicksettingsbutton={this.props.onclicksettingsbutton}
                onclickloadbutton={this.props.onclickloadbutton}
                grid_sources_info={this.props.grid_sources_info}
                loadedDicoms={loadedFiles}
                totalDicoms={totalFiles} />
        );
    }

    /* GRID component */
    renderGridComponent() {
        var fileList = this.state.fileList;

        // if files have been dragged and drop, they are displayed in the grid (as thumbnails)
        if (fileList.length > 0) {

            return (
                <RktViewerImageSelectionGridContent
                    fileList={fileList}
                    grid_sources_info={this.props.grid_sources_info}
                    onchangegridcontent={this.onGridContentChange}
                    onimgselection={this.props.onimgselection}
                    onimgdragdrop={this.props.onimgdragdrop}
                // onconfigchange={this.props.onconfigchange}
                />
            );

            // if files have NOT been dragged and drop yet, dropzone widget
        } else {

            return (<RktViewerImageSelectionGridEmpty onfileselection={this.onFileSelection} />);

        }
    }

    onFileSelection(fileList) { // fileList {0: File, 1: File, ... , lenght: int}

        // we initialize the props "grid_sources_info" (DRAG SOURCE of the file picker)
        var grid_sources_info = this.props.grid_sources_info;

        var keys_fileList = Object.keys(fileList); // ["0", "1", ... , "n", "length"]
        keys_fileList.pop(); // ["0", "1", ... , "n"]

        for (var i = 0; i < keys_fileList.length; i++) {

            grid_sources_info[i] = { "index": i, "imgCanvasURL": undefined, "metadata": undefined, "file": fileList[i], "hasLabelAssigned": false, "assigned_label": undefined, "index_target": undefined };

        }

        // And we update "GridContent" and "Stats" data
        this.clearState();
        this.setState({
            fileList: fileList,
            totalFiles: fileList.length
        });

    }

    clearState() {
        this.setState({
            fileList: [],
            totalFiles: 0,
            manufacturerInfo: [],
            loadedFiles: 0
        });
    }

    onGridContentChange(cornerstoneDataArray, pngCanvasURLObject, metadataObject) {
        var myComponent = this;

        for (var i = 0; i < Object.keys(pngCanvasURLObject).length; i++) {
            var current_PNG_canvas_URL = pngCanvasURLObject[i];
            var current_metadata = metadataObject[i];

            myComponent.props.grid_sources_info[i].imgCanvasURL = current_PNG_canvas_URL;
            myComponent.props.grid_sources_info[i].metadata = current_metadata;
        
        }

        //update of "stats" at GRID STATS
        computeStats(cornerstoneDataArray, function (manufacturersDict) {
            myComponent.setState({
                loadedFiles: cornerstoneDataArray.length,
                manufacturersDict: manufacturersDict
            });
        })

    }

    render() {
        return (
            <div className="grid-block medium-5 vertical image-selection-grid">
                {this.renderStatsComponent()}
                {this.renderGridComponent()}
            </div>
        );
    }
}