import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { DropTarget } from 'react-dnd';

import { ItemTypes } from "./../../Constants";

const dropDicomTarget = {

    drop(props, monitor, component) {

        var item = monitor.getItem() // item = {files, imgCanvas} (what 'dragSouce' returns)
        //console.log("Dropped item:" + JSON.stringify(item));
        component.setImage(item);

        return {
            img_label: props.img_label
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

class RktViewerFilePickerSidebarDropTarget extends Component {

    constructor(props) {
        super(props);
        this.state = {
            selectedImgCanvas: null
        }

        this.setImage = this.setImage.bind(this);
    }

    componentDidUpdate() {}

    setImage(image) {
        this.setState({
            selectedImgCanvas: image.imgCanvas,
        })

        // we confirm that this drop-target has been assigned with a dicom of the grid
        this.props.handleassignment(this.props.img_label, true); // "true" because we are dpoing an assignment
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