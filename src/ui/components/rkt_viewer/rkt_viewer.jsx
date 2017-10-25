import React, { Component } from 'react';

//viewer actions
import { blob_getResourceType, blob_getNumberOfFiles } from './../../../modules/rkt_module_blob.js';
//modules
import { isObjectEmpty } from './../../../modules/rkt_module_object.js';
import { url_getParameterByName } from './../../../modules/rkt_module_url.js';
//components
import RktViewerTiff from './rkt_viewer_tiff/rkt_viewer_tiff';
import RktViewerDicom from './rkt_viewer_dicom/rkt_viewer_dicom';
// RktViewerImageProcessingDicom from './rkt_viewer_image_processing_dicom/rkt_viewer_image_processing_dicom';
import RktViewerEmpty from './rkt_viewer_empty/rkt_viewer_empty';
import RktViewerPDF from './rkt_viewer_pdf/rkt_viewer_pdf';
import RktViewerNRRD from './rkt_viewer_nrrd/rkt_viewer_nrrd';
import RktViewerPLY from './rkt_viewer_ply/rkt_viewer_ply';
import RktViewerVTK from './rkt_viewer_vtk/rkt_viewer_vtk';

//config
import config from './../../../config/config.json';

export default class RktViewer extends Component {

    constructor() {
        super();

        this.state = {};

        this._onDragEnter = this._onDragEnter.bind(this);
        this._onDragLeave = this._onDragLeave.bind(this);
        this._onDragOver = this._onDragOver.bind(this);
        this._onDrop = this._onDrop.bind(this);
    }

    componentDidMount() {

        var location = window.location;

        if ("href" in location) {

            var location_url = location.href;
            var type = url_getParameterByName("type", location_url);
            var url_resource = url_getParameterByName("url", location_url);

            if (!isObjectEmpty(type) && !isObjectEmpty(url_resource)) {

                this.setState({
                    viewer: type,
                    url: url_resource
                })
            }
        }

        window.addEventListener('mouseup', this._onDragLeave);
        window.addEventListener('dragenter', this._onDragEnter);
        window.addEventListener('dragover', this._onDragOver);
        window.addEventListener('drop', this._onDrop);
        document.getElementById('dragbox').addEventListener('dragleave', this._onDragLeave);
    }

    componentWillUnmount() {
        window.removeEventListener('mouseup', this._onDragLeave);
        window.removeEventListener('dragenter', this._onDragEnter);
        window.addEventListener('dragover', this._onDragOver);
        document.getElementById('dragbox').removeEventListener('dragleave', this._onDragLeave);
        window.removeEventListener('drop', this._onDrop);
    }

    _onDragEnter(e) {
        //console.log("On drag enter");
        //this.setState({ className: 'drop-zone-show' });
        e.stopPropagation();
        e.preventDefault();
        return false;
    }

    _onDragOver(e) {
        //console.log("On drag over");
        e.preventDefault();
        e.stopPropagation();
        return false;
    }

    _onDragLeave(e) {
        //console.log("On drag leave");
        //this.setState({ className: 'drop-zone-hide' });
        e.stopPropagation();
        e.preventDefault();
        return false;
    }

    _onDrop(e) {

        e.preventDefault();

        let blob = e;

        if (blob_getNumberOfFiles(blob) === 1) {

            var viewerType = blob_getResourceType(blob);

            if (viewerType) {

                var files = blob.dataTransfer.files;

                this.setState({
                    viewer: viewerType,
                    files: files,
                    blob: blob,
                });

            } else {

                alert("Uncompatible format");
            }


        } else {

            alert("Blob with multiple files");

        }

        return false;
    }

    setURL(url) {
        this.props.set_url(url);
    }

    renderViewer() {

        var viewerType = this.state.viewer;
        var files = this.state.files;
        var blob = this.state.blob;
        var url;

        //Load blobs from localhost 
        if (isObjectEmpty(files) && isObjectEmpty(blob)) {
            url = this.state.url;
        }

        if (!isObjectEmpty(viewerType)) {

            if (viewerType === "tif") {

                return (<RktViewerTiff blob={files} url={url} />);

            } else if (viewerType === "dicom") {

                return (<RktViewerDicom files={files} url={url} />);

            } else if (viewerType === "pdf") {

                return (<RktViewerPDF files={files} url={url} />);

            } else if (viewerType === "nrrd") {

                return (<RktViewerNRRD files={files} url={url} />);

            } else if (viewerType === "ply") {

                return (<RktViewerPLY files={files} url={url} />);

            }
            else if (viewerType === "vtk") {

                return (<RktViewerVTK files={files} url={url} />);

            } else {

                return (<RktViewerEmpty seturl={this.setURL.bind(this)} config={config} />);
            }
        } else {
            return (<RktViewerEmpty seturl={this.setURL.bind(this)} config={config} />);
        }
    }

    render() {

        return (
            <div className="grid-block rkt-viewer" id="dragbox">
                {this.renderViewer()}
            </div>
        );
    }
}