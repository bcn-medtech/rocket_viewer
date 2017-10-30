import React, { Component, PropTypes } from 'react';
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

    handleImgClicked(index) {
        this.setState({
            selectedImg: index
        })
    }

    handleImgLoaded(data) {
        let instances = this.state.imgInstances;
        instances.push(data);

        this.setState({
            dicomInstances: instances
        })

        this.props.onchangegridcontent(this.state.imgInstances);
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
                        onClick={this.handleImgClicked.bind(this)}
                        onLoaded={this.handleImgLoaded.bind(this)}
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