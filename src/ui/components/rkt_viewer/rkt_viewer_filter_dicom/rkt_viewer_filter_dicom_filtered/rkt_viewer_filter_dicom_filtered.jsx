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
import { cropImageFromCanvas } from './rkt_viewer_filter_dicom_filtered_actions';
//Using global variables
const cornerstone = window.cornerstone;

export default class RktViewerFilterDicomFiltered extends Component {

    constructor() {
        super();

        this.state = {
            filteredImage: undefined,
            loaded: false
        }

        this.displayFilteredImage = this.displayFilteredImage.bind(this);
        this.saveFilteredImage = this.saveFilteredImage.bind(this);

        this.canvasURL = undefined;
    }


    renderFilteredImage() {

        if (!this.state.loaded) {
            var canvas = this.props.canvas_image_to_crop;
            var inputs = this.props.inputs_cropping_function;

            if ((canvas !== undefined) && (inputs !== undefined)) {

                var element = this.imageFilterDiv;
                cornerstone.enable(element);
                var parentNode = document.getElementsByClassName("grid-block filtered-dicom-container")[0];

                cropImageFromCanvas(canvas, inputs, parentNode, this.displayFilteredImage);
            }
        }
    }

    displayFilteredImage(filteredImage, canvasURL) {

        var element = this.imageFilterDiv;
        var viewport = cornerstone.getDefaultViewportForImage(element, filteredImage);
        cornerstone.displayImage(element, filteredImage, viewport);

        this.setState({
            filteredImage: filteredImage,
            loaded: true
        });

        this.canvasURL = canvasURL; // URL of the canvas of the (CROPPED) pixpipe image

    }

    renderSaveButton() {

        if (this.state.filteredImage !== undefined) {

            return (<a className="grid-block save-button" id="save-button" onClick={this.saveFilteredImage}>Save image</a>);

        }

    }

    saveFilteredImage() {
        
        var save_button = document.getElementById("save-button");

        var name_image = this.props.name_image;
        save_button.download = name_image + "_cardiac_cycle";
        save_button.href = this.canvasURL;

    }

    render() {
        return (
            <div className="grid-block filtered-dicom-container">
                {this.renderFilteredImage()}
                {this.renderSaveButton()}
                <div className="croppedDicomImage" ref={(imgFilteredDiv) => this.imageFilterDiv = imgFilteredDiv}
                    style={{ top: "0px", left: "0px", width: "100%", /*height: "100%",*/ overflow: "hidden", margin: "0 auto" }}
                />
            </div>
        );
    }
}