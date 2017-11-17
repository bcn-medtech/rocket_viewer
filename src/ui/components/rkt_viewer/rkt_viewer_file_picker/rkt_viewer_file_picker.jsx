import React, { Component } from 'react';

// components
import RktViewerFilePickerGrid from './rkt_viewer_file_picker_grid/rkt_viewer_file_picker_grid';
import RktViewerFilePickerSidebar from './rkt_viewer_file_picker_sidebar/rkt_viewer_file_picker_sidebar';

export default class RktViewerFilePicker extends Component {

    constructor() {
        super();

        this.state = {};

        this.handleImgSelected = this.handleImgSelected.bind(this);
    }

    componentDidMount() {

    }

    handleImgSelected(files, url, viewerType) {
        // we update the data of the image to display in the sidebar
        this.setState({
            files_to_display: files,
            url_to_display: url, 
            viewerType: viewerType
        });
    }

    renderGrid() {
        return (<RktViewerFilePickerGrid handleimgselected={this.handleImgSelected}/>);
    }

    renderSidebar() {
        var url = this.state.url_to_display;
        var files = this.state.files_to_display;
        var viewerType = this.state.viewerType;

        return (<RktViewerFilePickerSidebar url={url} files={files} viewerType={viewerType}/>);
    }

    render() {

        return (
            <div className="grid-block rkt-viewer-file-picker">
                {this.renderGrid()}
                {this.renderSidebar()}
            </div>
        );
    }
}