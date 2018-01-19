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
import RktButtonIconCircleTextBig from './../../../../rkt_button/rkt_button_icon_circle_text_big/rkt_button_icon_circle_text_big';
import RktAnimationLoading from './../../../../rkt_animation/rkt_animation_loading/rkt_animation_loading';
// actions
import { loadDicom, getImageName, cloneCanvas } from './rkt_viewer_filter_dicom_main_content_actions.js';
//Using global variables
const cornerstone = window.cornerstone;
const cornerstoneTools = window.cornerstoneTools;

export default class RktViewerFilterDicomMainContent extends Component {

    constructor(props) {
        super(props);
        this.state = {
            loaded: false,
            viewer_mode: "window_level",
            filter_mode: "disable_filtering",
            peaks: []
        }

        this.displayImage = this.displayImage.bind(this);
        this.onMouseMove = this.onMouseMove.bind(this);
        this.onMouseDown = this.onMouseDown.bind(this);
        this.displayFilteringAnnotations = this.displayFilteringAnnotations.bind(this);
        this.cropImage = this.cropImage.bind(this);

        this.originalImage = false;
        this.nameOriginalIMage = undefined;
    }

    componentDidMount() {
        this.setState({
            loaded: false,
        });

        var element = this.imageDiv;
        cornerstone.enable(element);

        var url = this.props.img_url;
        var img_source = this.props.img_source;
        loadDicom(url, img_source, this.displayImage);
    }

    displayImage(image) {

        var element = this.imageDiv;
        var viewport = cornerstone.getDefaultViewportForImage(element, image);
        cornerstone.displayImage(element, image, viewport);
        
        this.setState({
            loaded: true,
            image: image
        });
        
        var canvas = image.getCanvas();
        this.originalImage = cloneCanvas(canvas);

        var blob = this.props.img_url;
        this.nameOriginalImage = getImageName(blob);

        cornerstoneTools.mouseInput.enable(element);
        element.onCornerstoneToolsMouseMove = this.onMouseMove;
        element.onCornerstoneToolsMouseDown = this.onMouseDown;
        element.onCornerstoneImageRendered = this.displayFilteringAnnotations;

    }

    //*****[Mouse events]******
    onMouseMove(e, eventData) {
        var element = this.imageDiv;
        
        this.setState({
            x: eventData.currentPoints.image.x,
            y: eventData.currentPoints.image.y,
            filtering_annotation: eventData.currentPoints.image.x
        })

        cornerstone.updateImage(element);
    }

    onMouseDown(e, eventData) {
        var element = this.imageDiv;
        
        this.setState({
            selection: true // a point has been clicked in the image
        });

        cornerstone.updateImage(element);
    }
    //*****[Mouse events]******

    onClickFilterMode(filtermode) {
        this.setState({ 
            filter_mode: filtermode, 
            selectedCycle: false
         });
    }

