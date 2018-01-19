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
import RktButtonIconCircleTextBig from './../../../rkt_button/rkt_button_icon_circle_text_big/rkt_button_icon_circle_text_big';
import RktAnimationLoading from './../../../rkt_animation/rkt_animation_loading/rkt_animation_loading';
//actions
import { loadDicom, getImageMetadata, cropImageFromCanvas } from './rkt_viewer_image_processing_dicom_one_frame_actions.js';
//Using global variables
const cornerstone = window.cornerstone;
const cornerstoneTools = window.cornerstoneTools;

export default class RktViewerDicomOneFrame extends Component {

    constructor() {

        super();

        this.state = {
            loaded: false,
            viewer_mode: "window_level"
        };

        this.componentDidMount = this.componentDidMount.bind(this);
        this.displayImage = this.displayImage.bind(this);
        this.displayFilteredImage = this.displayFilteredImage.bind(this);
    }

    componentDidMount() {

        this.setState({
            loaded: false,
            viewer_mode: "window_level"
        });

        var element = this.imageDiv;
        var element2 = this.imageFilterDiv;
        cornerstone.enable(element);
        cornerstone.enable(element2);

        var url = this.props.img_url;
        var img_source = this.props.img_source;

        loadDicom(url, img_source, this.displayImage);
    }

    componentWillReceiveProps(nextProps) {

        this.setState({
            loaded: false,
            viewer_mode: "window_level"
        });

        var element = this.imageDiv;
        var element2 = this.imageFilterDiv;
        cornerstone.enable(element);
        cornerstone.enable(element2);

        var url = nextProps.img_url;
        var img_source = nextProps.img_source;

        loadDicom(url, img_source, this.displayImage);
    }


    displayImage(image) {

        var imageMetadata = getImageMetadata(image);

        if (imageMetadata["number_of_frames"] > 1) {

            this.props.open_cine_viewer(image);

        } else {

            var element = this.imageDiv;
            var viewport = cornerstone.getDefaultViewportForImage(element, image);
            cornerstone.displayImage(element, image, viewport);

            this.setState({
                loaded: true,
                image: image,
                number_of_frames: imageMetadata["number_of_frames"],
                manufacturer: imageMetadata["manufacturer"]
            });

            if (this.props.add_controls) {
                cornerstoneTools.mouseInput.enable(element);
                cornerstoneTools.mouseWheelInput.enable(element);
                cornerstoneTools.wwwc.activate(element, 1); // ww/wc is the default tool for left mouse button
                //cornerstoneTools.pan.activate(element, 2); // pan is the default tool for middle mouse button
                cornerstoneTools.zoom.activate(element, 4); // zoom is the default tool for right mouse button
                cornerstoneTools.zoomWheel.activate(element); // zoom is the default tool for middle mouse wheel
            }
        }
    }

    displayFilteredImage(image) {

        var imageMetadata = getImageMetadata(image);

        if (imageMetadata["number_of_frames"] > 1) {

            this.props.open_cine_viewer(image);

        } else {

            var element = this.imageFilterDiv;
            var viewport = cornerstone.getDefaultViewportForImage(element, image);
            cornerstone.displayImage(element, image, viewport);

            this.setState({
                loaded: true,
                image: image,
                number_of_frames: imageMetadata["number_of_frames"],
                manufacturer: imageMetadata["manufacturer"]
            });

            if (this.props.add_controls) {
                cornerstoneTools.mouseInput.enable(element);
                cornerstoneTools.mouseWheelInput.enable(element);
                cornerstoneTools.wwwc.activate(element, 1); // ww/wc is the default tool for left mouse button
                //cornerstoneTools.pan.activate(element, 2); // pan is the default tool for middle mouse button
                cornerstoneTools.zoom.activate(element, 4); // zoom is the default tool for right mouse button
                cornerstoneTools.zoomWheel.activate(element); // zoom is the default tool for middle mouse wheel
            }
        }
    }

    onClickViewerMode() {

        var element = this.imageDiv;

        if (this.state.viewer_mode === "window_level") {

            cornerstoneTools.wwwc.deactivate(element, 1);
            cornerstoneTools.pan.activate(element, 3);

            this.setState({
                viewer_mode: "pan"
            });

        } else if (this.state.viewer_mode === "pan") {

            cornerstoneTools.pan.deactivate(element, 2);
            cornerstoneTools.wwwc.activate(element, 1);

            this.setState({
                viewer_mode: "window_level"
            });

        }
    }

    renderToolbox() {

        var imageLoaded = this.state.loaded;

        if (imageLoaded) {

            var icon;
            var style;

            if (this.state.viewer_mode === "pan") {

                style =
                    {
                        fontSize: "15pt",
                        marginTop: "4px"
                    }

                icon = <i className="fi-paint-bucket" style={style}></i>;

            } else if (this.state.viewer_mode === "window_level") {

                style =
                    {
                        fontSize: "13pt",
                        marginTop: "6px"
                    }

                icon = <i className="fi-arrows-out" style={style}></i>;
            }

            return (
                <div className="rkt-viewer-dicom-one-frame-right-menu">
                    <RktButtonIconCircleTextBig text="" onclickbutton={this.onClickViewerMode.bind(this)} icon={icon} />
                </div>
            );
        }

    }

    renderImageProcessingButton() {

        var imageLoaded = this.state.loaded;

        if (imageLoaded) {

            return (
                <div className="grid-block-vertical button shrink" id="button-to-crop" onClick={this.cropImageFromCanvas.bind(this)}>Click to crop</div>
            );
        }

    }

    renderLoading() {

        if (this.state.loaded === false) {
            return (<RktAnimationLoading />);
        }

    }

    cropImageFromCanvas() {
        var element = this.imageDiv;

        cropImageFromCanvas(element, this.displayFilteredImage);
    }

    render() {

        return (
            <div className="grid-block rkt-dicom-viewer-one-frame">
                {this.renderLoading()}
                {this.renderToolbox()}
                {this.renderImageProcessingButton()}

                <div className="grid-block-vertical button shrink" id="button-to-crop" onClick={this.cropImageFromCanvas.bind(this)}>Click to crop</div>
                <div className="dicomImage" ref={(imgDiv) => this.imageDiv = imgDiv}
                    style={{ top: "0px", left: "0px", width: "100%", height: this.props.canvas_height, overflow: "hidden" }} />
                <div className="croppedDicomImage" ref={(imgDiv) => this.imageFilterDiv = imgDiv}
                    style={{ top: "0px", left: "0px", width: "100%", height: this.props.canvas_height, overflow: "hidden" }}
                />
            </div>
        );
    }
}

RktViewerDicomOneFrame.defaultProps = {
    img_url: "",
    add_controls: true,
    img_source: "wado"
};