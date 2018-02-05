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

//viewer actions
import { blob_getResourceType, blob_getNumberOfFiles } from './../../../modules/rkt_module_blob.js';
import { isFileADicomFile } from './rkt_viewer_actions';
//modules
import { isObjectEmpty } from './../../../modules/rkt_module_object.js';
import { url_getParameterByName } from './../../../modules/rkt_module_url.js';

//components
import RktViewerDicom from './rkt_viewer_dicom/rkt_viewer_dicom';
import RktViewerEmpty from './rkt_viewer_empty/rkt_viewer_empty';
import RktViewerImageSelection from './rkt_viewer_image_selection/rkt_viewer_image_selection';
import RktViewerImageSelectionOld from './rkt_viewer_study_viewer/rkt_viewer_study_viewer';
import RktViewerStudyViewerApi from './rkt_viewer_study_viewer_api/rkt_viewer_study_viewer_api';
import RktViewerFilterDicom from './rkt_viewer_filter_dicom/rkt_viewer_filter_dicom';
// RktViewerImageProcessingDicom from './rkt_viewer_image_processing_dicom/rkt_viewer_image_processing_dicom';
import RktViewerNRRD from './rkt_viewer_nrrd/rkt_viewer_nrrd';
import RktViewerPDF from './rkt_viewer_pdf/rkt_viewer_pdf';
import RktViewerPLY from './rkt_viewer_ply/rkt_viewer_ply';
import RktViewerTiff from './rkt_viewer_tiff/rkt_viewer_tiff';
import RktViewerVTK from './rkt_viewer_vtk/rkt_viewer_vtk';
import RktViewerECG from './rkt_viewer_ecg/rkt_viewer_ecg';
import RktViewerJPGPNG from './rkt_viewer_jpg_png/rkt_viewer_jpg_png';

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

        e.stopPropagation();
        e.preventDefault();
        return false;
    }

    _onDragOver(e) {

        e.preventDefault();
        e.stopPropagation();
        return false;
    }

    _onDragLeave(e) {

        e.stopPropagation();
        e.preventDefault();
        return false;
    }

    _onDrop(e) {

        e.preventDefault();

        let blob = e;

        if ((this.state.viewer !== "study_viewer") && (this.state.viewer !== "image_selection") && (this.state.viewer !== "filter_viewer")) {

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

                    // last check:
                    var myComponent = this;
                    var files = blob.dataTransfer.files;
                    isFileADicomFile(files[0], function (fileisDicom) {

                        if (fileisDicom) {
                            var viewerType = "dicom";

                            myComponent.setState({
                                viewer: viewerType,
                                files: files,
                                blob: blob,
                            });

                        } else alert("Unsupported format");

                    })
                }

            } else {

                alert("Blob with multiple files");

            }

        } else {

            return false;

        }
            
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

            } else if (viewerType === "vtk") {

                return (<RktViewerVTK files={files} url={url} />);

            } else if (viewerType === "study_viewer") {

                return (<RktViewerImageSelectionOld />)

            } else if(viewerType === "study_viewer_pl_api_fs"){

                return (<RktViewerStudyViewerApi/>);

            } else if (viewerType === "image_selection") {

                return (<RktViewerImageSelection />)

            } else if (viewerType === "filter_viewer") {

                return (<RktViewerFilterDicom />)

            }else if (viewerType === "ecg"){

                return (<RktViewerECG files={files} url={url}/>);

            }else if(viewerType === "jpg") {

                return (<RktViewerJPGPNG files={files} url={url}/>);
                
            }
            else {

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