    renderToolbox() {

        var imageLoaded = this.state.loaded;

        if (imageLoaded) {
            
            // FILTERING MODE BUTTONS

            var styleAddPeak, iconAddPeak, buttonAddPeak; // Button add peak;
            var styleModifyPeak, iconModifyPeak, buttonModifyPeak; // Button modify peak
            var styleRemovePeak, iconRemovePeak, buttonRemovePeak; // Button remove peak
            var styleSelectCardiacCycle, iconSelectCardiacCycle, buttonSelectCardiacCycle; // Button select cardiac cycle
            var styleDisableFiltering, iconDisableFiltering, buttonDisableFiltering; // Button disable filtering


            styleAddPeak = { fontSize: "13pt", marginTop: "7px" }
            iconAddPeak = <i className="fi-plus" style={styleAddPeak}></i>;

            styleModifyPeak = { fontSize: "13pt", marginTop: "6px" }
            iconModifyPeak = <i className="fi-pencil" style={styleModifyPeak}></i>;

            styleRemovePeak = { fontSize: "13pt", marginTop: "6px" }
            iconRemovePeak = <i className="fi-trash" style={styleRemovePeak}></i>;

            styleSelectCardiacCycle = { fontSize: "13pt", marginTop: "7px" }
            iconSelectCardiacCycle = <i className="fi-heart" style={styleSelectCardiacCycle}></i>

            styleDisableFiltering = { fontSize: "13pt", marginTop: "6px" }
            iconDisableFiltering = <i className="fi-lock" style={styleDisableFiltering}></i>


            buttonAddPeak = <RktButtonIconCircleTextBig text="" onclickbutton={this.onClickFilterMode.bind(this, "add_peak")} icon={iconAddPeak} />;
            buttonModifyPeak = <RktButtonIconCircleTextBig text="" onclickbutton={this.onClickFilterMode.bind(this, "modify_peak")} icon={iconModifyPeak} />;
            buttonRemovePeak = <RktButtonIconCircleTextBig text="" onclickbutton={this.onClickFilterMode.bind(this, "remove_peak")} icon={iconRemovePeak} />;
            buttonSelectCardiacCycle = <RktButtonIconCircleTextBig text="" onclickbutton={this.onClickFilterMode.bind(this, "select_cardiac_cycle")} icon={iconSelectCardiacCycle} />;
            buttonDisableFiltering = <RktButtonIconCircleTextBig text="" onclickbutton={this.onClickFilterMode.bind(this, "disable_filtering")} icon={iconDisableFiltering} />;


            if (this.state.filter_mode === "add_peak") {
                buttonAddPeak = <RktButtonIconCircleTextBig text="" onclickbutton={this.onClickFilterMode.bind(this, "add_peak")} icon={iconAddPeak} selected="true" />;
            } else if (this.state.filter_mode === "modify_peak") {
                buttonModifyPeak = <RktButtonIconCircleTextBig text="" onclickbutton={this.onClickFilterMode.bind(this, "modify_peak")} icon={iconModifyPeak} selected="true" />;
            } else if (this.state.filter_mode === "remove_peak") {
                buttonRemovePeak = <RktButtonIconCircleTextBig text="" onclickbutton={this.onClickFilterMode.bind(this, "remove_peak")} icon={iconRemovePeak} selected="true" />;
            } else if (this.state.filter_mode === "select_cardiac_cycle") {
                buttonSelectCardiacCycle = <RktButtonIconCircleTextBig text="" onclickbutton={this.onClickFilterMode.bind(this, "select_cardiac_cycle")} icon={iconSelectCardiacCycle} selected="true" />;
            } else if (this.state.filter_mode === "disable_filtering") {
                buttonDisableFiltering = <RktButtonIconCircleTextBig text="" onclickbutton={this.onClickFilterMode.bind(this, "disable_filtering")} icon={iconDisableFiltering} selected="true" />;
            }


            return (
                <div className="main-dicom-container-content-right-menu">
                    {buttonAddPeak}
                    {buttonModifyPeak}
                    {buttonRemovePeak}
                    {buttonSelectCardiacCycle}
                    {buttonDisableFiltering}
                </div>
            );
        }
    }

    renderLoading() {

        if (this.state.loaded === false) {
            return (<RktAnimationLoading />);
        }

    }

    renderCropButton() {

        return (<a className="grid-block crop-button" onClick={this.cropImage}>Crop image</a>);

    }

    displayFilteringAnnotations(e, eventData) {

        var filter_mode = this.state.filter_mode;

        // Different actions depending on the filter mode
        switch (filter_mode) {

            case "add_peak":
                this.displayAnnotationLine(e, eventData);
                this.addPeak(e, eventData);
                break;

            case "modify_peak":
                this.displayAnnotationLine(e, eventData);
                this.modifyPeak(e, eventData);
                break;

            case "remove_peak":
                this.displayAnnotationLine(e, eventData);
                this.removePeak(e, eventData);
                break;

            case "select_cardiac_cycle":
                this.displayPeaks(e, eventData);
                this.fadeOutCycle(e, eventData);
                this.selectCycle(e, eventData);
                break;

            default:
                break;
        }

        // If 'peaks' is NOT empty in state and we are in a filtering mode:
        if ((this.state.peaks).length && (filter_mode !== "disable_filtering")) {
            this.displayPeaks(e, eventData); // Then, peaks are displayed
        }

        // If we have selected a cardiac cycle, we highlight it:
        if ((this.state.selectedCycle) && (filter_mode === "select_cardiac_cycle")) {
            this.highlightSelectedCycle(e, eventData);
        }

    }

