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

    displayFilteredImage(filteredImage) {

        var element = this.imageFilterDiv;
        var viewport = cornerstone.getDefaultViewportForImage(element, filteredImage);
        cornerstone.displayImage(element, filteredImage, viewport);

        this.setState({
            filteredImage: filteredImage,
            loaded: true
        });
    }

    render() {
        return (
            <div className="grid-block filtered-dicom-container">
                {this.renderFilteredImage()}                
                <div className="croppedDicomImage" ref={(imgFilteredDiv) => this.imageFilterDiv = imgFilteredDiv}
                    style={{ top: "0px", left: "0px", width: "100%", /*height: this.props.canvasHeight,*/ overflow: "hidden", margin: "0 auto" }}
                />
            </div>
        );
    }
}