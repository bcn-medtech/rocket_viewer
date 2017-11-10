import React, { Component } from 'react';

// components
import RktViewerFilterDicomMain from './rkt_viewer_filter_dicom_main/rkt_viewer_filter_dicom_main';
import RktViewerFilterDicomFiltered from './rkt_viewer_filter_dicom_filtered/rkt_viewer_filter_dicom_filtered';

export default class RktViewerFilterDicom extends Component {

    constructor() {
        super();

        this.state = {
            
        };
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

    renderMainDicom() {
        return (
            <RktViewerFilterDicomMain
                handleimgselected={this.handleImgSelected.bind(this)}
            />
        );
    }

    renderFilteredDicom() {
        return (
            <RktViewerFilterDicomFiltered
                url={this.state.url_to_display}
                files={this.state.files_to_display}
                viewerType={this.state.viewerType}
            />
        );
    }

    render() {

        return (
            <div className="grid-block rkt-viewer-filter-dicom">
                {this.renderMainDicom()}
                {this.renderFilteredDicom()}
            </div>
        );
    }
}