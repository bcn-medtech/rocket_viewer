import React, { Component } from 'react';

export default class RktToolboxStageStats extends Component {

    constructor() {
        super();
        this.state = {

        };
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
            <div className="grid-block vertical shrink folder-info" style={{ overflow: "hidden" }} >
                <h4>
                    <i className="fi-folder"></i>
                    {this.props.title} {(this.props.totalDicoms > 0) && "(" + this.props.loadedDicoms + "/" + this.props.totalDicoms + ")"}
                </h4>
            </div>
        );
    }

    renderStats() {
        return (
            <div className="grid-block vertical stats">
                {Object.keys(this.props.items).map((value, key) => {
                    return (
                        <span className="stat-item" index={key}>
                            <span className="label primary">
                                {value}
                            </span>
                            <span className="label secondary">
                                {this.props.items[value]}
                            </span>
                        </span>
                    )
                })}
            </div>
        )
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