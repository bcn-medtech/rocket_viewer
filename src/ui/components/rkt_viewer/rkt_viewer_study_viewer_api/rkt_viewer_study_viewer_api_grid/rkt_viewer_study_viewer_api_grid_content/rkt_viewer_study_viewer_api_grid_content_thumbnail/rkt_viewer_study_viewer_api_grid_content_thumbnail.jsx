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
//actions
import { getViewerType, loadImage, getImageName } from './rkt_viewer_study_viewer_api_grid_content_thumbnail_actions';

//Using global variables
const cornerstone = window.cornerstone;
const cornerstoneWADOImageLoader = window.cornerstoneWADOImageLoader;

export default class RktViewerImageSelectionGridContentThumbnail extends Component {

    constructor(props) {
        super(props);

        this.state = {
            imageId: null,
            viewerType:undefined,
            loaded: false,
            error: false,
            elementWidth: this.props.canvasWidth,
        };

        this.onImageLoaded = this.onImageLoaded.bind(this);
        this.onErrorLoading = this.onErrorLoading.bind(this);
        this.handleThumbnailClicked = this.handleThumbnailClicked.bind(this);
    }

    componentDidMount() {

        var file = this.props.files;
        var url = this.props.url;
        
        this.loadThumbnailInComponent(file,url);

    }

    loadThumbnailInComponent(file,url){

        this.setState({
            elementWidth: this.containerThumbnail.clientWidth,// - 20,
            loaded: false,
            error: false
        });

        var myComponent = this;

        getViewerType(file, url, function(viewerType) {
            
            myComponent.setState({
                viewerType: viewerType
            })

            if (viewerType!==undefined) { // the image is only displayed if its format is compatible
                loadImage(viewerType, file, url, myComponent.onImageLoaded, myComponent.onErrorLoading);
            } else {
                myComponent.onErrorLoading(false);
            }
            
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

        // In case the cornerstone Image Objects is from a provided DICOM file (and not a created cornerstone Image) 
        if (cornerstoneImage.data!==undefined) {
            // metadata of the dicom is passed to "Stats" component
            this.props.onLoaded(cornerstoneImage.data);
        }
        
    }

    handleThumbnailClicked() {
        var index = this.props.index;
        var files = this.props.files;
        var url = this.props.url;
        var viewerType = this.state.viewerType;

        this.props.onClick(index, files, url, viewerType);
    }

    render() {

        return (
            <div>
                <a style={{ position: "relative" }}
                    className="grid-block vertical container-thumbnail"
                    unselectable='on'
                    onClick={this.handleThumbnailClicked}
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

RktViewerImageSelectionGridContentThumbnail.defaultProps = {
    imgUrl: "",
    canvasWidth: 200,
};