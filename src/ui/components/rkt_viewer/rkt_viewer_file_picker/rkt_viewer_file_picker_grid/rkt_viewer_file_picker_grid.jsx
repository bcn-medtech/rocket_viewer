import React, { Component } from 'react';

// components
import RktViewerFilePickerGridStats from './rkt_viewer_file_picker_grid_stats/rkt_viewer_file_picker_grid_stats';
import RktViewerFilePickerGridEmpty from './rkt_viewer_file_picker_grid_empty/rkt_viewer_file_picker_grid_empty';
import RktViewerFilePickerGridContent from './rkt_viewer_file_picker_grid_content/rkt_viewer_file_picker_grid_content';

export default class RktViewerFilePickerGrid extends Component {

    constructor(props) {
        super(props);
        this.state = {
            fileList: [],
            manufacturerInfo: [],
            loadedDicoms: 0,
            totalDicoms: 0,
        }

        this.handleFileSelection = this.handleFileSelection.bind(this);
        this.handleDicomGridChange = this.handleDicomGridChange.bind(this);
        this.clearStage = this.clearStage.bind(this);
        this.computeStats = this.computeStats.bind(this);
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
            loadedDicoms: instances.length,
            manufacturerInfo: manufacturerDict
        });
    }

    handleFileSelection(files) {
        this.clearStage();
        this.setState({
            fileList: files,
            totalDicoms: files.length,
        });

    }

    clearStage() {
        this.setState({
            fileList: [],
            totalDicoms: 0,
            manufacturerInfo: [],
            loadedDicoms: 0

        });
    }

    handleDicomGridChange(instances) {
        this.computeStats(instances)
    }

    renderStatsComponent() {

        return (
            <RktViewerFilePickerGridStats
                title="Folder info"
                items={this.state.manufacturerInfo}
                loadedDicoms={this.state.loadedDicoms}
                totalDicoms={this.state.totalDicoms} />
        );
    }

    renderGridComponent() {

        var fileList = this.state.fileList;

        // if files have been dragged and drop
        if (fileList.length > 0) {

            // they are displayed in the grid (as thumbnails)
            return (
                <RktViewerFilePickerGridContent
                    dicomList={fileList}
                    onChange={this.handleDicomGridChange}
                />
            );

            // if files have NOT been dragged and drop yet
        } else {

            // dropzone widget
            return (
                <RktViewerFilePickerGridEmpty
                    handlefileselection={this.handleFileSelection.bind(this)}
                />
            );

        }
    }

    render() {

        return (
            <div className="grid-block vertical grid">
                {this.renderStatsComponent()}
                {this.renderGridComponent()}
            </div>
        );
    }
}