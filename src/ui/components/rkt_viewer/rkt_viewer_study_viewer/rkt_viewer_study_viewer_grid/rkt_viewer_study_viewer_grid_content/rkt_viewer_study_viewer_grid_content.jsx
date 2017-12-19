import React, { Component } from 'react';
import RktViewerFilePickerGridContentThumbnail from './rkt_viewer_study_viewer_grid_content_thumbnail/rkt_viewer_study_viewer_grid_content_thumbnail';
// actions
import { array2Object } from './rkt_viewer_study_viewer_grid_content_actions.js';

export default class RktViewerFilePickerGridContent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedImg: -1,
            //imgInstances: [],
        }

        this.handleImgLoaded = this.handleImgLoaded.bind(this);
        this.handleImgClicked = this.handleImgClicked.bind(this);
    }

    clearGrid() {
        this.setState({
            selectedImg: -1
        });
    }

    renderGrid() {
        // console.log("----------------------------------------------");
        // console.log(this.props.fileList);
        var fileList = this.props.fileList; // {0: File, 1: File, ... , lenght: int}
        var keys_fileList = Object.keys(fileList); // ["0", "1", ... , "n", "length"]
        keys_fileList.pop(); // ["0", "1", ... , "n"]

        var url; // TO DO

        return (
            keys_fileList.map((key) => {

                var value = fileList[key];
                var files = array2Object([value]); // same as doing "var files = {0:fileList[key], "lenght":1};"

                return (
                    <RktViewerFilePickerGridContentThumbnail
                        index={key}
                        files={files}
                        url={url}
                        isSelected={key === this.state.selectedImg}
                        onLoaded={this.handleImgLoaded}
                        onClick={this.handleImgClicked}
                    />
                )
            })
        );
    }

    handleImgLoaded(cornerstoneData) {
        this.props.handleimgloaded(cornerstoneData);
    }

    handleImgClicked(index, file, url, viewerType) {
        this.setState({
            selectedImg: index
        })

        // data of the selected image is passed to the "Sidebar" component
        this.props.handleimgselected(file, url, viewerType);

    }

    render() {
        
        return (
            <div className="grid-block study-viewer-grid-content">
                <div className="grid-block small-up-3 align-spaced">
                    {this.renderGrid()}
                </div>
            </div>

        );
    }
}