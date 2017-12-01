import React, { Component } from 'react';
import Dropzone from 'react-dropzone';

// actions
import { array2Object, orderObjectContent } from './rkt_viewer_file_picker_grid_empty_actions.js';

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
            <div className="grid-block vertical file-picker-grid-empty">
                <div className="grid-block vertical shrink dropzone-widget">
                    <label>DRAG AND DROP FILES</label>
                    <Dropzone onDrop={this.onDropApp.bind(this)}></Dropzone>
                </div>
                <div className="grid-block vertical shrink choose-folder-widget">
                    <label className="choose-folder-button shrink">
                        <input
                            id="input-choose-folder"
                            style={{ "display": "none" }}
                            type="file"
                            ref="inputContainer" />
                        CHOOSE A FOLDER
                    </label>
                </div>
            </div>
        );
    }
}