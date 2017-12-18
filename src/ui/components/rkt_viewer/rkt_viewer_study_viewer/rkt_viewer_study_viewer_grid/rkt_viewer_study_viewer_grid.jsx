import React, { Component } from 'react';

// components
import RktViewerStudyViewerGridStats from './rkt_viewer_study_viewer_grid_stats/rkt_viewer_study_viewer_grid_stats';
import RktViewerStudyViewerGridEmpty from './rkt_viewer_study_viewer_grid_empty/rkt_viewer_study_viewer_grid_empty';
import RktViewerStudyViewerGridContent from './rkt_viewer_study_viewer_grid_content/rkt_viewer_study_viewer_grid_content';

// actions
import { divideImagesInSections } from './rkt_viewer_study_viewer_grid_actions';

export default class RktViewerStudyViewerGrid extends Component {

    constructor(props) {
        super(props);
        
        this.state = {
            fileList: {},
            fileList_to_display: {},
            manufacturerInfo: [],
            loadedDicoms: 0,
            totalDicoms: 0,
            img_sections_info: undefined,
            current_img_section: 1
        }

        this.handleGridContentChange = this.handleGridContentChange.bind(this);
        this.clearState = this.clearState.bind(this);
        //this.handleNavigation = this.handleNavigation.bind(this);
    }

    // **** Actions ******

    clearState() {
        
        this.setState({
            fileList: [],
            fileList_to_display: {},
            manufacturerInfo: [],
            loadedDicoms: 0,
            totalDicoms: 0,
            img_sections_info: undefined,
            current_img_section: 1
        });
    }

    computeStats(instances) {
        
        var manufacturerDict = [];

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

    loadImagesToDisplay(fileList,img_sections_info,current_img_section) {

        var fileList_to_display = {}

        if (img_sections_info.number_sections === 1) {

            fileList_to_display = fileList;

        } else if (img_sections_info.number_sections > 1) {

            var sectionsObject = img_sections_info["sections"];

            var current_info = sectionsObject[current_img_section];
            var first_file_id = current_info.first_file_id;
            var last_file_id = current_info.last_file_id;

            for (var i = first_file_id; i < last_file_id + 1; i++) {
                fileList_to_display[i] = fileList[i];
            }

            fileList_to_display["length"] = last_file_id - first_file_id + 1;

        }

        this.setState({
            fileList_to_display: fileList_to_display,
            fileList: fileList,
            totalFiles: fileList.length,
            img_sections_info: img_sections_info,
            current_img_section:current_img_section
        });
    }

    // ******* Events *********

    handleGridContentChange(instances) {
        this.computeStats(instances)
    }


    handleNavigation(navigateTo) {
        
        var current_img_section = this.state.current_img_section;
        var fileList = this.state.fileList;
        var img_sections_info = this.state.img_sections_info;

        if (navigateTo === "previous") current_img_section -= 1;
        else if (navigateTo === "next") current_img_section += 1;

        this.clearState();
        
        this.setState({
            navigating:true
        });

        var myComponent = this;

        setTimeout(function(){ 
            myComponent.loadImagesToDisplay(fileList,img_sections_info,current_img_section);
         }, 10);
    }

    handleFilesObtention(fileList) {

        var num_img_per_section = 20;//20;
        var img_sections_info = divideImagesInSections(fileList, num_img_per_section);
        var current_img_section = 1;

        // we update "GridContent" and "Stats" data
        this.clearState();

        this.loadImagesToDisplay(fileList,img_sections_info,current_img_section);

    }

    /****** Renders ***/
    /****** Stats *****
    *******************
    ******* Grid ******
    ********************/

    renderStatsComponent() {

        var manufacturerInfo = this.state.manufacturerInfo;
        var loadedFiles = this.state.loadedFiles;
        var totalFiles = this.state.totalFiles;
        var current_img_section = this.state.current_img_section;

        if (this.state.img_sections_info !== undefined) {
            var number_sections = this.state.img_sections_info["number_sections"];
        }

        return (
            <RktViewerStudyViewerGridStats
                title="Folder info"
                items={manufacturerInfo}
                loadedDicoms={loadedFiles}
                totalDicoms={totalFiles}
                current_img_section={current_img_section}
                number_sections={number_sections}
                onclicknavigationbutton={this.handleNavigation.bind(this)} />
        );
    }

    renderGridComponent() {
        
        var fileList = this.state.fileList;
        var fileList_to_display = this.state.fileList_to_display;
        var current_img_section = this.state.current_img_section;

        // if files have been dragged and drop, they are displayed in the grid (as thumbnails)
        if (fileList.length > 0) {

            //console.log(fileList_to_display);
            return (
                <RktViewerStudyViewerGridContent
                    fileList={fileList_to_display}
                    current_img_section={current_img_section}
                    onchangegridcontent={this.handleGridContentChange}
                    handleimgselected={this.props.handleimgselected}
                />
            );

            // if files have NOT been dragged and drop yet, dropzone widget
        } else {

            if(!this.state.navigating){
                return (<RktViewerStudyViewerGridEmpty onselectedfiles={this.handleFilesObtention.bind(this)} />);
            }
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