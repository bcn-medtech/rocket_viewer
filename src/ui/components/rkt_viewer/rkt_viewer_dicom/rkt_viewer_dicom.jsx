import React, { Component } from 'react';
//Components
import RktViewerDicomOneFrame from './rkt_viewer_dicom_one_frame/rkt_viewer_dicom_one_frame.jsx';
import RktViewerDicomMultiframe from './rkt_viewer_dicom_multi_frame/rkt_dicom_viewer_multi_frame';
//actions
import { isViewerLoadingAURLSource } from './rkt_viewer_dicom_actions.js';

export default class RktViewerDicom extends Component {

    constructor() {
        super();

        this.state = {
            cine_mode: false
        };
    }

    componentDidMount() {

    }

    componentWillReceiveProps(nextProps) {
        //console.log(nextProps);

        this.setState({
            cine_mode: false
        });

    }

    setCineMode(image) {

        this.setState({
            cine_mode: true,
            image:image
        });

    }

    renderViewer() {

        var files = this.props.files;
        var url = this.props.url;
        var cine_mode = this.state.cine_mode;
        var image = this.state.image;

        if (cine_mode) {

            if (isViewerLoadingAURLSource(url)) {

                return (<RktViewerDicomMultiframe image={image} img_source="wado"/>);

            }else{
                return (<RktViewerDicomMultiframe image={image} img_source="filesystem"/>);
            }

        } else {

            if (isViewerLoadingAURLSource(url)) {

                return (<RktViewerDicomOneFrame img_url={url} img_source="wado" open_cine_viewer={this.setCineMode.bind(this)} />);

            } else {

                return (<RktViewerDicomOneFrame img_url={files} img_source="filesystem" open_cine_viewer={this.setCineMode.bind(this)} />);

            }
        }
    }

    render() {

        return (
            <div className="grid-block">
                {this.renderViewer()}
            </div>
        );
    }
}