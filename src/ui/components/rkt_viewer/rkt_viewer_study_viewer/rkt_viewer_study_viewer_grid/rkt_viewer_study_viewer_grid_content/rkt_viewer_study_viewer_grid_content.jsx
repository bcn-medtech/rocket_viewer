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
import RktViewerFilePickerGridContentThumbnail from './rkt_viewer_study_viewer_grid_content_thumbnail/rkt_viewer_study_viewer_grid_content_thumbnail';
// actions
import { array2Object } from './rkt_viewer_study_viewer_grid_content_actions.js';

export default class RktViewerFilePickerGridContent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedImg: -1,
            //imgInstances: [],
        }

        this.handleImgLoaded = this.handleImgLoaded.bind(this);
        this.handleImgClicked = this.handleImgClicked.bind(this);
    }

    clearGrid() {
        this.setState({
            selectedImg: -1
        });
    }

    renderGrid() {
      
        var fileList = this.props.fileList; // {0: File, 1: File, ... , lenght: int}
        var keys_fileList = Object.keys(fileList); // ["0", "1", ... , "n", "length"]
        keys_fileList.pop(); // ["0", "1", ... , "n"]

        var url; // TO DO

        return (
            keys_fileList.map((key) => {

                var value = fileList[key];
                var files = array2Object([value]); // same as doing "var files = {0:fileList[key], "lenght":1};"

                return (
                    <RktViewerFilePickerGridContentThumbnail
                        index={key}
                        files={files}
                        url={url}
                        isSelected={key === this.state.selectedImg}
                        onLoaded={this.handleImgLoaded}
                        onClick={this.handleImgClicked}
                    />
                )
            })
        );
    }

    handleImgLoaded(cornerstoneData) {
        this.props.handleimgloaded(cornerstoneData);
    }

    handleImgClicked(index, file, url, viewerType) {
        this.setState({
            selectedImg: index
        })

        // data of the selected image is passed to the "Sidebar" component
        this.props.handleimgselected(file, url, viewerType);

    }

    render() {
        
        return (
            <div className="grid-block study-viewer-grid-content">
                <div className="grid-block small-up-3 align-spaced">
                    {this.renderGrid()}
                </div>
            </div>

        );
    }
}