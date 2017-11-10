import React, { Component } from 'react';
import Dropzone from 'react-dropzone';

// actions
import { array2Object } from './rkt_viewer_filter_dicom_main_empty_actions.js';

export default class RktViewerFilterDicomMainEmpty extends Component {

    constructor() {
        super();
        this.state = {};
    }

    componentDidMount() {
    }

    onDropApp(acceptedFiles, rejectedFiles) {
        
        if (acceptedFiles.length > 1) {
            
            alert("You can only provide 1 file");

        } else if (acceptedFiles.length === 1) {

            if (acceptedFiles[0].type === "application/dicom") {

                var providedDicomFile = array2Object(acceptedFiles);
                this.props.handleprovideddicom(providedDicomFile);

            } else alert("Unsupported format");
            

        }
    }

    render() {

        return (
            <div className="grid-block vertical main-dicom-container-empty">
                <div className="grid-block vertical shrink dropzone-widget">
                    <label>DRAG AND DROP A DICOM FILE</label>
                    <Dropzone onDrop={this.onDropApp.bind(this)}></Dropzone>
                </div>
            </div>
        );
    }
}