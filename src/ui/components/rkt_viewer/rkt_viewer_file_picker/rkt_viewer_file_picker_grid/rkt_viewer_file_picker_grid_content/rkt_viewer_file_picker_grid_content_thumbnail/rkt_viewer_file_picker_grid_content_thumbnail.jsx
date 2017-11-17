import React, { Component } from 'react';
//import PubSub from 'pubsub-js'

//actions
import { isViewerLoadingAURLSource, getViewerType, loadImage, getImageName } from './rkt_viewer_file_picker_grid_content_thumbnail_actions';

//Using global variables
const cornerstone = window.cornerstone;

export default class RktViewerFilePickerGridContentThumbnail extends Component {

    constructor(props) {
        super(props);

        this.state = {
            imageId: null,
            viewerType:undefined,
            loaded: false,
            error: false,
            elementWidth: this.props.canvasWidth,
        };
    }

    componentDidMount() {

        this.setState({
            elementWidth: this.containerThumbnail.clientWidth,// - 20,
            loaded: false,
            error: false
        });

        var files = this.props.files;
        var url = this.props.url;
        
        var myComponent = this;

        getViewerType(files, url, function(viewerType) {
            myComponent.setState({
                viewerType: viewerType
            })

            loadImage(viewerType, files, url, myComponent.onImageLoaded.bind(myComponent), myComponent.onErrorLoading.bind(myComponent));
        });

    }

    onErrorLoading(err) {
        this.setState({
            error: true
        });
        this.props.onLoaded(null);
    }

    onImageLoaded(cornerstoneImage) {
        var element = this.imageThumbnail;
        cornerstone.enable(element);
        var viewport = cornerstone.getDefaultViewportForImage(element, cornerstoneImage);

        // image is displayed
        cornerstone.displayImage(element, cornerstoneImage, viewport);

        this.setState({
            loaded: true,
            image: cornerstoneImage,
            error: false
        })

        // metadata of the dicom is passed to "Stats" component
        this.props.onLoaded(cornerstoneImage.data);
    }

    handleThumbnailClicked() {
        var index = this.props.index;
        var files = this.props.files;
        var url = this.props.url;
        var viewerType = this.state.viewerType;

        var selectedCanvas = document.getElementsByTagName("canvas");
        console.log(selectedCanvas);
        console.log(selectedCanvas[0].toDataURL());
        console.log(selectedCanvas[1].toDataURL());
        console.log(selectedCanvas[2].toDataURL());

        this.props.onClick(index, files, url, viewerType);
    }

    render() {

        return (
            <div>
                <a style={{ position: "relative" }}
                    className="grid-block vertical container-thumbnail"
                    unselectable='on'
                    onClick={this.handleThumbnailClicked.bind(this)}
                    ref={(containerThumbnail) => this.containerThumbnail = containerThumbnail}>

                    <div className={this.props.isSelected ? "grid-block image-thumbnail selected" : "grid-block image-thumbnail"}
                        ref={(imageThumbnail) => this.imageThumbnail = imageThumbnail}
                        style={{ top: "0px", left: "0px", width: this.state.elementWidth, height: this.state.elementWidth * 0.75, background: "black" }}>
                        {this.state.error && <span className="error-not-image">Not a valid image</span>}
                        {(this.state.loaded === false && this.state.error === false) && <span className="loading-icon rotating">Loading</span>}
                    </div>

                    <div className="grid-block image-filename">
                        {this.state.error && <i className="fi-alert"></i>}
                        {getImageName(this.props.files, this.props.url)}
                    </div>
                </a>
            </div>
        );
    }
}

RktViewerFilePickerGridContentThumbnail.defaultProps = {
    imgUrl: "",
    canvasWidth: 200,
};