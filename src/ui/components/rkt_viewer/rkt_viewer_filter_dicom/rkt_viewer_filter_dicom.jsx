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

// components
import RktViewerFilterDicomMain from './rkt_viewer_filter_dicom_main/rkt_viewer_filter_dicom_main';
import RktViewerFilterDicomFiltered from './rkt_viewer_filter_dicom_filtered/rkt_viewer_filter_dicom_filtered';

export default class RktViewerFilterDicom extends Component {

    constructor() {
        super();

        this.state = {};

        this.handleCroppingMainImage = this.handleCroppingMainImage.bind(this);
    }

    componentDidMount() {

    }

    handleCroppingMainImage(canvas_image_to_crop, name_image, inputs_cropping_function) {

        this.setState({
            canvas_image_to_crop: canvas_image_to_crop,
            name_image: name_image,
            inputs_cropping_function: inputs_cropping_function
        });
    }


    renderMainDicom() {
        return (<RktViewerFilterDicomMain cropimage={this.handleCroppingMainImage}/>);
    }

    renderFilteredDicom() {
        var canvas_image_to_crop = this.state.canvas_image_to_crop;
        var name_image = this.state.name_image;
        var inputs_cropping_function = this.state.inputs_cropping_function;
        
       return (<RktViewerFilterDicomFiltered canvas_image_to_crop={canvas_image_to_crop} name_image={name_image} inputs_cropping_function={inputs_cropping_function} />);
    }

    render() {
        return (
            <div className="grid-block rkt-viewer-filter-dicom">
                {this.renderMainDicom()}
                {this.renderFilteredDicom()}
            </div>
        );
    }
}