import React, { Component } from 'react';
// components
import RktViewerImageSelectionGridStats from './rkt_viewer_image_selection_grid_stats/rkt_viewer_image_selection_grid_stats';
import RktViewerImageSelectionGridEmpty from './rkt_viewer_image_selection_grid_empty/rkt_viewer_image_selection_grid_empty';
import RktViewerImageSelectionGridContent from './rkt_viewer_image_selection_grid_content/rkt_viewer_image_selection_grid_content';

//actions
import { divideImagesInSections, computeStats } from "./rkt_viewer_image_selection_grid_actions";

//global imports
const cornerstoneWADOImageLoader = window.cornerstoneWADOImageLoader;

export default class RktViewerImageSelectionGrid extends Component {

    constructor(props) {
        super(props);
        this.state = {
            fileList: {},
            fileList_to_display: {},
            dicomsMetadata: [],
            manufacturersDict: [],
            loadedDicomsInSection: 0,
            totalFilesInSection: 0,
            totalFiles: 0,
            img_sections_info: undefined,
            current_img_section: 1
        }

        this.handleFilesObtention = this.handleFilesObtention.bind(this);
        this.handleImgLoaded = this.handleImgLoaded.bind(this);

    }

    clearState() {
        this.setState({
            fileList: [],
            fileList_to_display: {},
            dicomsMetadata: [],
            manufacturersDict: [],
            //loadedDicomsInSection: 0,
            //totalFilesInSection: 0,
            totalFiles: 0,
            img_sections_info: undefined,
            current_img_section: 1
        });
    }

    loadImagesToDisplay(fileList, img_sections_info, current_img_section) {

        // update of the images to display
        var fileList_to_display = {}
        var loadedFiles;

        cornerstoneWADOImageLoader.fileManager.purge();

        if (img_sections_info.number_sections === 1) {

            fileList_to_display = fileList;
            loadedFiles = fileList.length;

        } else if (img_sections_info.number_sections > 1) {

            var sectionsObject = img_sections_info["sections"];

            var current_info = sectionsObject[current_img_section];
            var first_file_id = current_info.first_file_id;
            var last_file_id = current_info.last_file_id;
            var loadedFiles = last_file_id + 1;

            for (var i = first_file_id; i < last_file_id + 1; i++) {
                fileList_to_display[i] = fileList[i];
            }

            fileList_to_display["length"] = last_file_id - first_file_id + 1;

        }

        //update the state
        this.setState({
            fileList_to_display: fileList_to_display,
            fileList: fileList,
            //loadedDicoms: loadedDicoms,
            totalFilesInSection: fileList_to_display.length,//fileList.length,
            totalFiles: fileList.length,
            img_sections_info: img_sections_info,
            current_img_section: current_img_section
        });
    }

    /* STATS component */
    renderStatsComponent() {
        var manufacturersDict = this.state.manufacturersDict;
        var loadedFilesInSection = this.state.loadedFilesInSection;
        var totalFilesInSection = this.state.totalFilesInSection;
        var totalFiles = this.state.totalFiles;

        var current_img_section = this.state.current_img_section;
        var img_sections_info = this.state.img_sections_info;

        return (
            <RktViewerImageSelectionGridStats
                title="Folder info"
                items={manufacturersDict}
                onclicksettingsbutton={this.props.onclicksettingsbutton}
                onclickloadbutton={this.props.onclickloadbutton}
                grid_sources_info={this.props.grid_sources_info}
                loadedFilesInSection={loadedFilesInSection}
                totalFilesInSection={totalFilesInSection}
                totalFiles={totalFiles}
                current_img_section={current_img_section}
                img_sections_info={img_sections_info}
                onclicknavigationbutton={this.handleNavigation.bind(this)} />
        );
    }

    handleNavigation(navigateTo) {

        var current_img_section = this.state.current_img_section;
        var fileList = this.state.fileList;
        var img_sections_info = this.state.img_sections_info;

        if (navigateTo === "previous") current_img_section -= 1;
        else if (navigateTo === "next") current_img_section += 1;

        this.clearState();
        //console.log("-----------------HANDLE NAVIGATION");

        this.setState({
            navigating: true
        });

        var myComponent = this;

        setTimeout(function () {
            myComponent.loadImagesToDisplay(fileList, img_sections_info, current_img_section);
        }, 10);
    }

    /* GRID component */
    renderGridComponent() {
        var fileList = this.state.fileList;
        var fileList_to_display = this.state.fileList_to_display;
        var current_img_section = this.state.current_img_section;

        // if files have been dragged and drop, they are displayed in the grid (as thumbnails)
        if (fileList.length > 0) {

            return (
                <RktViewerImageSelectionGridContent
                    fileList={fileList_to_display}
                    current_img_section={current_img_section}
                    grid_sources_info={this.props.grid_sources_info}
                    handleimgloaded={this.handleImgLoaded}
                    onimgselection={this.props.onimgselection}
                    onimgdragdrop={this.props.onimgdragdrop}
                />
            );

            // if files have NOT been dragged and drop yet, dropzone widget
        } else {

            if (!this.state.navigating) {
                return (<RktViewerImageSelectionGridEmpty onfileselection={this.handleFilesObtention} />);
            }
        }
    }

    handleFilesObtention(fileList) { // fileList {0: File, 1: File, ... , lenght: int}

        // we initialize the props "grid_sources_info" (DRAG SOURCE of the file picker)
        var grid_sources_info = this.props.grid_sources_info;

        var keys_fileList = Object.keys(fileList); // ["0", "1", ... , "n", "length"]
        keys_fileList.pop(); // ["0", "1", ... , "n"]

        for (var i = 0; i < keys_fileList.length; i++) {

            grid_sources_info[i] = { "index": i, "imgCanvas": undefined, "metadata": undefined, "file": fileList[i], "hasLabelAssigned": false, "assigned_label": undefined, "index_target": undefined };

        }

        var num_img_per_section = 20;
        var img_sections_info = divideImagesInSections(fileList, num_img_per_section);
        var current_img_section = 1;

        // we update "GridContent" and "Stats" data
        this.clearState();
        this.loadImagesToDisplay(fileList, img_sections_info, current_img_section);

    }

    handleImgLoaded(cornerstoneData, pngCanvasArray, metadataArray) {
        var myComponent = this;

        // update of props "grid_sources_info"
        for (var i = 0; i < Object.keys(myComponent.props.grid_sources_info).length; i++) {
            var current_PNG_canvas = pngCanvasArray[i];
            var current_metadata = metadataArray[i];

            myComponent.props.grid_sources_info[i].imgCanvas = current_PNG_canvas;
            myComponent.props.grid_sources_info[i].metadata = current_metadata
        }

        var dicomsMetadata = this.state.dicomsMetadata;
        //console.log(dicomsMetadata);
        // update of "stats" at GRID STATS
        computeStats(dicomsMetadata, cornerstoneData, function (manufacturersDict) {
            myComponent.setState({
                loadedDicoms: dicomsMetadata.length,
                dicomsMetadata: dicomsMetadata,
                manufacturersDict: manufacturersDict
            });
        })

    }

    render() {
        return (
            <div className="grid-block medium-5 vertical image-selection-grid">
                {this.renderStatsComponent()}
                {this.renderGridComponent()}
            </div>
        );
    }
}