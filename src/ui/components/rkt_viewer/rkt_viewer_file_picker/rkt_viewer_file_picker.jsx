import React, { Component } from 'react';
import RktViewerFilePickerGrid from './rkt_viewer_file_picker_grid/rkt_viewer_file_picker_grid';
import RktViewerFilePickerSidebar from './rkt_viewer_file_picker_sidebar/rkt_viewer_file_picker_sidebar'

//import config from './../config/config.json';

// TO DO
export default class RktViewerFilePicker extends Component {

    constructor() {
        super();

        this.handleImageLoaded = this.handleImageLoaded.bind(this);
        this.loaddicom = this.loaddicom.bind(this);
        this.loaddicoms = this.loaddicoms.bind(this);

        this.state = {
            imgUrl: "http://localhost:3000/files/Patient3/study/IM-0001-0025.dcm",
            imgSource: "",
            addControls: false,
            isSelected: false
        };
    }

    componentDidMount() {

        // if (this.props.params.patient == "patient1") {
        //     console.log("Patient1");
        //     this.loaddicoms(config.testData);
        // }
    }

    handleImageLoaded() {
        //console.log("Image loaded");
    }

    loaddicom(dicomURL) {
        //console.log(dicomURL);
        this.setState({
            imgUrl: dicomURL,
        });
    }

    loaddicoms(dicomsURLs) {
        //console.log("Loading dicoms:"+dicomsURLs.length);
        this.dicomStage.handleFileSelection(dicomsURLs);

    }

    render() {

        let imgUrl = this.state.imgUrl;
        let imgSource = this.state.imgSource;
        let addControls = this.state.addControls;
        let isSelected = this.state.isSelected;

        return (
            <div className="grid-frame rkt-viewer-file-picker">
                <RktViewerFilePickerGrid/>
                <RktViewerFilePickerSidebar/>
            </div>
        );
    }
}