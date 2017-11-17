import React, { Component } from 'react';
//components
import RktButtonIconCircleTextBig from './../../../rkt_button/rkt_button_icon_circle_text_big/rkt_button_icon_circle_text_big';
import RktAnimationLoading from './../../../rkt_animation/rkt_animation_loading/rkt_animation_loading';
//actions
import { loadDicom, getImageMetadata } from './rkt_viewer_dicom_one_frame_actions.js';
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
    }

    componentDidMount() {

        this.setState({
            loaded: false,
            viewer_mode: "window_level"
        });

        var element = this.imageDiv;
        cornerstone.enable(element);
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
        cornerstone.enable(element);
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
                cornerstoneTools.zoom.activate(element, 4); // zoom is the default tool for right mouse button
                cornerstoneTools.zoomWheel.activate(element); // zoom is the default tool for middle mouse wheel
            }
        }
    }

    removeAnnotations() {

        var element = this.imageDiv;
        var toolStateManager = cornerstoneTools.getElementToolStateManager(element);
        toolStateManager.clear(element)
        cornerstone.updateImage(element);

    }

    deactivateControls() {

        var element = this.imageDiv;
        cornerstoneTools.pan.deactivate(element, 2);
        cornerstoneTools.wwwc.deactivate(element, 1);
        cornerstoneTools.length.deactivate(element, 1);
        cornerstoneTools.rectangleRoi.deactivate(element, 1);
        cornerstoneTools.highlight.deactivate(element, 1);
        this.removeAnnotations();

    }

    onClickViewerMode(viewermode) {

        var element = this.imageDiv;

        this.deactivateControls();

        if (viewermode === "window_level") {

            cornerstoneTools.wwwc.activate(element, 1);

            this.setState({
                viewer_mode: "window_level"
            });

        } else if (viewermode === "pan") {


            cornerstoneTools.pan.activate(element, 3);

            this.setState({
                viewer_mode: "pan"
            });

        } else if (viewermode === "annotation_length") {

            cornerstoneTools.length.activate(element, 1);

            this.setState({
                viewer_mode: "annotation_length"
            });

        } else if (viewermode === "annotation_rectangle") {

            cornerstoneTools.rectangleRoi.activate(element, 1);

            this.setState({
                viewer_mode: "annotation_rectangle"
            });
        } else if (viewermode === "magnifying_glass") {

            cornerstoneTools.highlight.activate(element, 1);

            this.setState({
                viewer_mode: "magnifying_glass"
            });
        }
    }

    renderToolbox() {


        var imageLoaded = this.state.loaded;

        if (imageLoaded) {

            //Button length;
            var styleIconLength;
            var iconLength;
            var buttonLength;

            //Button window level
            var styleWindowLevel;
            var iconWindowLevel;
            var buttonWindowLevel;

            //Button pan
            var stylePan;
            var iconPan;
            var buttonPan;

            //Button annotation rectangle
            var styleAnnotationRectangle;
            var iconAnnotationRectangle;
            var buttonAnnotationRectangle;

            //button magnifying glass
            var styleMagnifyingGlass;
            var iconMagnifyingGlass;
            var buttonMagnifyingGlass;

            styleIconLength =
                {
                    fontSize: "13pt",
                    marginTop: "6px"
                }
            iconLength = <i className="fi-pencil" style={styleIconLength}></i>;

            styleWindowLevel =
                {
                    fontSize: "12pt",
                    marginTop: "6px"
                }
            iconWindowLevel = <i className="fi-paint-bucket" style={styleWindowLevel}></i>;

            stylePan =
                {
                    fontSize: "10pt",
                    marginTop: "9px"
                }

            iconPan = <i className="fi-arrows-out" style={stylePan}></i>;

            styleAnnotationRectangle =
                {
                    fontSize: "12pt",
                    marginTop: "7px"
                }

            iconAnnotationRectangle = <i className="fi-annotate" style={styleAnnotationRectangle}></i>;

            styleMagnifyingGlass =
                {
                    fontSize: "12pt",
                    marginTop: "6px"
                }

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

            return (
                <div className="rkt-viewer-dicom-one-frame-right-menu">
                    {buttonWindowLevel}
                    {buttonPan}
                    {buttonLength}
                    {buttonAnnotationRectangle}
                    {buttonMagnifyingGlass}
                </div>
            );
        }


    }

    renderLoading() {

        if (this.state.loaded === false) {
            return (<RktAnimationLoading />);
        }

    }

    render() {

        return (
            <div className="grid-block rkt-dicom-viewer-one-frame">
                {this.renderLoading()}
                {this.renderToolbox()}
                <div className="dicomImage" ref={(imgDiv) => this.imageDiv = imgDiv}
                    style={{ top: "0px", left: "0px", width: "100%", height: this.props.canvas_height, overflow: "hidden" }}>
                </div>
            </div>
        );
    }
}

RktViewerDicomOneFrame.defaultProps = {
    img_url: "",
    add_controls: true,
    img_source: "wado"
};