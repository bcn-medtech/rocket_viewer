import React, { Component, PropTypes } from 'react';
//import PubSub from 'pubsub-js'

//Using global variables
const cornerstone = window.cornerstone;
const cornerstoneWADOImageLoader = window.cornerstoneWADOImageLoader;

export default class RktViewerThumbnail extends Component {

    constructor(props) {
        super(props);

        this.state = {
            imageId: null,
            loaded: false,
            error:false,
            elementWidth : this.props.canvasWidth,
        };

        // This binding is necessary to make "this" work in the callback
        this.loadLocalImage = this.loadLocalImage.bind(this);
        this.componentDidMount = this.componentDidMount.bind(this);
        this.componentDidUpdate = this.componentDidUpdate.bind(this);
        this.componentWillUnmount = this.componentWillUnmount.bind(this);
        this.getManufacturer = this.getManufacturer.bind(this);
        this.getFramesNumber = this.getFramesNumber.bind(this);
        this.getFilename = this.getFilename.bind(this);
        this.onImageLoaded = this.onImageLoaded.bind(this);
        this.onErrorLoading = this.onErrorLoading.bind(this);
        this.loadWADOImage = this.loadWADOImage.bind(this);
        this.handleClick = this.handleClick.bind(this);
    }

    componentDidMount() {
        this.setState({
            elementWidth : this.imageDivContainer.clientWidth -20
        });
        this.loadWADOImage();
    }
    componentWillUpdate(nextProps){
        if(nextProps.imgUrl !== this.props.imgUrl){
            var element = this.imageDiv;
            cornerstone.disable(element);
        }

    }

    componentDidUpdate(prevProps){
        if(prevProps.imgUrl !== this.props.imgUrl){
            this.loadWADOImage();
        }
    }
    componentWillUnmount(){

        let url = this.props.imgUrl;
        // prefix the url with wadouri: so cornerstone can find the image loader

        var imageId = "wadouri:" + url + "?frame=0";
        //console.log("DicomPreview will unmount");

        //cornerstone.removeImagePromise(imageId)
    }

    loadLocalImage(url){
        var imageId = cornerstoneWADOImageLoader.fileManager.add(url);
        cornerstone.loadImage(imageId).then(
            this.onImageLoaded,
            function(err) {
                alert(err);
        });

    }

    loadWADOImage(){
        this.setState({
            loaded: false,
            error:false
        });
        let url = this.props.imgUrl;
        // prefix the url with wadouri: so cornerstone can find the image loader
        var imageId = "wadouri:" + url + "?frame=0";
        try {
            var start = new Date().getTime();
            cornerstone.loadAndCacheImage(imageId).then(this.onImageLoaded, this.onErrorLoading);
        }
        catch(err) {
            this.onErrorLoading(err);
        }
    }

    onErrorLoading(err){
        this.setState({
            error:true
        });
        this.props.onLoaded(null);

    }

    onImageLoaded(image){
        //var element = $('#dicomImage').get(0);
        var element = this.imageDiv;
        cornerstone.enable(element);
        var viewport = cornerstone.getDefaultViewportForImage(element, image);


        cornerstone.displayImage(element, image, viewport);
        this.setState({
            loaded : true,
            image : image,
            error:false
        })
        this.props.onLoaded(image.data);
    }
    getManufacturer(){
        var value  = "";
        if( this.state.loaded){
            value = this.state.image.data.string('x00080070');
        }
        return value;
    }

    getFramesNumber(){
        var value  = 0;
        if( this.state.loaded){
            value = this.state.image.data.string('x00280008');
        }
        return value;
    }

    getImageCanvas(){
        return this.state.image.getCanvas();
    }

    getImage(){
        var image = new Image();
        image.src = this.state.image.getCanvas().toDataURL("image/png");
        return image;
    }

    getFilename(){
        let url = this.props.imgUrl;
        var filename = url.substring(url.lastIndexOf('/')+1);
        return filename
    }

    handleClick(){
        //PubSub.publish( 'DICOM.select', { imageUrl : this.props.imgUrl, isStack: this.getFramesNumber() > 1} );
        this.props.onClick(this.props.index);

    }

    render() {
        return (
            <div style={{position:"relative"} }
                 className={this.props.isSelected? "dicomImageContainer selected" : "dicomImageContainer"}
                 unselectable='on' onClick={this.handleClick} ref={(imgDivContainer) => this.imageDivContainer = imgDivContainer}>
                <div className="dicomImage"  ref={(imgDiv) => this.imageDiv = imgDiv}
                     style={{top: "0px", left:"0px", width:  this.state.elementWidth, height: this.state.elementWidth*0.75, background:"black"}}>
                    {this.state.error && <span className="error-not-image">Not a valid image</span>}
                    {(this.state.loaded === false && this.state.error === false) && <span className="loading-icon rotating">Loading</span>}
                </div>
                <label className="dicom-filename">{this.state.error && <i className="fi-alert"></i>}{this.getFilename()}</label>
            </div>
        );
    }
}

RktViewerThumbnail.defaultProps = {
    imgUrl:"" ,
    canvasWidth : 200,
};