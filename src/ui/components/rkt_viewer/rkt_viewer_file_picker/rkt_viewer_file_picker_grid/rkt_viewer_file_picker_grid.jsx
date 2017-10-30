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
    }

    handleFileSelection(files) {

        // we update "GridContent" and "Stats" data
        this.clearState();
        this.setState({
            fileList: files,
            totalFiles: files.length
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

        // if files have been dragged and drop, they are displayed in the grid (as thumbnails)
        if (fileList.length > 0) {

            return (
                <RktViewerFilePickerGridContent
                    ref="GridContent"
                    fileList={fileList}
                    onchangegridcontent={this.handleGridContentChange.bind(this)}
                />
            );

        // if files have NOT been dragged and drop yet, dropzone widget
        } else {

            return (
                <RktViewerFilePickerGridEmpty
                    ref="GridEmpty"
                    onselectedfiles={this.handleFileSelection.bind(this)}
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