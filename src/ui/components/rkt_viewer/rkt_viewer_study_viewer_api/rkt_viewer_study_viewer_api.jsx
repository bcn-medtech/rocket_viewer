import React, { Component } from 'react';

// components
import RktViewerStudyViewerGrid from './rkt_viewer_study_viewer_api_grid/rkt_viewer_study_viewer_api_grid';
import RktViewerStudyViewerViewer from './rkt_viewer_study_viewer_api_viewer/rkt_viewer_study_viewer_api_viewer';

export default class RktViewerStudyViewer extends Component {

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
        return (<RktViewerStudyViewerGrid handleimgselected={this.handleImgSelected}/>);
    }

    renderViewer() {
        var url = this.state.url_to_display;
        var files = this.state.files_to_display;
        var viewerType = this.state.viewerType;

        return (<RktViewerStudyViewerViewer url={url} files={files} viewerType={viewerType}/>);
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