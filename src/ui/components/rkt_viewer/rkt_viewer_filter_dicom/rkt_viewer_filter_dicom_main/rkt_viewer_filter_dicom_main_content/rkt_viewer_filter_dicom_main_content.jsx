import React, { Component } from 'react';

// components
import RktButtonIconCircleTextBig from './../../../../rkt_button/rkt_button_icon_circle_text_big/rkt_button_icon_circle_text_big';
import RktAnimationLoading from './../../../../rkt_animation/rkt_animation_loading/rkt_animation_loading';
// actions
import { loadDicom } from './rkt_viewer_filter_dicom_main_content_actions.js';
//Using global variables
const cornerstone = window.cornerstone;
const cornerstoneTools = window.cornerstoneTools;

export default class RktViewerFilterDicomMainContent extends Component {

    constructor(props) {
        super(props);
        this.state = {
            loaded: false,
            viewer_mode: "window_level",
            filter_mode: "disable_filtering"
        }

        this.displayImage = this.displayImage.bind(this);
        this.onMouseMove = this.onMouseMove.bind(this);
        this.onMouseDown = this.onMouseDown.bind(this);
        this.displayFilteringAnnotations = this.displayFilteringAnnotations.bind(this);
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
            image: image,
        });

        if (this.props.add_controls) {
            cornerstoneTools.mouseInput.enable(element);
            cornerstoneTools.mouseWheelInput.enable(element);
            cornerstoneTools.wwwc.activate(element, 1); // ww/wc is the default tool for left mouse button
            cornerstoneTools.zoom.activate(element, 4); // zoom is the default tool for right mouse button
            cornerstoneTools.zoomWheel.activate(element); // zoom is the default tool for middle mouse wheel
        }
    }

    //*****[Mouse events]******
    onMouseMove(e, eventData) {
        var element = this.imageDiv;

        this.setState({
            x: eventData.currentPoints.image.x,
            y: eventData.currentPoints.image.y,
            filtering_annotation: eventData.currentPoints.image.x
        })
        //console.log("x: "+this.state.x);
        cornerstone.updateImage(element);
    }

    onMouseDown(e, eventData) {
        var element = this.imageDiv;

        this.setState({
            mouseDown: true
        });

        cornerstone.updateImage(element);
    }
    //*****[Mouse events]******

    deactivateControls() {

        var element = this.imageDiv;

        cornerstoneTools.pan.deactivate(element, 2);
        cornerstoneTools.wwwc.deactivate(element, 1);
        cornerstoneTools.length.deactivate(element, 1);
        cornerstoneTools.rectangleRoi.deactivate(element, 1);
        cornerstoneTools.highlight.deactivate(element, 1);

        element.onCornerstoneToolsMouseMove = false;
        element.onCornerstoneToolsMouseDown = false;
        element.onCornerstoneImageRendered = false;

        this.removeControlsAnnotations();
    }

    removeControlsAnnotations() {

        var element = this.imageDiv;
        var toolStateManager = cornerstoneTools.getElementToolStateManager(element);
        toolStateManager.clear(element)
        cornerstone.updateImage(element);

    }

    onClickViewerMode(viewermode) {

        var element = this.imageDiv;

        this.deactivateControls();

        this.setState({ viewer_mode: viewermode });

        // activation of the corresponding viewer mode control
        if (viewermode === "window_level") cornerstoneTools.wwwc.activate(element, 1);
        else if (viewermode === "pan") cornerstoneTools.pan.activate(element, 3);
        else if (viewermode === "annotation_length") cornerstoneTools.length.activate(element, 1);
        else if (viewermode === "annotation_rectangle") cornerstoneTools.rectangleRoi.activate(element, 1);
        else if (viewermode === "magnifying_glass") cornerstoneTools.highlight.activate(element, 1);

    }

    onClickFilterMode(filtermode) {
        var element = this.imageDiv;

        this.deactivateControls();

        this.setState({ filter_mode: filtermode });

        // linking of filter mode events to the image
        element.onCornerstoneToolsMouseMove = this.onMouseMove;
        element.onCornerstoneToolsMouseDown = this.onMouseDown;
        element.onCornerstoneImageRendered = this.displayFilteringAnnotations;

    }

    renderToolbox() {

        var imageLoaded = this.state.loaded;

        if (imageLoaded) {

            // VIEWER MODE buttons

            // Button length
            var styleIconLength, iconLength, buttonLength;
            // Button window level
            var styleWindowLevel, iconWindowLevel, buttonWindowLevel;
            // Button pan
            var stylePan, iconPan, buttonPan;
            // Button annotation rectangle
            var styleAnnotationRectangle, iconAnnotationRectangle, buttonAnnotationRectangle;
            // Button magnifying glass
            var styleMagnifyingGlass, iconMagnifyingGlass, buttonMagnifyingGlass;

            styleIconLength = { fontSize: "13pt", marginTop: "6px" }
            iconLength = <i className="fi-pencil" style={styleIconLength}></i>;

            styleWindowLevel = { fontSize: "12pt", marginTop: "6px" }
            iconWindowLevel = <i className="fi-paint-bucket" style={styleWindowLevel}></i>;

            stylePan = { fontSize: "10pt", marginTop: "9px" }
            iconPan = <i className="fi-arrows-out" style={stylePan}></i>;

            styleAnnotationRectangle = { fontSize: "12pt", marginTop: "7px" }
            iconAnnotationRectangle = <i className="fi-annotate" style={styleAnnotationRectangle}></i>;

            styleMagnifyingGlass = { fontSize: "12pt", marginTop: "6px" }
            iconMagnifyingGlass = <i className="fi-magnifying-glass" style={styleMagnifyingGlass}></i>


            buttonLength = <RktButtonIconCircleTextBig text="" onclickbutton={this.onClickViewerMode.bind(this, "annotation_length")} icon={iconLength} />;
            buttonWindowLevel = <RktButtonIconCircleTextBig text="" onclickbutton={this.onClickViewerMode.bind(this, "window_level")} icon={iconWindowLevel} />;
            buttonPan = <RktButtonIconCircleTextBig text="" onclickbutton={this.onClickViewerMode.bind(this, "pan")} icon={iconPan} />;
            buttonAnnotationRectangle = <RktButtonIconCircleTextBig text="" onclickbutton={this.onClickViewerMode.bind(this, "annotation_rectangle")} icon={iconAnnotationRectangle} />;
            buttonMagnifyingGlass = <RktButtonIconCircleTextBig text="" onclickbutton={this.onClickViewerMode.bind(this, "magnifying_glass")} icon={iconMagnifyingGlass} />;

            if (this.state.viewer_mode === "pan") {
                buttonPan = <RktButtonIconCircleTextBig text="" onclickbutton={this.onClickViewerMode.bind(this, "pan")} icon={iconPan} selected="true" />;
            } else if (this.state.viewer_mode === "window_level") {
                buttonWindowLevel = <RktButtonIconCircleTextBig text="" onclickbutton={this.onClickViewerMode.bind(this, "window_level")} icon={iconWindowLevel} selected="true" />;
            } else if (this.state.viewer_mode === "annotation_length") {
                buttonLength = <RktButtonIconCircleTextBig text="" onclickbutton={this.onClickViewerMode.bind(this, "annotation_length")} icon={iconLength} selected="true" />;
            } else if (this.state.viewer_mode === "annotation_rectangle") {
                buttonAnnotationRectangle = <RktButtonIconCircleTextBig text="" onclickbutton={this.onClickViewerMode.bind(this, "annotation_rectangle")} icon={iconAnnotationRectangle} selected="true" />;
            } else if (this.state.viewer_mode === "magnifying_glass") {
                buttonMagnifyingGlass = <RktButtonIconCircleTextBig text="" onclickbutton={this.onClickViewerMode.bind(this, "magnifying_glass")} icon={iconMagnifyingGlass} selected="true" />;
            }

            // FILTERING MODE BUTTONS

            // Button add peak;
            var styleAddPeak, iconAddPeak, buttonAddPeak;

            // Button modify peak
            var styleModifyPeak, iconModifyPeak, buttonModifyPeak;

            // Button remove peak
            var styleRemovePeak, iconRemovePeak, buttonRemovePeak;

            // Button select cardiac cycle
            var styleSelectCardiacCycle, iconSelectCardiacCycle, buttonSelectCardiacCycle;

            // Button disable filtering
            var styleDisableFiltering, iconDisableFiltering, buttonDisableFiltering;


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

            // RENDERING OF THE BUTTONS
            return (
                <div>
                    <div className="main-dicom-container-content-right-menu">
                        {buttonWindowLevel}
                        {buttonPan}
                        {buttonLength}
                        {buttonAnnotationRectangle}
                        {buttonMagnifyingGlass}
                    </div>
                    <div className="main-dicom-container-content-up-menu">
                        {buttonAddPeak}
                        {buttonModifyPeak}
                        {buttonRemovePeak}
                        {buttonSelectCardiacCycle}
                        {buttonDisableFiltering}
                        <div className="main-dicom-container-content-filter-mode">
                            {this.state.filter_mode}
                        </div>

                    </div>
                </div>
            );
        }
    }

    renderLoading() {

        if (this.state.loaded === false) {
            return (<RktAnimationLoading />);
        }

    }

    // TO DO
    displayFilteringAnnotations(e, eventData) {

        // // Different actions depending on the filter mode
        // switch (this.state.filter_mode) {

        //     case "add_peak":
        //         this.displayAnnotationLine(e, eventData);
        //         this.addPeak(e, eventData);
        //         break;

        //     case "modify_peak":
        //         this.displayAnnotationLine(e, eventData);
        //         this.modifyPeak(e, eventData);
        //         break;

        //     case "remove_peak":
        //         this.displayAnnotationLine(e, eventData);
        //         this.removePeak(e, eventData);
        //         break;

        //     case "select_cardiac_cycle":
        //         this.displayPeaks(e, eventData);
        //         this.fadeOutCycle(e, eventData);
        //         this.selectCycle(e, eventData);
        //         break;
        // }

        // // If 'peaks' is NOT empty in state:
        // if ((myComponent.state.peaks).length) {
        //     myComponent.displayPeaks(e, eventData); // Then, peaks are displayed
        // }

        // // If we have selected a cardiac cycle, we highlight it:
        // if ((myComponent.state.selectedCycle) && (myComponent.props.clickedbutton == "select")) {
        //     myComponent.highlightSelectedCycle(e, eventData);

        //     // put selectedCycle false in state?
        // }

    }

    render() {
        return (
            <div className="grid-block main-dicom-container-content">
                {this.renderLoading()}
                {this.renderToolbox()}
                <div className="dicomImage" ref={(imgDiv) => this.imageDiv = imgDiv}
                    style={{ top: "0px", left: "0px", width: "100%", height: this.props.canvas_height, overflow: "hidden" }}>
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