    // ***** FILTERING METHODS *****
    displayAnnotationLine(e, eventData) {

        var context = eventData.canvasContext.canvas.getContext('2d');
        context.lineWidth = "1"; // default lineWidth
        context.strokeStyle = "#0000FF"; // blue, default color

        var annotationPosition;

        // DIFFERENT LINEWIDTH in some cases:
        // In "modifyPeak()" (before clicking for the 1st time), OR always in "removePeak()":
        var filter_mode = this.state.filter_mode;
        if ((filter_mode === "remove_peak") ||
            ((filter_mode === "modify_peak") && (!this.state.annotationOfInterest))) {

            var peaks = this.state.peaks;
            annotationPosition = this.state.filtering_annotation;
            var pixelRange = 4;

            for (var numPeak = 0; numPeak < (peaks.length); numPeak++) {

                var startRange = peaks[numPeak] - pixelRange;
                var endRange = parseInt(peaks[numPeak], 10) + parseInt(pixelRange, 10); // parseInt() to make sure that 
                // variables are integers and do addition (of numbers) instead of concatenation (of strings)

                // if 'annotationPosition' is inside the following range:
                if ((annotationPosition > startRange) && (annotationPosition < endRange)) {
                    context.lineWidth = "5";
                    break;
                }
            }
        }

        // DIFFERENT STROKESTYLE (color of the line) in some cases:
        // case in "modifyPeak()", AFTER clicking for the 1st time
        if (this.state.annotationOfInterest) context.strokeStyle = "#FFFF00"; // yellow

        annotationPosition = { x: this.state.filtering_annotation, y: this.state.y } // "this.state.y" is obtained in "onMouseMove()"
        var handleStartCanvas = cornerstone.pixelToCanvas(eventData.element, annotationPosition);

        let element = this.imageDiv;
        var clientHeight = element.clientHeight;

        context.beginPath();
        context.moveTo(handleStartCanvas.x, 0);
        context.lineTo(handleStartCanvas.x, clientHeight);
        context.stroke();
        context.restore();
    }

    addPeak(e, eventData) {

        // If we click a point
        if (this.state.selection) {
            var peaks = this.state.peaks;
            peaks.push(this.state.filtering_annotation); // we add this peak at the end of 'peaks' in state
            peaks.sort(function (a, b) { return a - b }); // we sort the values in asceding order

            this.setState({
                peaks: peaks,
                selection: false
            });

        }
    }

    modifyPeak(e, eventData) {

        // If we click a point
        if (this.state.selection) {

            var peaks = this.state.peaks;

            // and 'annotationOfInterest' (peak that we want to modify) does NOT exist in state:
            if (!this.state.annotationOfInterest) {

                var annotationPosition = this.state.filtering_annotation;
                var pixelRange = 4;

                for (var numPeak = 0; numPeak < (peaks.length); numPeak++) {

                    var startRange = peaks[numPeak] - pixelRange;
                    var endRange = parseInt(peaks[numPeak], 10) + parseInt(pixelRange, 10); // parseInt() to make sure that 
                    // variables are integers and do addition (of numbers) instead of concatenation (of strings)

                    // if 'annotationPosition' is inside the following range:
                    if ((annotationPosition > startRange) && (annotationPosition < endRange)) {

                        this.setState({
                            annotationOfInterest: peaks[numPeak], // peak that we want to modify
                            selection: false
                        });

                        break;
                    }

                    else {
                        this.setState({
                            selection: false // In case the selection does not correspond to any peak,
                            // we annul 'selection' so that we have to click again, somewhere else
                        });
                    }
                }
            }

            else { // and 'annotationOfInterest' exists in state:

                var index = peaks.indexOf(this.state.annotationOfInterest); // we find where our selected peak is

                peaks[index] = this.state.filtering_annotation; // we change our selected peak for the current annotation (after selection)
                peaks.sort(function (a, b) { return a - b }); // we sort the values in asceding order

                this.setState({
                    peaks: peaks,
                    selection: false,
                    annotationOfInterest: false
                });
            }
        }
    }

    removePeak(e, eventData) {

        // If we click a point
        if (this.state.selection) {

            var peaks = this.state.peaks;
            var annotationPosition = this.state.filtering_annotation;

            var pixelRange = 4;

            for (var numPeak = 0; numPeak < (peaks.length); numPeak++) {

                var startRange = peaks[numPeak] - pixelRange;
                var endRange = parseInt(peaks[numPeak], 10) + parseInt(pixelRange, 10); // parseInt() to make sure that 
                // variables are integers and do addition (of numbers) instead of concatenation (of strings)

                // if 'annotationPosition' is inside the following range:
                if ((annotationPosition > startRange) && (annotationPosition < endRange)) {

                    // we remove this 'peaks[numPeak]' from 'peaks'
                    peaks.splice(numPeak, 1);

                    this.setState({
                        peaks: peaks,
                        selection: false
                    });

                    break;
                }

                else {
                    this.setState({
                        selection: false // In case the selection does not correspond to any peak,
                        // we annul 'selection' so that we have to click again, somewhere else
                    });
                }
            }
        }
    }

