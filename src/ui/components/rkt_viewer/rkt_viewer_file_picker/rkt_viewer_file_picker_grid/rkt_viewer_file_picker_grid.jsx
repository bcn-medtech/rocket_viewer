import React, { Component } from 'react';

// components
import RktViewerFilePickerGridStats from './rkt_viewer_file_picker_grid_stats/rkt_viewer_file_picker_grid_stats';
import RktViewerFilePickerGridEmpty from './rkt_viewer_file_picker_grid_empty/rkt_viewer_file_picker_grid_empty';
import RktViewerFilePickerGridContent from './rkt_viewer_file_picker_grid_content/rkt_viewer_file_picker_grid_content';

//actions
import {computeStats} from "./rkt_viewer_file_picker_grid_actions";

export default class RktViewerFilePickerGrid extends Component {

    constructor(props) {
        super(props);
        this.state = {
            fileList: {},
            manufacturerInfo: [],
            loadedDicoms: 0,
            totalDicoms: 0,
        }

        this.onFileSelection = this.onFileSelection.bind(this);
        this.onGridContentChange = this.onGridContentChange.bind(this);
        
    }

    /* STATS component */
    renderStatsComponent() {
        var manufacturerInfo = this.state.manufacturerInfo;
        var loadedFiles = this.state.loadedFiles;
        var totalFiles = this.state.totalFiles;

        return (
            <RktViewerFilePickerGridStats
                title="Folder info"
                items={manufacturerInfo}
                loadedDicoms={loadedFiles}
                totalDicoms={totalFiles} />
        );
    }

    /* GRID component */
    renderGridComponent() {
        var fileList = this.state.fileList;

        // if files have been dragged and drop, they are displayed in the grid (as thumbnails)
        if (fileList.length > 0) {

            return (
                <RktViewerFilePickerGridContent
                    fileList={fileList}
                    assigned_grid_labels={this.props.assigned_grid_labels}
                    onchangegridcontent={this.onGridContentChange}
                    onimgselection={this.props.onimgselection}
                    onimgdragdrop={this.props.onimgdragdrop}
                />
            );

        // if files have NOT been dragged and drop yet, dropzone widget
        } else {

            return (<RktViewerFilePickerGridEmpty onfileselection={this.onFileSelection}/>);
            
        }
    }

    onFileSelection(fileList) {
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

    onGridContentChange(instances) {
        var myComponent = this;

        computeStats(instances, function(manufacturerDict) {
            myComponent.setState({
                loadedFiles: instances.length,
                manufacturerInfo: manufacturerDict
            });
        })
    }

    render() {
        return (
            <div className="grid-block medium-5 vertical file-picker-grid">
                {this.renderStatsComponent()}
                {this.renderGridComponent()}
            </div>
        );
    }
}