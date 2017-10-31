import React, { Component } from 'react';
//import PubSub from 'pubsub-js'

//actions
import { isViewerLoadingAURLSource, loadDicom, /*getDicomNumFrames*/ } from './rkt_viewer_file_picker_grid_content_thumbnail_actions';

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
            elementWidth: this.imageDivContainer.clientWidth - 20,
            loaded: false,
            error: false
        });

        var file = this.props.file;
        var url = file.preview;

        if (file.type === "application/dicom") {
            this.loadAndDisplayDicom(url, file);
        }
    }

    componentWillUpdate(nextProps) {
        if (nextProps.file !== this.props.file) {
            if (nextProps.file.type === "application/dicom") {
                var element = this.imageDiv;
                cornerstone.disable(element);
            }
        }
    }

    componentDidUpdate(prevProps) {
        if (prevProps.file !== this.props.file) {

            var file = this.props.file;
            var url = file.preview;

            if (file.type === "application/dicom") {
                this.loadAndDisplayDicom(url, file);
            }
        }
    }

    loadAndDisplayDicom(url, file) {
        var url_to_load, img_source;

        if (isViewerLoadingAURLSource(url)) {

            img_source = "wado";
            url_to_load = url;

        } else {
            img_source = "filesystem";
            url_to_load = file;
        }

        loadDicom(url_to_load, img_source, this.onDicomLoaded.bind(this), this.onErrorLoading.bind(this));
    }


    onErrorLoading(err) {
        this.setState({
            error: true
        });
        this.props.onLoaded(null);
    }

    onDicomLoaded(image) {
        var element = this.imageDiv;
        cornerstone.enable(element);
        var viewport = cornerstone.getDefaultViewportForImage(element, image);

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
        var file = this.props.file;
        var url = file.preview;
        // UNNECESSARY
        //var isStack =  getDicomNumFrames(this.state.image) > 1 ? true : false;
        
        this.props.onClick(index, file, url);
    }
    
    // getManufacturer() {
    //     var value = "";
    //     if (this.state.loaded) {
    //         value = this.state.image.data.string('x00080070');
    //     }
    //     return value;
    // }

    // getFramesNumber() {
    //     var value = 0;
    //     if (this.state.loaded) {
    //         value = this.state.image.data.string('x00280008');
    //     }
    //     return value;
    // }

    // getImageCanvas() {
    //     return this.state.image.getCanvas();
    // }

    // getImage() {
    //     var image = new Image();
    //     image.src = this.state.image.getCanvas().toDataURL("image/png");
    //     return image;
    // }

    // getFilename() {
    //     // let url = this.props.imgUrl;
    //     // console.log(url);
    //     // var filename = url.substring(url.lastIndexOf('/') + 1);

    //     var filename = this.props.file.name;
    //     return filename
    // }

    

    render() {

        return (

            <div style={{ position: "relative" }}
                className={this.props.isSelected ? "container-thumbnail selected" : "container-thumbnail"}
                unselectable='on' onClick={this.handleThumbnailClicked.bind(this)} ref={(imgDivContainer) => this.imageDivContainer = imgDivContainer}>

                <div className="image-thumbnail" ref={(imgDiv) => this.imageDiv = imgDiv}
                    style={{ top: "0px", left: "0px", width: this.state.elementWidth, height: this.state.elementWidth * 0.75, background: "black" }}>
                    {this.state.error && <span className="error-not-image">Not a valid image</span>}
                    {(this.state.loaded === false && this.state.error === false) && <span className="loading-icon rotating">Loading</span>}
                </div>

                <label className="image-filename">
                    {this.state.error && <i className="fi-alert"></i>}
                    {this.props.file.name}
                </label>
            </div>
        );
    }
}

RktViewerFilePickerGridContentThumbnail.defaultProps = {
    imgUrl: "",
    canvasWidth: 200,
};