    selectCycle(e, eventData) {

        // If we click a point
        if (this.state.selection) {

            var peaks = this.state.peaks;
            var selectedPoint = this.state.filtering_annotation;

            for (var numPeak = 0; numPeak < (peaks.length) - 1; numPeak++) {

                // if 'selectedPoint' is between the two peaks of this loop:
                if ((selectedPoint > peaks[numPeak]) && (selectedPoint < peaks[numPeak + 1])) {

                    this.setState({
                        selectedCycle: numPeak + 1,
                        selection: false
                    });

                    break;
                }

                else {
                    this.setState({
                        selection: false // In case the selection does not correspond to any cycle,
                        // we annul 'selection' so that we have to click again, somewhere else
                    });
                }
            }
        }
    }

    fadeOutCycle(e, eventData) {

        var peaks = this.state.peaks;
        var context = eventData.canvasContext.canvas.getContext('2d');
        var selectedPoint = this.state.filtering_annotation;

        for (var numPeak = 0; numPeak < (peaks.length) - 1; numPeak++) {

            // if 'selectedPoint' is between the two peaks of this loop:
            if ((selectedPoint > peaks[numPeak]) && (selectedPoint < peaks[numPeak + 1])) {

                // FADE OUT OF THIS SPECIFIC CARDIAC CYCLE

                //Turn transparency on
                context.globalAlpha = 0.3;
                context.fillStyle = "gray";

                let element = this.imageDiv;
                var clientHeight = element.clientHeight;

                //Coordenadas de imagen
                var coordsRectangle = { x: peaks[numPeak], y: 0 };
                var widthCycle = peaks[numPeak + 1] - peaks[numPeak];
                var sizeRectangle = { x: widthCycle, y: clientHeight };
                //Obtención de coordenadas del canvas teniendo las coordenadas de imagen
                var handleCoordsRect = cornerstone.pixelToCanvas(eventData.element, coordsRectangle);
                var handleSizeRect = cornerstone.pixelToCanvas(eventData.element, sizeRectangle);

                context.beginPath();
                context.fillRect(handleCoordsRect.x, 0, handleSizeRect.x, clientHeight);

                context.restore();
            }
        }

        context.globalAlpha = 1; // we reset the value so that canvas is not transparent  
    }

    displayPeaks(e, eventData) {
        
        var peaks = this.state.peaks;

        var context = eventData.canvasContext.canvas.getContext('2d');
        context.strokeStyle = "#FF0000"; // red, COLOR PEAKS LINES
        context.lineWidth = "1";

        // INFO FOR DISPLAYING NUMBERS
        context.fillStyle = "red";
        context.font = "20px bold";
        context.textAlign = "center";

        // y_pos of the NUMBER: below the middle of the canvas
        let element = this.imageDiv;
        var clientHeight = element.clientHeight;

        var handleData = cornerstone.pixelToCanvas(eventData.element, { x: 0, y: (clientHeight / 2) + 150 });
        var y_pos_number = handleData.y;


        context.beginPath(); // we start drawing

        if (peaks.length === 1) {
            var currentPositionInitialPeak = { x: peaks[0], y: 0 } // ONSET of the cardiac cycle

            //Obtención de coordenadas del canvas teniendo las coordenadas de imagen
            var handleStartCanvasInitialPeak = cornerstone.pixelToCanvas(eventData.element, currentPositionInitialPeak);

            // Vertical line at the selected point to display the peak
            context.moveTo(handleStartCanvasInitialPeak.x, 0);
            context.lineTo(handleStartCanvasInitialPeak.x, clientHeight);
        }

        else {
            for (var numPeak = 0; numPeak < (peaks.length) - 1; numPeak++) {

                // DISPLAY OF PEAKS:
                //Coordenadas de imagen
                var currentPositionOnset = { x: peaks[numPeak], y: 0 } // ONSET of the cardiac cycle
                var currentPositionOffset = { x: peaks[numPeak + 1], y: 0 } // OFFSET of the cardiac cycle

                //Obtención de coordenadas del canvas teniendo las coordenadas de imagen
                var handleStartCanvasOnset = cornerstone.pixelToCanvas(eventData.element, currentPositionOnset);
                var handleStartCanvasOffset = cornerstone.pixelToCanvas(eventData.element, currentPositionOffset);

                // 1. Vertical line at the ONSET of the cardiac cycle
                context.moveTo(handleStartCanvasOnset.x, 0);
                context.lineTo(handleStartCanvasOnset.x, clientHeight);
                // 2. Vertical line at the OFFSET of the cardiac cycle
                context.moveTo(handleStartCanvasOffset.x, 0);
                context.lineTo(handleStartCanvasOffset.x, clientHeight);

                // DISPLAY OF THE NUMBER THAT INDICATES THE CARDIAC CYCLE:
                // x_pos of the NUMBER: between the peaks of the cardiac cycle
                var x_pos_number = (handleStartCanvasOffset.x + handleStartCanvasOnset.x) / 2;
                context.fillText((numPeak + 1).toString(), x_pos_number, y_pos_number);
            }
        }
        context.stroke(); // we actually draw the path
        context.restore();

    }

