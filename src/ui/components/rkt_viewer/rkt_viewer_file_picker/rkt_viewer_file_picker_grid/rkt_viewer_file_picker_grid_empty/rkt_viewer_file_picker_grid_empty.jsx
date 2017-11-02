import React, { Component } from 'react';
import Dropzone from 'react-dropzone';

// actions
import { array2Object } from './rkt_viewer_file_picker_grid_empty_actions.js';

export default class RktViewerFilePickerGridEmpty extends Component {
    
    constructor() {
        super();
        this.state = {};
    }

    onDropApp(acceptedFiles, rejectedFiles) {
        
        if (acceptedFiles.length > 0) {
            var fileList = array2Object(acceptedFiles);
            this.props.onselectedfiles(fileList);
        }
    }

    render() {

        return (
            <div className="grid-block vertical file-picker-grid-empty">
                <form className="dropzone-widget">
                    <label>Drag and drop files</label>
                    <Dropzone onDrop={this.onDropApp.bind(this)}></Dropzone>
                </form>
            </div>
        );
    }
}