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
import PropTypes from 'prop-types';
import { DropTarget } from 'react-dnd';

import { ItemTypes } from "./../../Constants";

const dropDicomTarget = {

    drop(props, monitor, component) {

        var item = monitor.getItem() // item = {files, imgCanvas, index_grid} (what 'dragSouce' returns)

        if (item.imgCanvas !== undefined) {
            component.setItem(item);
        }

    }
};

function collect(connect, monitor) {
    return {
        connectDropTarget: connect.dropTarget(),
        isOver: monitor.isOver(),
        itemType: monitor.getItemType()
    };
}

class RktViewerImageSelectionSidebarDropTarget extends Component {

    constructor(props) {
        super(props);
        this.state = {
            selectedImgCanvas: null
        }

        this.setItem = this.setItem.bind(this);
    
    }

    componentDidUpdate() { }

    setItem(item) {
        //item = {files, imgCanvas, index_grid} (what 'dragSouce' returns)
        this.setState({
            selectedImgCanvas: item.imgCanvas,
        })

        // we confirm that an image has been dropped in the drop target
        var sidebar_targets_item_info = this.props.sidebar_targets_item_info;
        // sidebar_targets_item_info = {"index":key, "label": ?, "isAssigned":true/false, "index_source":?};

        // inmutable, informative variables
        var index_sidebar = sidebar_targets_item_info.index;
        var label_sidebar = sidebar_targets_item_info.label;

        // variables to update
        var toAssignDropTarget = true; // "true" because we are doing an assignment
        var index_grid = item.index_grid;

        this.props.onimgdragdrop(index_sidebar, label_sidebar, toAssignDropTarget, index_grid);
    }

    updateCanvas() {
        var canvas = this.refs.dropTargetCanvas;

        if (canvas) {
            var image_to_display = this.state.selectedImgCanvas;

            if (image_to_display !== undefined) {
                const ctx = canvas.getContext('2d');
                ctx.clearRect(0, 0, canvas.width, canvas.height);

                if (this.props.sidebar_targets_item_info.isAssigned) {
                    ctx.drawImage(image_to_display, 0, 0, canvas.width, canvas.height);
                }
            }
        }
    }

    render() {
        const { files, connectDropTarget, isOver } = this.props;

        return connectDropTarget(
            <div className="grid-block shrink drop-target" style={{ opacity: isOver ? 1 : 0.8 }}>
                <p>{this.props.sidebar_targets_item_info.label}</p>
                <canvas ref="dropTargetCanvas"/>
                {this.updateCanvas()}
            </div>
        );
    }
}

RktViewerImageSelectionSidebarDropTarget.defaultProps = {
    files: ""
}

RktViewerImageSelectionSidebarDropTarget.propTypes = {
    isOver: PropTypes.bool.isRequired,
    img_label: PropTypes.string.isRequired
};

export default DropTarget(ItemTypes.DICOM, dropDicomTarget, collect)(RktViewerImageSelectionSidebarDropTarget);