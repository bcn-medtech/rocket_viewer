import React, { Component, PropTypes } from 'react';
import Dropzone from 'react-dropzone';

export default class RktViewerFilePickerGridEmpty extends Component {
    constructor() {
        super();

        this.state = {};
    }

    // componentWillUpdate(nextProps) {

    // }

    // clearGrid() {

    // }

    // renderGrid() {


    // }

    onDropApp(acceptedFiles, rejectedFiles) {
        var files = acceptedFiles;

        if (files.length > 0) {
            this.props.handlefileselection(files);
        }
    }

    render() {

        return (
            <div className="grid-block vertical grid-empty">
                <form className="dropzone-widget">
                    <label>Drag and drop files</label>
                    <Dropzone onDrop={this.onDropApp.bind(this)}></Dropzone>
                </form>
            </div>
        );
    }
}