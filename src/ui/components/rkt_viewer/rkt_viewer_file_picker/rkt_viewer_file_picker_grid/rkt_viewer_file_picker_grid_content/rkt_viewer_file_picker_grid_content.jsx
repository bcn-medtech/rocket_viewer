import React, { Component } from 'react';
//import RktViewerFilePickerGridContentThumbnail from './rkt_viewer_file_picker_grid_content_thumbnail/rkt_viewer_file_picker_grid_content_thumbnail';
import RktViewerFilePickerGridContentDragSource from './rkt_viewer_file_picker_grid_content_drag_source/rkt_viewer_file_picker_grid_content_drag_source';

// actions
import { array2Object } from './rkt_viewer_file_picker_grid_content_actions.js';

export default class RktViewerFilePickerGridContent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedImg: -1,
            imgInstances: [],
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
        var assigned_grid_labels = this.props.assigned_grid_labels; // {0: "name_label_0"/ false, ..., n: "name_label_n"/false}

        var keys_fileList = Object.keys(fileList); // ["0", "1", ... , "n", "length"]
        keys_fileList.pop(); // ["0", "1", ... , "n"]

        var url; // TO DO?

        return (
            keys_fileList.map((key) => {
                //console.log(key);
                var value = fileList[key];
                var files = array2Object([value]); // same as doing "var files = {0:fileList[key], "lenght":1};"

                var assigned_label = assigned_grid_labels[key];

                return (
                    <RktViewerFilePickerGridContentDragSource
                        index={key}
                        files={files}
                        url={url} // for the moment, empty
                        assigned_label={assigned_label}
                        isSelected={key === this.state.selectedImg}
                        onLoaded={this.handleImgLoaded}
                        onClick={this.handleImgClicked}
                        onimgdragdrop={this.props.onimgdragdrop}
                    />
                )
            })
        );
    }

    handleImgLoaded(data) {
        let instances = this.state.imgInstances;
        instances.push(data);

        this.setState({
            dicomInstances: instances
        })

        this.props.onchangegridcontent(this.state.imgInstances);
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
            <div className="grid-block file-picker-grid-content">
                <div className="grid-block small-up-3 align-spaced">
                    {this.renderGridContent()}
                </div>
            </div>

        );
    }
}