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

// components
import RktViewerStudyViewerGridStats from './rkt_viewer_study_viewer_api_grid_stats/rkt_viewer_study_viewer_api_grid_stats';
import RktViewerStudyViewerGridEmpty from './rkt_viewer_study_viewer_api_grid_empty/rkt_viewer_study_viewer_api_grid_empty';
import RktViewerStudyViewerGridContent from './rkt_viewer_study_viewer_api_grid_content/rkt_viewer_study_viewer_api_grid_content';

// actions
import { divideImagesInSections } from './rkt_viewer_study_viewer_api_grid_actions';
//modules
import { isObjectEmpty } from '../../../../../modules/rkt_module_object';
import { isVariableString } from './../../../../../modules/rkt_module_variable';

//global imports
const cornerstoneWADOImageLoader = window.cornerstoneWADOImageLoader;

export default class RktViewerStudyViewerGrid extends Component {

    constructor(props) {
        super(props);

        this.state = {
            fileList: {},
            urlList:[],
            fileList_to_display: {},
            urlList_to_display:[],
            dicomsMetadata: [],
            manufacturersDict: [],
            loadedDicomsInSection: 0,
            totalFilesInSection: 0,
            totalFiles: 0,
            img_sections_info: undefined,
            current_img_section: 1
        }

        this.handleImgLoaded = this.handleImgLoaded.bind(this);
        this.clearState = this.clearState.bind(this);
    }

    componentDidMount(){

    }

    // **** Actions ******

    clearState() {

        this.setState({
            fileList: [],
            urlList:[],
            urlList_to_display:[],
            fileList_to_display: {},
            dicomsMetadata: [],
            manufacturersDict: [],
            loadedDicomsInSection: 0,
            //totalFilesInSection: 0,
            //totalFiles: 0,
            img_sections_info: undefined,
            current_img_section: 1
        });
    }

    computeStats(dicomsMetadata, cornerstoneData) {
        
        dicomsMetadata.push(cornerstoneData);
        var manufacturersDict = [];

        for (var i in dicomsMetadata) {
            if (dicomsMetadata[i] !== null) {
                var man = dicomsMetadata[i].string('x00080070');
                if (manufacturersDict[man]) {
                    manufacturersDict[man] = manufacturersDict[man] + 1;
                } else {
                    manufacturersDict[man] = 1;
                }
            }
        }

        this.setState({
            loadedDicomsInSection: dicomsMetadata.length,
            dicomsMetadata: dicomsMetadata,
            manufacturersDict: manufacturersDict
        });

    }

    loadImagesToDisplay(fileList, img_sections_info, current_img_section) {

        var sectionsObject;
        var current_info;
        var first_file_id;
        var last_file_id;

        cornerstoneWADOImageLoader.fileManager.purge();

        if(!isObjectEmpty(fileList)){

            //Files to load and display are URL
            if(isVariableString(fileList[0])){

                var urlList_to_display = [];
                var ulList = fileList;

                if (img_sections_info.number_sections === 1) {

                    urlList_to_display = ulList;
        
                } else if (img_sections_info.number_sections > 1) {
        
                    sectionsObject = img_sections_info["sections"];
        
                    current_info = sectionsObject[current_img_section];
                    first_file_id = current_info.first_file_id;
                    last_file_id = current_info.last_file_id;
        
                    for (var i = first_file_id; i < last_file_id + 1; i++) {
                        urlList_to_display.push(ulList[i]);
                    }
                }

                this.setState({
                    urlList: ulList,
                    urlList_to_display: urlList_to_display,
                    totalFilesInSection: urlList_to_display.length,
                    totalFiles: fileList.length,
                    img_sections_info: img_sections_info,
                    current_img_section: current_img_section
                });

            }else{
                //Files to load and display are from Localhost

                var fileList_to_display = {}

                if (img_sections_info.number_sections === 1) {

                    fileList_to_display = fileList;
        
                } else if (img_sections_info.number_sections > 1) {
        
                    sectionsObject = img_sections_info["sections"];
        
                    current_info = sectionsObject[current_img_section];
                    first_file_id = current_info.first_file_id;
                    last_file_id = current_info.last_file_id;
        
                    for (var i = first_file_id; i < last_file_id + 1; i++) {
                        fileList_to_display[i] = fileList[i];
                    }
                }

                this.setState({
                    fileList: fileList,
                    fileList_to_display: fileList_to_display,
                    totalFilesInSection: fileList_to_display.length,
                    totalFiles: fileList.length,
                    img_sections_info: img_sections_info,
                    current_img_section: current_img_section
                });
            }
        }
        
    }

