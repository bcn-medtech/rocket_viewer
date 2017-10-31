import React, { Component } from 'react';

//modules
import { blob_getResourceType, blob_getNumberOfFiles } from './../../../../../modules/rkt_module_blob';

// components
//components
import RktViewerTiff from './../../rkt_viewer_tiff/rkt_viewer_tiff';
import RktViewerDicom from './../../rkt_viewer_dicom/rkt_viewer_dicom';
// RktViewerImageProcessingDicom from './rkt_viewer_image_processing_dicom/rkt_viewer_image_processing_dicom';
// import RktViewerEmpty from './../../rkt_viewer_empty/rkt_viewer_empty';
// import RktViewerFilePicker from './../../rkt_viewer_file_picker/rkt_viewer_file_picker';
// import RktViewerPDF from './../../rkt_viewer_pdf/rkt_viewer_pdf';
// import RktViewerNRRD from './../../rkt_viewer_nrrd/rkt_viewer_nrrd';
// import RktViewerPLY from './../../rkt_viewer_ply/rkt_viewer_ply';
// import RktViewerVTK from './../../rkt_viewer_vtk/rkt_viewer_vtk';

export default class RktViewerFilePickerGrid extends Component {

    constructor() {
        super();

        this.state = {
            imageUrl: "",
            imageFile: [],
            isStack: false

        }

        // this.handleSelection = this.handleSelection.bind(this);
        // this.renderDicom = this.renderDicom.bind(this);
        // this.render = this.render.bind(this);

    }

    componentDidMount() {
        //console.log("Component Preview mounted");
        //var token = PubSub.subscribe('DICOM.select', this.handleSelection);

    }

    renderViewer() {

        console.log("RENDERING VIEWER OF SIDEBAR");

        var url = this.props.url;
        var file = this.props.file;

        console.log(url);
        console.log(file);

        if ((url === undefined) || (file === undefined)) {

            return (
                <div className="container-instructions">
                    <p>Select an image to visualize</p>
                </div>
            );

        } else {

            var viewerType;
            if (file !== undefined) viewerType = file.type;
            else viewerType = "application/dicom";

            console.log(file);
            console.log(file.type);
            console.log(viewerType);

            if (viewerType === "image/tif") {

                return (<RktViewerTiff files={file} url={url} />);

            } else if (viewerType === "application/dicom") {

                return (<RktViewerDicom files={file} url={url} />);
            }
        }
    }

    renderImageMetadata() {

        return (
            <div className="container-metadata">

            </div>
        );

    }

    render() {
        return (
            <div className="grid-block vertical sidebar">
                {this.renderViewer()}
                {this.renderImageMetadata()}
            </div>
        );
    }
}