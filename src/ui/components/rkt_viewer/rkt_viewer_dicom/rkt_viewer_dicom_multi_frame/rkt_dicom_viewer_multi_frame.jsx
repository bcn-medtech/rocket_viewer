import React, { Component } from 'react';
//components
import RktViewerDicomMultiFrameControls from './rkt_viewer_dicom_multi_frame_controls/rkt_viewer_dicom_multi_frame_controls';
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

    componentWillUnmount(){
        if(this.state.isPlaying){
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

    initializeMultiframeControls(component,imageIdsArray, ImageIdsCurrentIndex){
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
                    loaded:false
                });
        }else{
            this.setState({ 
                loaded:false
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

            myComponent.initializeMultiframeControls(myComponent,imageIdsArray,currentImageIdIndex);

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
        console.log(image);
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
        //console.log(stackData);

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