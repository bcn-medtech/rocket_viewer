import React, { Component } from 'react';

//modules

//components
import RktViewerDicom from './../../rkt_viewer_dicom/rkt_viewer_dicom';
import RktViewerNRRD from './../../rkt_viewer_nrrd/rkt_viewer_nrrd';
import RktViewerPDF from './../../rkt_viewer_pdf/rkt_viewer_pdf';
import RktViewerPLY from './../../rkt_viewer_ply/rkt_viewer_ply';
import RktViewerTiff from './../../rkt_viewer_tiff/rkt_viewer_tiff';
import RktViewerVTK from './../../rkt_viewer_vtk/rkt_viewer_vtk';
// RktViewerImageProcessingDicom from './rkt_viewer_image_processing_dicom/rkt_viewer_image_processing_dicom';

export default class RktViewerFilePickerViewer extends Component {

    constructor() {
        super();

        this.state = {
            imageUrl: "",
            imageFile: [],
            isStack: false
        }
    }

    renderViewer() {

        var files = this.props.files;
        var url = this.props.url;
        var viewerType = this.props.viewerType;

        if (viewerType === "tiff") {

            return (<RktViewerTiff files={files} url={url} />);

        } else if (viewerType === "pdf") {

            return (<RktViewerPDF files={files} url={url} />);

        } else if (viewerType === "dicom") {

            return (<RktViewerDicom files={files} url={url} />);

        } else if (viewerType === "nrrd") {

            return (<RktViewerNRRD files={files} url={url} />);

        } else if (viewerType === "ply") {

            return (<RktViewerPLY files={files} url={url} />);

        } else if (viewerType === "vtk") {

            return (<RktViewerVTK files={files} url={url} />);
        }

    }

    render() {
        return (
            <div className="grid-block vertical study-viewer-viewer">
                {this.renderViewer()}
            </div>
        );
    }
}