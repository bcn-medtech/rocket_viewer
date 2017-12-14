import React, { Component } from 'react';
import Dropzone from 'react-dropzone';

// actions
import { array2Object, orderObjectContent } from './rkt_viewer_study_viewer_grid_empty_actions.js';

export default class RktViewerFilePickerGridEmpty extends Component {

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
            var fileList = array2Object(acceptedFiles);
            this.props.onselectedfiles(fileList);
        }
    }

    onClickChooseFolderButton(e) {
        e.preventDefault();

        let blob = e;
        var fileList = blob.target.files;

        // "fileList" is unsorted: we sort it by its property "name"
        fileList = orderObjectContent(fileList, "name");
        this.props.onselectedfiles(fileList);
    }

    render() {

            return (
                <div className="grid-block vertical study-viewer-grid-empty">
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