import React, { Component } from 'react';
import PropTypes from "prop-types";
import { ItemTypes } from "./../../../Constants";
import { DragSource } from 'react-dnd';

// components
import RktViewerFilePickerSidebarDragSourceThumbnail from "./rkt_viewer_file_picker_grid_content_drag_source_thumbnail/rkt_viewer_file_picker_grid_content_drag_source_thumbnail";
import RktButtonDeleteIcon from "./../../../../../rkt_button/rkt_button_delete_icon/rkt_button_delete_icon";

const dicomSource = {

    beginDrag(props, monitor, component) {

        var imgCanvas = component.dicom.getImageDataURL();

        return {
            files: props.files,
            imgCanvas: imgCanvas,
            index_grid: props.grid_sources_item_info.index
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

        var assigned_label = this.props.grid_sources_item_info.assigned_label;
        if (assigned_label)
            return (<div className="assigned-label">
                <span className="assigned-label-name">{assigned_label}</span>
                <RktButtonDeleteIcon onClick={this.handleClickCancel} />
            </div>);
        return "";
    }

    handleClickCancel() {
        // the corresponding dicom in the SIDEBAR is removed
        
        var grid_sources_item_info = this.props.grid_sources_item_info;
        // grid_sources_item_info = {"index":id, "imgCanvas": ?, "file": ?, "hasLabelAssigned":true/false, "assigned_label":?, "index_target":?};
        
        // inmutable, informative variables
        var index_grid = grid_sources_item_info.index;

        // variables to update
        var index_sidebar = grid_sources_item_info.index_target;
        var label_sidebar = grid_sources_item_info.assigned_label;
        var toAssignDropTarget = false; // "false" because label assignment is cancelled

        this.props.onimgdragdrop(index_sidebar, label_sidebar, toAssignDropTarget, index_grid);
    }

    render() {
        const { connectDragSource, isDragging } = this.props;
        return connectDragSource((
            <div className="grid-block shrink drag-source" onClick={this.handleClick} >
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