import React, { Component } from 'react';
import { ReactDOM } from 'react-dom';
//import PubSub from 'pubsub-js'

// components
//import DicomViewer from './dicom_viewers/dicom_viewer.jsx'

export default class RktViewerFilePickerGrid extends Component {

    constructor() {
        super();

        this.state = {
            imageUrl: "",
            isStack: false

        }

        // this.handleSelection = this.handleSelection.bind(this);
        // this.renderDicom = this.renderDicom.bind(this);
        // this.render = this.render.bind(this);

    }

    componentDidMount() {
        //console.log("Component Preview mounted");
        //var token = PubSub.subscribe('DICOM.select', this.handleSelection);

    }

    // handleSelection(msg, data) {
    //     //console.log("IMAGEPREVIEW: Received message:"+JSON.stringify(data));
    //     this.setState({
    //         imageUrl: data.imageUrl,
    //         isStack: data.isStack

    //     });
    // }

    // renderDicom() {

    //     if (this.state.imageUrl == "") {
    //         return <p>Select an image to visualize</p>
    //     } else {
    //         //console.log("IMAGEPREVIEW: rendering dicom");

    //         return <DicomViewer ref={(dicom) => this.dicom = dicom}
    //             imageUrl={this.state.imageUrl}
    //             isStack={this.state.isStack}
    //             addControls={true}
    //             canvasWidth={document.getElementById('imagePreviewSidebarContainer').clientWidth - 60}
    //         />
    //     }
    // }

    render() {
        return (
            <div className="grid-block sidebar">
                <p style={{color:"white"}}>
                    Sidebar
                </p>
            </div>
        );
    }
}