    // ******* Events *********

    handleImgLoaded(cornerstoneData) {
        var dicomsMetadata = this.state.dicomsMetadata;
        this.computeStats(dicomsMetadata, cornerstoneData);
    }


    handleNavigation(navigateTo) {

        var current_img_section = this.state.current_img_section;
        
        var img_sections_info = this.state.img_sections_info;

        var fileList;

        if(!isObjectEmpty(this.state.fileList)){

            fileList = this.state.fileList;

        }else{

            fileList = this.state.urlList;
            
        }

        if (navigateTo === "previous") current_img_section -= 1;
        else if (navigateTo === "next") current_img_section += 1;

        this.clearState();

        this.setState({
            navigating: true
        });

        var myComponent = this;

        setTimeout(function () {
            myComponent.loadImagesToDisplay(fileList, img_sections_info, current_img_section);
        }, 10);
    }

    handleFilesObtention(fileList) {

        var num_img_per_section = 20;
        var img_sections_info = divideImagesInSections(fileList, num_img_per_section);
        var current_img_section = 1;

        // we update "GridContent" and "Stats" data
        this.clearState();
        this.loadImagesToDisplay(fileList, img_sections_info, current_img_section);

    }

    /****** Renders ***/
    /****** Stats *****
    *******************
    ******* Grid ******
    ********************/

    renderStatsComponent() {

        var loadedDicomsInSection = this.state.loadedDicomsInSection;
        var totalFilesInSection = this.state.totalFilesInSection;
        var totalFiles = this.state.totalFiles;
        var manufacturersDict = this.state.manufacturersDict;

        var current_img_section = this.state.current_img_section;
        var img_sections_info = this.state.img_sections_info;

        return (

            <RktViewerStudyViewerGridStats
                title="DICOMs info"//"Folder info"
                items={manufacturersDict}
                loadedDicomsInSection={loadedDicomsInSection}
                totalFilesInSection={totalFilesInSection}
                totalFiles={totalFiles}
                current_img_section={current_img_section}
                img_sections_info={img_sections_info}
                onclicknavigationbutton={this.handleNavigation.bind(this)} />
        );

    }

    renderGridComponent() {

        var fileList = this.state.fileList;
        var urlList = this.state.urlList;
        var fileList_to_display = this.state.fileList_to_display;
        var urlList_to_display = this.state.urlList_to_display;
        var current_img_section = this.state.current_img_section;

        // if files have been obtained from localhost, they are displayed in the grid (as thumbnails)
        if (fileList.length > 0) {

            return (
                <RktViewerStudyViewerGridContent
                    fileList={fileList_to_display}
                    current_img_section={current_img_section}
                    handleimgloaded={this.handleImgLoaded}
                    handleimgselected={this.props.handleimgselected}
                />
            );

        
        }else if(urlList_to_display.length > 0){

            console.log(urlList_to_display.length);
            //console.log("Url list to display:"+urlList_to_display.length);
             // if files have been obtained from api, they are displayed in the grid (as thumbnails)
             return (
                <RktViewerStudyViewerGridContent
                    urlList={urlList_to_display}
                    current_img_section={current_img_section}
                    handleimgloaded={this.handleImgLoaded}
                    handleimgselected={this.props.handleimgselected}
                />
            );

            
        } else {    
            // if files have NOT been dragged and drop yet, dropzone widget
            if (!this.state.navigating) {
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