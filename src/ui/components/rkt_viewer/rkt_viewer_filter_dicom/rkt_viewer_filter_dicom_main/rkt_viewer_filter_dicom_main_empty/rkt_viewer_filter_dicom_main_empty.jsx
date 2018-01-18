import React, { Component } from 'react';
import Dropzone from 'react-dropzone';

// actions
import { array2Object, isFileADicomFile } from './rkt_viewer_filter_dicom_main_empty_actions.js';

export default class RktViewerFilterDicomMainEmpty extends Component {

    constructor() {
        super();
        this.state = {};
    }

    componentDidMount() {
    }

    onDropApp(acceptedFiles, rejectedFiles) {

        var myComponent = this;

        if (acceptedFiles.length > 1) {

            alert("You can only provide 1 file");

        } else if (acceptedFiles.length === 1) {

            isFileADicomFile(acceptedFiles[0], function(fileisDicom) {

                if (fileisDicom) {

                    var providedDicomFile = array2Object(acceptedFiles);
                    myComponent.props.handleprovideddicom(providedDicomFile);

                } else alert("Unsupported format");
                
            })

        }
    }

    render() {
        return (
            <div className="grid-block vertical main-dicom-container-empty">
                <div className="grid-block">&nbsp;</div>
                <div className="grid-block vertical shrink">
                    <div className="grid-block shrink align-center dropzone-widget">
                        <div className="grid-block vertical shrink">
                            <label className="text-center">Drag and drop your files</label>
                            <Dropzone onDrop={this.onDropApp.bind(this)}></Dropzone>
                        </div>
                    </div>
                </div>
                <div className="grid-block">&nbsp;</div>
            </div>
        );
    }
}