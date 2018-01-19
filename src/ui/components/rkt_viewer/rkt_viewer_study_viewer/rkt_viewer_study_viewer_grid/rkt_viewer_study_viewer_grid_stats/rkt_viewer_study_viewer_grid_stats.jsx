/*
# Rocket viewer is (c) BCNMedTech, UNIVERSITAT POMPEU FABRA
#
# Rocket viewer is free software: you can redistribute it and/or modify
# it under the terms of the GNU Affero General Public License as
# published by the Free Software Foundation, either version 3 of the
# License, or (at your option) any later version.
#
# Rocket viewer is distributed in the hope that it will be useful,
# but WITHOUT ANY WARRANTY; without even the implied warranty of
# MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
# GNU Affero General Public License for more details.
#
# You should have received a copy of the GNU Affero General Public License
# along with this program.  If not, see <http://www.gnu.org/licenses/>.
#
# Authors:
# Carlos Yagüe Méndez
# María del Pilar García
# Daniele Pezzatini
# Contributors: 
# Sergio Sánchez Martínez
*/

import React, { Component } from 'react';

export default class RktToolboxStageStats extends Component {

    constructor() {
        super();
        this.state = {
        };
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
            <div className="grid-block shrink folder-info" style={{ overflow: "hidden" }} >
                <h4>
                    <i className="fi-folder"></i>
                    <span>{" "}</span>
                    {this.props.title} {(this.props.totalFilesInSection > 0) && "(" + this.props.loadedDicomsInSection + "/" + this.props.totalFilesInSection + ")"}
                </h4>
                {this.renderNavigationButton()}
            </div>
        );
    }

    renderStats() {

        if (this.props.items !== undefined) {
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