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
import Dropzone from 'react-dropzone';

// actions
import { array2Object, orderObjectContent } from './rkt_viewer_image_selection_grid_empty_actions.js';

export default class RktViewerImageSelectionGridEmpty extends Component {

    constructor() {
        super();
        this.state = {};
    }

    componentDidMount() {
        this.refs.inputContainer.webkitdirectory = true; // IMPORTANT!

        var input = document.getElementById("input-choose-folder");
        input.addEventListener("change", this.onClickChooseFolderButton.bind(this))
    }

    onDropApp(acceptedFiles, rejectedFiles) {

        if (acceptedFiles.length > 0) {
            var fileList = array2Object(acceptedFiles); // so that "fileList" is expressed as the "fileList" (that is, blob.dataTransfer.files) obtained in the drag-box of the "rkt_viewer" component
            this.props.onfileselection(fileList);
        }
    }

    onClickChooseFolderButton(e) {
        e.preventDefault();

        let blob = e;
        var fileList = blob.target.files;

        // "fileList" is unsorted: we sort it by its property "name"
        fileList = orderObjectContent(fileList, "name");
        this.props.onfileselection(fileList);
    }

    render() {

        return (
            <div className="grid-block vertical image-selection-grid-empty">
                <div className="grid-block">&nbsp;</div>
                <div className="grid-block vertical shrink">
                    <div className="grid-block shrink align-center dropzone-widget">
                        <div className="grid-block vertical shrink">
                            <label className="text-center">Drag and drop your files</label>
                            <Dropzone onDrop={this.onDropApp.bind(this)}></Dropzone>
                            <div className="grid-block shrink choose-folder-widget align-center">
                                <label className="grid-block choose-folder-button shrink">
                                    <input
                                        id="input-choose-folder"
                                        style={{ "display": "none" }}
                                        type="file"
                                        ref="inputContainer" />
                                    <i className="fi-folder"></i> Choose a folder
                            </label>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="grid-block">&nbsp;</div>
            </div>
        );
    }
}