import React, { Component } from 'react';

export default class RktToolboxStageStats extends Component {

    constructor() {
        super();
        this.state = {
        };

        //this.onClickNavigationButton = this.onClickNavigationButton.bind(this);
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
                {this.renderNavigationButton()}
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

    renderNavigationButton() {

        if ((this.props.totalDicoms > 0) && (this.props.number_sections > 1)) {
            var number_sections = this.props.number_sections;
            var current_img_section = this.props.current_img_section;
            var navigationButtonNext, navigationButtonPrevious;

            // console.log(current_img_section);
            // console.log(number_sections);

            if ((current_img_section > 1) && (current_img_section < number_sections)) {
                navigationButtonPrevious = <a onClick={this.onClickNavigationButton.bind(this, "previous")}><i className="fi-arrow-left"></i></a>;
                navigationButtonNext = <a onClick={this.onClickNavigationButton.bind(this, "next")}><i className="fi-arrow-right"></i></a>;
                
            } else if (current_img_section === 1) {
                navigationButtonNext = <a onClick={this.onClickNavigationButton.bind(this, "next")}><i className="fi-arrow-right"></i></a>;

            } else if (current_img_section === number_sections) {
                navigationButtonPrevious = <a onClick={this.onClickNavigationButton.bind(this, "previous")}><i className="fi-arrow-left"></i></a>;

            }
        }

        return (
            <div className="grid-block align-right menu" >
                {navigationButtonPrevious}
                {navigationButtonNext}
            </div>
        )
    }


    onClickNavigationButton(navigateTo) {
        this.props.onclicknavigationbutton(navigateTo);
        console.log("******************* After navigation ******************");
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