    highlightSelectedCycle(e, eventData) {
        
        let element = this.imageDiv;
        var clientHeight = element.clientHeight;

        var peaks = this.state.peaks;
        var selectedCycle = this.state.selectedCycle;

        var context = eventData.canvasContext.canvas.getContext('2d');
        context.strokeStyle = "#228B22"; // green
        context.lineWidth = "4";

        // INFO FOR DISPLAYING NUMBERS
        context.fillStyle = "#00FF00"; // lighter green
        context.font = "20px bold";
        context.textAlign = "center";

        // y_pos of the NUMBER: below the middle of the canvas
        var handleData = cornerstone.pixelToCanvas(eventData.element, { x: 0, y: (clientHeight / 2) + 150 });
        var y_pos_number = handleData.y;

        //Coordenadas de imagen
        var coordsRectangle = { x: peaks[selectedCycle - 1], y: 0 };
        var widthCycle = peaks[selectedCycle] - peaks[selectedCycle - 1];

        var sizeRectangle = { x: widthCycle, y: clientHeight };
        //Obtención de coordenadas del canvas teniendo las coordenadas de imagen
        var handleCoordsRect = cornerstone.pixelToCanvas(eventData.element, coordsRectangle);
        var handleSizeRect = cornerstone.pixelToCanvas(eventData.element, sizeRectangle);

        context.beginPath();
        context.rect(handleCoordsRect.x, 0, handleSizeRect.x, clientHeight);

        // DISPLAY OF THE NUMBER THAT INDICATES THE SELECTED CARDIAC CYCLE:
        // x_pos of the NUMBER: between the peaks of the cardiac cycle
        var endRectangle = { x: peaks[selectedCycle], y: 0 };
        var handleEndRect = cornerstone.pixelToCanvas(eventData.element, endRectangle);
        var x_pos_number = (handleCoordsRect.x + handleEndRect.x) / 2;
        context.fillText((selectedCycle).toString(), x_pos_number, y_pos_number);

        context.stroke();
        context.restore();
    }
    // ***** END FILTERING METHODS *****

    cropImage(e, eventData) {

        var selectedCycle = this.state.selectedCycle;

        if (selectedCycle) {

            var peaks = this.state.peaks;
            var coords_peaks_cycle = [peaks[selectedCycle - 1], peaks[selectedCycle]];
             
            var canvas_image_to_crop = this.originalImage;
            var canvas_height = canvas_image_to_crop.height;
            var name_image = this.nameOriginalImage;

            var inputs_cropping_function = {
                "top_left_x": coords_peaks_cycle[0],
                "top_left_y": 0,
                "width": coords_peaks_cycle[1] - coords_peaks_cycle[0],
                "height": canvas_height
            }

            this.props.cropimage(canvas_image_to_crop, name_image, inputs_cropping_function);

        } else alert("You have to select a cardiac cycle");

    }

    render() {
        return (
            <div className="grid-block main-dicom-container-content">
                {this.renderLoading()}
                {this.renderToolbox()}
                {this.renderCropButton()}
                <div className="dicomImage" ref={(imgDiv) => this.imageDiv = imgDiv}
                    style={{ top: "0px", left: "0px", width: "100%" /*height: this.props.canvas_height,*/, overflow: "hidden" }}>
                </div>
            </div>

        );
    }
}

RktViewerFilterDicomMainContent.defaultProps = {
    img_url: "",
    add_controls: true,
    img_source: "filesystem"
}