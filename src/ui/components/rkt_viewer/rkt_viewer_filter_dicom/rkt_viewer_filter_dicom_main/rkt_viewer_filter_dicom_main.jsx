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

//components
import RktViewerFilterDicomMainEmpty from './rkt_viewer_filter_dicom_main_empty/rkt_viewer_filter_dicom_main_empty';
import RktViewerFilterDicomMainContent from './rkt_viewer_filter_dicom_main_content/rkt_viewer_filter_dicom_main_content';
// modules
import { isObjectEmpty } from './../../../../../modules/rkt_module_object';
//Using global variables
const cornerstone = window.cornerstone;
const cornerstoneTools = window.cornerstoneTools;

export default class RktViewerFilterDicomMain extends Component {

    constructor(props) {
        super(props);
        this.state = {
            dicom_file: undefined
        }
    }

    handleProvidedDicom(file) {
        this.setState({
            dicom_file: file
        });
    }

    renderMainDicomContainer() {
        var dicom_file = this.state.dicom_file;

        if ((!isObjectEmpty(dicom_file))) {

            return (<RktViewerFilterDicomMainContent img_url={dicom_file} img_source={"filesystem"} cropimage={this.props.cropimage}/>);

        } else {

            return (<RktViewerFilterDicomMainEmpty handleprovideddicom={this.handleProvidedDicom.bind(this)}/>);
        }
    }

    render() {

        return (
            <div className="grid-block vertical main-dicom-container">
                {this.renderMainDicomContainer()}
            </div>
        );
    }
}