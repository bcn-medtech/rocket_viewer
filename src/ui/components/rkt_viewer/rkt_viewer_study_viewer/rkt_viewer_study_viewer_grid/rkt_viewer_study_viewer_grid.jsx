import React, { Component } from 'react';

// components
import RktViewerStudyViewerGridStats from './rkt_viewer_study_viewer_grid_stats/rkt_viewer_study_viewer_grid_stats';
import RktViewerStudyViewerGridEmpty from './rkt_viewer_study_viewer_grid_empty/rkt_viewer_study_viewer_grid_empty';
import RktViewerStudyViewerGridContent from './rkt_viewer_study_viewer_grid_content/rkt_viewer_study_viewer_grid_content';

export default class RktViewerStudyViewerGrid extends Component {

    constructor(props) {
        super(props);
        this.state = {
            fileList: {},
            manufacturerInfo: [],
            loadedDicoms: 0,
            totalDicoms: 0,
        }

        this.handleGridContentChange = this.handleGridContentChange.bind(this);
    }

    handleFileSelection(fileList) {

        // we update "GridContent" and "Stats" data
        this.clearState();
        this.setState({
            fileList: fileList,
            totalFiles: fileList.length
        });

    }

    clearState() {
        this.setState({
            fileList: [],
            totalFiles: 0,
            manufacturerInfo: [],
            loadedFiles: 0
        });
    }

    handleGridContentChange(instances) {
        this.computeStats(instances)
    }

    computeStats(instances) {
        var manufacturerDict = []
        for (var i in instances) {
            if (instances[i] != null) {
                var man = instances[i].string('x00080070');
                if (manufacturerDict[man]) {
                    manufacturerDict[man] = manufacturerDict[man] + 1;
                } else {
                    manufacturerDict[man] = 1;
                }
            }
        }
        this.setState({
            loadedFiles: instances.length,
            manufacturerInfo: manufacturerDict
        });
    }

    renderStatsComponent() {
        var manufacturerInfo = this.state.manufacturerInfo;
        var loadedFiles = this.state.loadedFiles;
        var totalFiles = this.state.totalFiles;

        return (
            <RktViewerStudyViewerGridStats
                title="Folder info"
                items={manufacturerInfo}
                loadedDicoms={loadedFiles}
                totalDicoms={totalFiles} />
        );
    }

    renderGridComponent() {
        var fileList = this.state.fileList;

        // if files have been dragged and drop, they are displayed in the grid (as thumbnails)
        if (fileList.length > 0) {

            return (
                <RktViewerStudyViewerGridContent
                    fileList={fileList}
                    onchangegridcontent={this.handleGridContentChange}
                    handleimgselected={this.props.handleimgselected}
                />
            );

        // if files have NOT been dragged and drop yet, dropzone widget
        } else {

            return (<RktViewerStudyViewerGridEmpty onselectedfiles={this.handleFileSelection.bind(this)}/>);
            
        }
    }

    render() {

        return (
            <div className="grid-block vertical study-viewer-grid">
                {this.renderStatsComponent()}
                {this.renderGridComponent()}
            </div>
        );
    }
}