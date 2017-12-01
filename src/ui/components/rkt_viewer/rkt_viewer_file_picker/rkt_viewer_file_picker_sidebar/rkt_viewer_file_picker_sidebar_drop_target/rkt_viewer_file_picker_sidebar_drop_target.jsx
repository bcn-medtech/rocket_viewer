import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { DropTarget } from 'react-dnd';

import { ItemTypes } from "./../../Constants";

const dropDicomTarget = {

    drop(props, monitor, component) {

        var item = monitor.getItem() // item = {files, imgCanvas, index_grid} (what 'dragSouce' returns)
        //console.log("Dropped item:" + JSON.stringify(item));
        component.setItem(item);

    }
};

function collect(connect, monitor) {
    return {
        connectDropTarget: connect.dropTarget(),
        isOver: monitor.isOver(),
        itemType: monitor.getItemType()
    };
}

class RktViewerFilePickerSidebarDropTarget extends Component {

    constructor(props) {
        super(props);
        this.state = {
            selectedImgCanvas: null
        }

        this.setItem = this.setItem.bind(this);
    }

    componentDidUpdate() {}

    setItem(item) {
        //item = {files, imgCanvas, index_grid} (what 'dragSouce' returns)
        this.setState({
            selectedImgCanvas: item.imgCanvas,
        })

        // we confirm that an image has been dropped in the drop target
        this.props.onimgdragdrop(this.props.img_label, true, item.index_grid); // "true" because we are doing an assignment
    }

    updateCanvas() {
        var canvas = this.refs.dropTargetCanvas;

        if (canvas) {
            var image_to_display = this.state.selectedImgCanvas;

            const ctx = canvas.getContext('2d');
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            if (this.props.isAssigned) {
                ctx.drawImage(image_to_display, 0, 0, canvas.width, canvas.height);
            }
        }
    }

    render() {
        const { files, connectDropTarget, isOver } = this.props;
        
        return connectDropTarget(
            <div className="grid-block drop-target" style={{ opacity: isOver ? 1 : 0.8 }}>
                <p>{this.props.img_label}</p>
                <canvas ref="dropTargetCanvas" />
                {this.updateCanvas()}
            </div>
        );
    }
}

RktViewerFilePickerSidebarDropTarget.defaultProps = {
    files: ""
}

RktViewerFilePickerSidebarDropTarget.propTypes = {
    isOver: PropTypes.bool.isRequired,
    img_label: PropTypes.string.isRequired
};

export default DropTarget(ItemTypes.DICOM, dropDicomTarget, collect)(RktViewerFilePickerSidebarDropTarget);