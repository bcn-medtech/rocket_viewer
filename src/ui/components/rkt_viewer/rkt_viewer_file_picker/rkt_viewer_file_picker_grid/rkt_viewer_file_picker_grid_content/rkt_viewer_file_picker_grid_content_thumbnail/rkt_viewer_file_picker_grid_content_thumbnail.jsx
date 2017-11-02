import React, { Component } from 'react';
//import PubSub from 'pubsub-js'

//actions
import { isViewerLoadingAURLSource, loadDicom, getImageName/*getDicomNumFrames*/ } from './rkt_viewer_file_picker_grid_content_thumbnail_actions';

//Using global variables
const cornerstone = window.cornerstone;

export default class RktViewerFilePickerGridContentThumbnail extends Component {

    constructor(props) {
        super(props);

        this.state = {
            imageId: null,
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
        var img_source, img_url;

        // and what if "file" is undefined and "url" does exist?
        if ((files !== undefined) && (files[0].type === "application/dicom")) {
            img_source = "filesystem";
            img_url = files;
        }

        loadDicom(img_url, img_source, this.onDicomLoaded.bind(this), this.onErrorLoading.bind(this))
    }

    onErrorLoading(err) {
        this.setState({
            error: true
        });
        this.props.onLoaded(null);
    }

    onDicomLoaded(image) {
        var element = this.imageThumbnail;
        cornerstone.enable(element);
        var viewport = cornerstone.getDefaultViewportForImage(element, image);

        // image is displayed
        cornerstone.displayImage(element, image, viewport);

        this.setState({
            loaded: true,
            image: image,
            error: false
        })

        // metadata of the dicom is passed to "Stats" component
        this.props.onLoaded(image.data);
    }

    handleThumbnailClicked() {
        var index = this.props.index;
        var files = this.props.files;
        var url = this.props.url;

        this.props.onClick(index, files, url);
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