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

//modules

//components
import RktViewerDicom from './../../rkt_viewer_dicom/rkt_viewer_dicom';
import RktViewerNRRD from './../../rkt_viewer_nrrd/rkt_viewer_nrrd';
import RktViewerPDF from './../../rkt_viewer_pdf/rkt_viewer_pdf';
import RktViewerPLY from './../../rkt_viewer_ply/rkt_viewer_ply';
import RktViewerTiff from './../../rkt_viewer_tiff/rkt_viewer_tiff';
import RktViewerVTK from './../../rkt_viewer_vtk/rkt_viewer_vtk';
// RktViewerImageProcessingDicom from './rkt_viewer_image_processing_dicom/rkt_viewer_image_processing_dicom';

export default class RktViewerImageSelectionViewer extends Component {

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
            <div className="grid-block medium-5 vertical image-selection-viewer">
                {this.renderViewer()}
            </div>
        );
    }
}