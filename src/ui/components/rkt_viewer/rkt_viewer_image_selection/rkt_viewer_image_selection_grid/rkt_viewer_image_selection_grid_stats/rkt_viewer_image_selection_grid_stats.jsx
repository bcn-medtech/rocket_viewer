import React, { Component } from 'react';

//modules
import { obtainInfoToLoad, loadZipWithInfo } from "./rkt_viewer_image_selection_grid_stats_actions";

export default class RktViewerImageSelectionStats extends Component {

    constructor() {
        super();
        this.state = {

        };

        this.onClickLoadButton = this.onClickLoadButton.bind(this);
        this.onClickSettingsButton = this.onClickSettingsButton.bind(this);
    }

    renderLoadingProgressBar() {
        var current_value_progress_bar;
        if (this.props.img_sections_info !== undefined) {
            current_value_progress_bar = this.props.img_sections_info.sections[this.props.current_img_section].last_file_id + 1;
        }

        var max_value_progress_bar = this.props.totalFiles;

        return (
            <div className="grid-block vertical shrink progress-bar-section" style={{ overflow: "hidden" }} >
                <progress className="loading-progress-bar"
                    value={current_value_progress_bar}
                    max={max_value_progress_bar}>
                </progress>
            </div>
        )
    }

    renderFolderInfo() {
        return (
            <div className="grid-block shrink" style={{ overflow: "hidden", alignItems: "baseline" }} >
                <div className="grid-block shrink folder-info">
                    <h4>
                        <i className="fi-folder"></i>
                        <span>{" "}</span>
                        {this.props.title} {(this.props.totalDicoms > 0) && "(" + this.props.loadedDicoms + "/" + this.props.totalDicoms + ")"}
                    </h4>
                </div>
                {this.renderMenu()}
                {this.renderNavigationButton()}
            </div>
        );
    }

    renderStats() {
        if (this.props.items != undefined) {
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
    }

    renderMenu() {
        var grid_sources_info = this.props.grid_sources_info;
        var areImagesToLoad = false;
        var downloadButton;

        for (var i = 0; i < Object.keys(grid_sources_info).length; i++) {
            if (grid_sources_info[i].hasLabelAssigned === true) {
                areImagesToLoad = true;
                break;
            }

            if (areImagesToLoad) break;
        }

        if (areImagesToLoad) {
            downloadButton = <a onClick={this.onClickLoadButton}><i className="fi-download"></i></a>;
        }

        return (
            <div className="grid-block align-right menu">
                <a onClick={this.onClickSettingsButton}><i className="fi-widget"></i></a>
                {downloadButton}
            </div>
        )
    }

    renderNavigationButton() {

        if (this.props.img_sections_info !== undefined) {

            var img_sections_info = this.props.img_sections_info;
            var number_sections = img_sections_info.number_sections;
            var current_img_section = this.props.current_img_section;

            var sectionsObject = img_sections_info.sections;
            var current_section_info = sectionsObject[current_img_section];
            var navigation_info = current_section_info.navigation_info;

            if ((this.props.totalDicoms > 0) && (this.props.img_sections_info.number_sections > 1)) {
                var navigationButtonNext, navigationButtonPrevious;

                if ((current_img_section > 1) && (current_img_section < number_sections)) {
                    navigationButtonPrevious = <a onClick={this.onClickNavigationButton.bind(this, "previous")}><i className="fi-arrow-left"></i></a>;
                    navigationButtonNext = <a onClick={this.onClickNavigationButton.bind(this, "next")}><i className="fi-arrow-right"></i></a>;

                } else if (current_img_section === 1) {
                    navigationButtonNext = <a onClick={this.onClickNavigationButton.bind(this, "next")}><i className="fi-arrow-right"></i></a>;

                } else if (current_img_section === number_sections) {
                    navigationButtonPrevious = <a onClick={this.onClickNavigationButton.bind(this, "previous")}><i className="fi-arrow-left"></i></a>;

                }
            }
        }

        return (
            <div className="grid-block vertical navigation-menu" >
                <div className="grid-block navigation-buttons align-right">
                    {navigationButtonPrevious}
                    {navigationButtonNext}
                </div>
                <div className="grid-block navigation-info align-right">
                    {navigation_info}
                </div>
            </div>
        )
    }

    onClickNavigationButton(navigateTo) {
        this.props.onclicknavigationbutton(navigateTo);
    }

    onClickLoadButton() {
        this.props.onclickloadbutton();
    }

    onClickSettingsButton() {
        this.props.onclicksettingsbutton();
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