import React, { Component, PropTypes } from 'react';
import RktViewerThumbnail from './rkt_viewer_file_picker_grid_content_thumbnail/rkt_viewer_file_picker_grid_content_thumbnail';

export default class RktViewerFilePickerGridContent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedImg: -1,
            dicomInstances: [],
        }

        // // This binding is necessary to make 'this' work in the callback
        // this.handleClick = this.handleClick.bind(this);
        // this.handleDicomLoaded = this.handleDicomLoaded.bind(this);
        // this.clearGrid = this.clearGrid.bind(this);
        // this.renderGrid = this.renderGrid.bind(this);
        // this.render = this.render.bind(this);
    }

    // componentWillUpdate(nextProps) {
    //     if (nextProps.dicomList != this.props.dicomList) {
    //         this.clearGrid();
    //     }
    // }

    // clearGrid() {
    //     //console.log("cleargrid");
    //     this.setState({
    //         selectedImg: -1,
    //         dicomInstances: [],
    //     });
    // }

    // handleClick(index) {
    //     this.setState({
    //         selectedImg: index
    //     })
    // }

    // handleDicomLoaded(data) {
    //     let instances = this.state.dicomInstances;
    //     instances.push(data);
    //     this.setState({
    //         dicomInstances: instances
    //     })
    //     this.props.onChange(this.state.dicomInstances);
    // }


    renderGrid() {
        var dicomList = this.props.dicomList;
        
        return (
            dicomList.map((file, key) => {

                return (
                    
                    // <RktViewerThumbnail
                    //     index={key}
                    //     imgUrl={file}
                    //     isSelected={key === this.state.selectedImg}
                    //     onClick={this.handleClick}
                    //     onLoaded={this.handleDicomLoaded}
                    // />
                    <h4>
                        {file.name}
                    </h4>
                )
            })
        );


    }

    render() {

        return (

            <div className="grid-block vertical grid-content">
                {/* <div ref={(dicomGrid) => { this.dicomGrid = dicomGrid }} className="grid-block medium-up-2 small-up-1 " >
                    {this.renderGrid()}
                </div> */}
                {this.renderGrid()}
            </div>
        );
    }
}