import React, { Component } from 'react';
import RktViewerThumbnail from './rkt_viewer_file_picker_grid_content_thumbnail/rkt_viewer_file_picker_grid_content_thumbnail';

export default class RktViewerFilePickerGridContent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedImg: -1,
            imgInstances: [],
        }
    }

    componentWillUpdate(nextProps) {
        if (nextProps.fileList !== this.props.fileList) {
            this.clearGrid();
        }
    }

    handleImgLoaded(data) {
        let instances = this.state.imgInstances;
        instances.push(data);

        this.setState({
            dicomInstances: instances
        })

        this.props.onchangegridcontent(this.state.imgInstances);
    }

    handleImgClicked(index, file, url) {
        this.setState({
            selectedImg: index
        })

        // data of the selected image is passed to the "Sidebar" component
        this.props.handleimgselected(file, url);

    }

    renderGrid() {
        var fileList = this.props.fileList;

        return (
            fileList.map((file, key) => {
                return (
                    <RktViewerThumbnail
                        index={key}
                        file={file}
                        isSelected={key === this.state.selectedImg}
                        onLoaded={this.handleImgLoaded.bind(this)}
                        onClick={this.handleImgClicked.bind(this)}
                    />
                )
            })
        );
    }

    clearGrid() {
        this.setState({
            selectedImg: -1,
            fileInstances: [],
        });
    }

    render() {
        return (
            <div className="grid-block vertical grid-content">
                {this.renderGrid()}
            </div>
        );
    }
}