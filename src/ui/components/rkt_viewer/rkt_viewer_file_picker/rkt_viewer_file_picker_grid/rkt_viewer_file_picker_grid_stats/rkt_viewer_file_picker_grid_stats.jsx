import React, { Component } from 'react';

//modules
import { obtainInfoToLoad, loadZipWithInfo } from "./rkt_viewer_file_picker_grid_stats_actions";

export default class RktToolboxStageStats extends Component {

    constructor() {
        super();
        this.state = {

        };

        this.loadImagesInfo = this.loadImagesInfo.bind(this);
    }

    renderLoadingProgressBar() {
        return (
            <div className="grid-block vertical shrink progress-bar-section" style={{ overflow: "hidden" }} >
                <progress className="loading-progress-bar"
                    value={this.props.loadedDicoms}
                    max={this.props.totalDicoms}>
                </progress>
            </div>
        )
    }

    renderFolderInfo() {
        return (
            <div className="grid-block shrink folder-info" style={{ overflow: "hidden" }} >
                <h4>
                    <i className="fi-folder"></i>
                    <span>{" "}</span>
                    {this.props.title} {(this.props.totalDicoms > 0) && "(" + this.props.loadedDicoms + "/" + this.props.totalDicoms + ")"}
                </h4>
                {this.renderLoadButton()}
            </div>
            
        );
    }

    renderStats() {
        return (
            <div className="grid-block align-left stats">
                {Object.keys(this.props.items).map((key) => {
                    var name_stat_item = key;
                    var number_stat_item = this.props.items[name_stat_item]
                    return (
                        <div className="stat-item" index={key}>
                            <span className="name-stat-item">
                                {name_stat_item}
                            </span>
                            <span className="number-stat-item">
                                {number_stat_item}
                            </span>
                        </div>
                    )
                })}
            </div>
        )
    }

    renderLoadButton() {

        // the button is only rendered when there is image info to load (that is, 
        // when GRID thumbnails have sidebar elements associated)
        var grid_sources_info = this.props.grid_sources_info;
        var areImagesToLoad = false

        for (var i = 0; i < Object.keys(grid_sources_info).length; i++) {
            if (grid_sources_info[i].hasLabelAssigned === true) {
                areImagesToLoad = true;
                break;
            }

            if (areImagesToLoad) break; 
        }

        if (areImagesToLoad) {
            
            return (<a className="grid-block shrink load-images-info-button" id="load-images-info-button" onClick={this.loadImagesInfo}>Download ZIP</a>);
            
        }

    }

    loadImagesInfo() {
        loadZipWithInfo(this.props.grid_sources_info);
    }

    render() {

        return (
            <div className="grid-block vertical shrink container-stats">
                {this.renderLoadingProgressBar()}
                {this.renderFolderInfo()}
                {this.renderStats()}
            </div>
        );
    }
}