import React, { Component } from 'react';
import PropTypes from "prop-types";
import { ItemTypes } from "./../../../Constants";
import { DragSource } from 'react-dnd';

// components
import RktViewerFilePickerSidebarDragSourceThumbnail from "./rkt_viewer_file_picker_grid_content_drag_source_thumbnail/rkt_viewer_file_picker_grid_content_drag_source_thumbnail";
import RktButtonDeleteIcon from "./../../../../../rkt_button/rkt_button_delete_icon/rkt_button_delete_icon";

const dicomSource = {

    beginDrag(props, monitor, component) {

        var imgCanvas = component.dicom.getImageCanvas();

        return {
            files: props.files,
            imgCanvas: imgCanvas,
            index_grid: props.index
        };
    }
};

function collect(connect, monitor) {
    return {
        connectDragSource: connect.dragSource(),
        isDragging: monitor.isDragging()
    }
}

class RktViewerFilePickerSidebarDragSource extends Component {
    constructor(props) {
        super(props)

        this.state = {
            imgCanvas: null,
        }

        this.renderDicom = this.renderDicom.bind(this);
        this.renderLabel = this.renderLabel.bind(this);
        this.handleClickCancel = this.handleClickCancel.bind(this);

    }

    componentDidMount() {}

    renderDicom() {

        var index = this.props.index;
        var files = this.props.files;
        var url = this.props.url; // for the moment, empty
        var isSelected = this.props.isSelected;

        return (
            <RktViewerFilePickerSidebarDragSourceThumbnail ref={(dicom) => this.dicom = dicom}
                index={index}
                files={files}
                url={url}
                isSelected={isSelected}
                onLoaded={this.props.onLoaded}
                onClick={this.props.onClick}
            />
        );
    }

    renderLabel() {
        // if (this.state.assigned_label)
        if (this.props.assigned_label)
            return (<div className="assigned-label">
                {/* <span className="assigned-label-name">{this.state.assigned_label}</span> */}
                <span className="assigned-label-name">{this.props.assigned_label}</span>
                <RktButtonDeleteIcon onClick={this.handleClickCancel} />
            </div>);
        return "";
    }

    handleClickCancel() {
        // the corresponding dicom in the SIDEBAR is removed
        this.props.onimgdragdrop(this.props.assigned_label, false, this.props.index); // "false" because label assignment is cancelled
    }

    render() {
        const { connectDragSource, isDragging } = this.props;

        return connectDragSource((
            <div className="grid-block drag-source" onClick={this.handleClick} >
                <div ref={(dicomContainer) => { this.dicomContainer = dicomContainer; }}>
                    {this.renderDicom()}
                    {this.renderLabel()}
                </div>
            </div>
        ));
    }
}

RktViewerFilePickerSidebarDragSource.defaultProps = {
    isSelected: false
}

RktViewerFilePickerSidebarDragSource.propTypes = {
    connectDragSource: PropTypes.func.isRequired,
    isDragging: PropTypes.bool.isRequired,
    isSelected: PropTypes.bool.isRequired,
    index: PropTypes.number.isRequired,
};

export default DragSource(ItemTypes.DICOM, dicomSource, collect)(RktViewerFilePickerSidebarDragSource);