import React, { Component } from 'react';
import RktViewerImageSelectionGridContentDragSource from './rkt_viewer_image_selection_grid_content_drag_source/rkt_viewer_image_selection_grid_content_drag_source';
// actions
import { array2Object } from './rkt_viewer_image_selection_grid_content_actions.js';

export default class RktViewerImageSelectionGridContent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedImg: -1,
            imgInstances: [],
            imgCanvasArray: [],
            metadataArray: []
        }

        this.handleImgLoaded = this.handleImgLoaded.bind(this);
        this.handleImgClicked = this.handleImgClicked.bind(this);
    }

    componentWillUpdate(nextProps) {
        if (nextProps.fileList !== this.props.fileList) {
            this.clearGrid();
        }
    }

    clearGrid() {
        this.setState({
            selectedImg: -1,
            fileInstances: [],
        });
    }

    /* GRID CONTENT component */
    renderGridContent() {
        var fileList = this.props.fileList; // {0: File, 1: File, ... , lenght: int}
        var grid_sources_info = this.props.grid_sources_info;

        var keys_fileList = Object.keys(fileList); // ["0", "1", ... , "n", "length"]
        keys_fileList.pop(); // ["0", "1", ... , "n"]

        var url; // TO DO?

        return (
            keys_fileList.map((key) => {

                var value = fileList[key];
                var files = array2Object([value]); // same as doing "var files = {0:fileList[key], "lenght":1};"

                var grid_sources_item_info = grid_sources_info[key];

                return (
                    <RktViewerImageSelectionGridContentDragSource
                        index={key}
                        files={files}
                        url={url} // for the moment, empty
                        grid_sources_item_info={grid_sources_item_info}
                        isSelected={key === this.state.selectedImg}
                        onLoaded={this.handleImgLoaded}
                        onClick={this.handleImgClicked}
                        onimgdragdrop={this.props.onimgdragdrop}
                    />
                )
            })
        );
    }

    handleImgLoaded(data, pngCanvas, metadata) {
        let instances = this.state.imgInstances;
        let imgCanvasArray = this.state.imgCanvasArray;
        let metadataArray = this.state.metadataArray;

        instances.push(data);
        imgCanvasArray.push(pngCanvas);
        metadataArray.push(metadata);

        this.setState({
            imgInstances: instances,
            imgCanvasArray: imgCanvasArray,
            metadataArray: metadataArray
        })

        this.props.handleimgloaded(this.state.imgInstances, this.state.imgCanvasArray, this.state.metadataArray);
    }

    handleImgClicked(index, file, url, viewerType) {
        this.setState({
            selectedImg: index
        })

        // data of the selected image is passed to the "Sidebar" component
        this.props.onimgselection(file, url, viewerType);

    }

    render() {
        return (
            <div className="grid-block image-selection-grid-content">
                <div className="grid-block small-up-3 align-spaced">
                    {this.renderGridContent()}
                </div>
            </div>

        );
    }
}