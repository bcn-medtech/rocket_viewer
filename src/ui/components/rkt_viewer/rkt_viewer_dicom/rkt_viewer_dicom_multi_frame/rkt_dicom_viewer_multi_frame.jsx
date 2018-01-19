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
import RktViewerDicomMultiFrameControls from './rkt_viewer_dicom_multi_frame_controls/rkt_viewer_dicom_multi_frame_controls';
import RktButtonIconCircleTextBig from './../../../rkt_button/rkt_button_icon_circle_text_big/rkt_button_icon_circle_text_big';
//actions
import { prepareLoadDicom } from './rkt_dicom_viewer_multi_frame_actions.js';
//Using global variables
const cornerstone = window.cornerstone;
const cornerstoneTools = window.cornerstoneTools;
const cornerstoneWADOImageLoader = window.cornerstoneWADOImageLoader;

export default class StackDicomPlayer extends Component {

    constructor(props) {
        super(props);

        this.state = {
            loaded: false,
            filename: "",
            isPlaying: false,
            currentFrame: 0,
            numFrames: 0,
            stack: {
                currentImageIdIndex: 0,
                imageIds: []
            }

        };
        this.componentDidMount = this.componentDidMount.bind(this);
        this.onImageLoaded = this.onImageLoaded.bind(this);
        this.loadImage = this.loadImage.bind(this);
        //this.selectImage = this.selectImage.bind(this);
        this.playStack = this.playStack.bind(this);
        this.onNewImage = this.onNewImage.bind(this);
    }

    componentWillUnmount() {
        if (this.state.isPlaying) {
            cornerstoneTools.stopClip(this.imageDiv);
            //this.setState({isPlaying : false})
        }
    }

    componentDidMount() {
        this.loadImage();

    }
    componentDidUpdate(prevProps) {

        if (prevProps.imageUrl !== this.props.imageUrl) {
            this.loadImage()
        }

    }

    initializeMultiframeControls(component, imageIdsArray, ImageIdsCurrentIndex) {
        // Initialize range input
        var range;
        range = document.getElementById(("slice-range-" + component.props.elementId));

        // Set minimum and maximum value
        range.min = 0;
        range.step = 1;
        range.max = imageIdsArray.length - 1;

        // Set current value
        range.value = ImageIdsCurrentIndex;
    }

    loadImage() {

        if (this.state.isPlaying && this.state.loaded) {

            cornerstoneTools.stopClip(this.imageDiv);

            this.setState({
                isPlaying: false,
                loaded: false
            });
        } else {
            this.setState({
                loaded: false
            });
        }

        var element = this.imageDiv; //$('#dicomImage').get(0);
        cornerstone.enable(element);

        //let url = this.props.img_url;
        let img_source = this.props.img_source;
        let image = this.props.image;

        var myComponent = this;

        prepareLoadDicom(image, img_source, function (loadDicomPrepared) {

            myComponent.setState({
                numFrames: loadDicomPrepared.numFrames,
                stack: loadDicomPrepared.stack
            });


            var stack = loadDicomPrepared.stack;
            var imageIdsArray = stack.imageIds;
            var currentImageIdIndex = stack.currentImageIdIndex;
            var url = image.sharedCacheKey;

            myComponent.initializeMultiframeControls(myComponent, imageIdsArray, currentImageIdIndex);

            element.onCornerstoneNewImage = myComponent.onNewImage;

            cornerstone.loadAndCacheImage(imageIdsArray[0]).then(

                function (image) {
                    // now that we have an image frame in the cornerstone cache, we can decrement
                    // the reference count added by load() above when we loaded the metadata.  This way
                    // cornerstone will free all memory once all imageId's are removed from the cache
                    cornerstoneWADOImageLoader.dataSetCacheManager.unload(url);

                    cornerstone.displayImage(element, image);

                    cornerstoneTools.addStackStateManager(element, ['stack', 'playClip']);
                    cornerstoneTools.addToolState(element, 'stack', stack);
                    // Enable all tools we want to use with this element
                    //cornerstoneTools.stackScroll.activate(element, 1);
                    //cornerstoneTools.stackScrollWheel.activate(element);

                    cornerstoneTools.mouseInput.enable(element);
                    cornerstoneTools.mouseWheelInput.enable(element);
                    //cornerstoneTools.wwwc.activate(element, 1); // ww/wc is the default tool for left mouse button
                    //cornerstoneTools.pan.activate(element, 1); // pan is the default tool for middle mouse button
                    //cornerstoneTools.zoom.activate(element, 4); // zoom is the default tool for right mouse button
                    //cornerstoneTools.zoomWheel.activate(element); // zoom is the default tool for middle mouse wheel
                    //cornerstoneTools.scrollIndicator.enable(element);


                    myComponent.setState({
                        loaded: true
                    });

                },
                function (err) {
                    alert(err);
                });

        });
    }

