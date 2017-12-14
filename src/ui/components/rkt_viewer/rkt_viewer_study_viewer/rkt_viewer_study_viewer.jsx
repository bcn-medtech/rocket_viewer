import React, { Component } from 'react';

// components
import RktViewerImageSelectionGrid from './rkt_viewer_study_viewer_grid/rkt_viewer_study_viewer_grid';
import RktViewerImageSelectionViewer from './rkt_viewer_study_viewer_viewer/rkt_viewer_study_viewer_viewer';

export default class RktViewerImageSelection extends Component {

    constructor() {
        super();

        this.state = {};

        this.handleImgSelected = this.handleImgSelected.bind(this);
    }

    componentDidMount() {

    }

    handleImgSelected(files, url, viewerType) {
        // we update the data of the image to display in the viewer
        this.setState({
            files_to_display: files,
            url_to_display: url, 
            viewerType: viewerType
        });
    }

    renderGrid() {
        return (<RktViewerImageSelectionGrid handleimgselected={this.handleImgSelected}/>);
    }

    renderViewer() {
        var url = this.state.url_to_display;
        var files = this.state.files_to_display;
        var viewerType = this.state.viewerType;

        return (<RktViewerImageSelectionViewer url={url} files={files} viewerType={viewerType}/>);
    }

    render() {

        return (
            <div className="grid-block rkt-viewer-study-viewer">
                {this.renderGrid()}
                {this.renderViewer()}
            </div>
        );
    }
}