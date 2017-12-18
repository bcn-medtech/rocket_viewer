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
                    value={this.props.loadedFiles}
                    max={this.props.totalFiles}>
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
                    {this.props.title} {(this.props.totalFiles > 0) && "(" + this.props.loadedFiles + "/" + this.props.totalFiles + ")"}
                </h4>
                {this.renderNavigationButton()}
            </div>
        );
    }

    renderStats() {
        if (this.props.items !== undefined) {
            //console.log(this.props.items);
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

    renderNavigationButton() {

        if (this.props.img_sections_info !== undefined) {
            var img_sections_info = this.props.img_sections_info;
            var number_sections = img_sections_info.number_sections;
            var current_img_section = this.props.current_img_section;
            
            var sectionsObject = img_sections_info.sections;
            var current_section_info = sectionsObject[current_img_section];
            var navigation_info = current_section_info.navigation_info;

            if ((this.props.totalFiles > 0) && (this.props.img_sections_info.number_sections > 1)) {
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
        //console.log("******************* After navigation ******************");
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