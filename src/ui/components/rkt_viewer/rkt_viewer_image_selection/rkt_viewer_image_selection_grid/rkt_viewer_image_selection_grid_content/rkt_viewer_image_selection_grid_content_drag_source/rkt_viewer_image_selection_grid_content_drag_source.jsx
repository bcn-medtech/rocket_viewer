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
import PropTypes from "prop-types";
import { ItemTypes } from "./../../../Constants";
import { DragSource } from 'react-dnd';

// components
import RktViewerImageSelectionSidebarDragSourceThumbnail from "./rkt_viewer_image_selection_grid_content_drag_source_thumbnail/rkt_viewer_image_selection_grid_content_drag_source_thumbnail";
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

class RktViewerImageSelectionSidebarDragSource extends Component {
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
            <RktViewerImageSelectionSidebarDragSourceThumbnail ref={(dicom) => this.dicom = dicom}
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

RktViewerImageSelectionSidebarDragSource.defaultProps = {
    isSelected: false
}

RktViewerImageSelectionSidebarDragSource.propTypes = {
    connectDragSource: PropTypes.func.isRequired,
    isDragging: PropTypes.bool.isRequired,
    isSelected: PropTypes.bool.isRequired,
    index: PropTypes.string.isRequired,
};

export default DragSource(ItemTypes.DICOM, dicomSource, collect)(RktViewerImageSelectionSidebarDragSource);