    playStack() {
        if (this.state.isPlaying) {
            cornerstoneTools.stopClip(this.imageDiv);
            this.setState({ isPlaying: false })
        } else {
            cornerstoneTools.playClip(this.imageDiv, 40);
            this.setState({ isPlaying: true })

        }

    }

    onImageLoaded(image) {
        
    }

    onNewImage(e, data) {

        if (this.state.loaded) {

            var newImageIdIndex = this.state.stack.currentImageIdIndex;

            this.setState({
                currentFrame: newImageIdIndex
            });

            //var playClipToolData = cornerstoneTools.getToolState(this.imageDiv, 'playClip');
        }

    }

    removeAnnotations() {

        var element = this.imageDiv;

        var stackToolDataSource = cornerstoneTools.getToolState(element, 'stack');
        //var toolStateManager = cornerstoneTools.stackToolDataSource(element);
        //toolStateManager.clear(element)
        //cornerstone.updateImage(element);

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

    selectImage(event) {
        var targetElement = this.imageDiv;

        // Get the range input value
        var newImageIdIndex = parseInt(event.currentTarget.value, 10);

        // Get the stack data
        var stackToolDataSource = cornerstoneTools.getToolState(targetElement, 'stack');
        if (stackToolDataSource === undefined) {
            return;
        }
        var stackData = stackToolDataSource.data[0];

        // Switch images, if necessary
        if (newImageIdIndex !== stackData.currentImageIdIndex && stackData.imageIds[newImageIdIndex] !== undefined) {

            cornerstone.loadAndCacheImage(stackData.imageIds[newImageIdIndex]).then(function (image) {

                var viewport = cornerstone.getViewport(targetElement);

                stackData.currentImageIdIndex = newImageIdIndex;
                cornerstone.displayImage(targetElement, image, viewport);

            });
        }
    }

    getImageCanvas() {
        return this.state.image.getCanvas();
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
                <div className="rkt-viewer-dicom-multi-frame-right-menu">
                    {buttonWindowLevel}
                    {buttonPan}
                    {/*buttonLength}
                    {buttonAnnotationRectangle}
            {buttonMagnifyingGlass*/}
                </div>
            );
        }
    }

    render() {

        let elementId = this.props.elementId;

        return (
            <div className="grid-block vertical" id={"dicomViewerContainer-" + elementId}>
                <div className="grid-block">
                    <div className="dicomImage" ref={(imgDiv) => this.imageDiv = imgDiv}
                        style={{ top: "0px", left: "0px", width: "100%", height: this.props.canvas_height, overflow: "hidden" }}>
                    </div>
                </div>
                <div className="grid-block shrink">
                    <RktViewerDicomMultiFrameControls
                        elementId={elementId}
                        isPlaying={this.state.isPlaying}
                        onPlayClick={this.playStack}
                        onChangeTime={this.selectImage.bind(this)}
                        currentValue={this.state.currentFrame}
                        totalFrames={this.state.numFrames}
                    />
                </div>
                {this.renderToolbox()}
            </div>
        );
    }
}

StackDicomPlayer.defaultProps = {
    file: "",
    numFrames: 1,
    addControls: false,
    canvasWidth: 200,
};