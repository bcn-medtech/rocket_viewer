import React, { Component } from 'react';

// components
import RktViewerFilterDicomMain from './rkt_viewer_filter_dicom_main/rkt_viewer_filter_dicom_main';
import RktViewerFilterDicomFiltered from './rkt_viewer_filter_dicom_filtered/rkt_viewer_filter_dicom_filtered';

export default class RktViewerFilterDicom extends Component {

    constructor() {
        super();

        this.state = {};

        this.handleCroppingMainImage = this.handleCroppingMainImage.bind(this);
    }

    componentDidMount() {

    }

    handleCroppingMainImage(canvas_image_to_crop, name_image, inputs_cropping_function) {

        this.setState({
            canvas_image_to_crop: canvas_image_to_crop,
            name_image: name_image,
            inputs_cropping_function: inputs_cropping_function
        });
    }


    renderMainDicom() {
        return (<RktViewerFilterDicomMain cropimage={this.handleCroppingMainImage}/>);
    }

    renderFilteredDicom() {
        var canvas_image_to_crop = this.state.canvas_image_to_crop;
        var name_image = this.state.name_image;
        var inputs_cropping_function = this.state.inputs_cropping_function;
        
       return (<RktViewerFilterDicomFiltered canvas_image_to_crop={canvas_image_to_crop} name_image={name_image} inputs_cropping_function={inputs_cropping_function} />);
    }

    render() {
        return (
            <div className="grid-block rkt-viewer-filter-dicom">
                {this.renderMainDicom()}
                {this.renderFilteredDicom()}
            </div>
        );
    }
}