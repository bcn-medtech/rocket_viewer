import React, { Component } from 'react';
//components
import RktButtonIconCircleTextBig from './../../rkt_button/rkt_button_icon_circle_text_big/rkt_button_icon_circle_text_big';
import RktAnimationLoading from './../../rkt_animation/rkt_animation_loading/rkt_animation_loading';
//actions
import { loadTiff } from './rkt_viewer_tiff_actions.js';

//Using global variables
const cornerstone = window.cornerstone;
const cornerstoneTools = window.cornerstoneTools;

export default class RktViewerTiff extends Component {

    constructor() {
        super();

        this.state = {
            loaded: false,
            viewer_mode: "window_level"
        };

        this.componentDidMount = this.componentDidMount.bind(this);
        this.displayImage = this.displayImage.bind(this);
    }

    componentDidMount() {

        var element = this.imageDiv;
        cornerstone.enable(element);
        var url = this.props.url;
        var blob = this.props.blob;
        loadTiff(url, blob, this.displayImage);
    }

    componentWillReceiveProps(nextProps) {

        var element = this.imageDiv;
        cornerstone.enable(element);
        var url = nextProps.url;
        var blob = nextProps.blob;
        loadTiff(url, blob, this.displayImage);

    }

    onClickViewerMode() {


        var element = this.imageDiv;

        if (this.state.viewer_mode === "window_level") {


            cornerstoneTools.wwwc.deactivate(element, 1);
            cornerstoneTools.pan.activate(element, 3);

            this.setState({
                viewer_mode: "pan"
            });

        } else if (this.state.viewer_mode === "pan") {

            cornerstoneTools.pan.deactivate(element, 2);
            cornerstoneTools.wwwc.activate(element, 1);

            this.setState({
                viewer_mode: "window_level"
            });

        }
    }

    displayImage(image) {

        var element = this.imageDiv;
        var viewport = cornerstone.getDefaultViewportForImage(element, image);

        cornerstone.displayImage(element, image, viewport);

        this.setState({
            loaded: true,
            image: image
        })

        if (this.props.add_controls) {
            cornerstoneTools.mouseInput.enable(element);
            cornerstoneTools.mouseWheelInput.enable(element);
            //cornerstoneTools.pan.activate(element, 3); // 3 means left mouse button and middle mouse button
            cornerstoneTools.wwwc.activate(element, 1); // ww/wc is the default tool for left mouse button
            //cornerstoneTools.pan.activate(element, 2); // pan is the default tool for middle mouse button
            cornerstoneTools.zoom.activate(element, 4); // zoom is the default tool for right mouse button
            cornerstoneTools.zoomWheel.activate(element); // zoom is the default tool for middle mouse wheel
        }
    }

    renderToolbox() {

        if (this.state.loaded) {
            
            var icon;
            var style;

            if (this.state.viewer_mode === "pan") {

                style =
                    {
                        fontSize: "15pt",
                        marginTop: "4px"
                    }

                icon = <i className="fi-paint-bucket" style={style}></i>;

            } else if (this.state.viewer_mode === "window_level") {

                style =
                    {
                        fontSize: "13pt",
                        marginTop: "6px"
                    }

                icon = <i className="fi-arrows-out" style={style}></i>;
            }

            return (
                <div className="tiff-viewer-right-menu">
                    <RktButtonIconCircleTextBig text="" onclickbutton={this.onClickViewerMode.bind(this)} icon={icon} />
                </div>
            );
        }
    }

    renderLoading() {

        if (this.state.loaded == false) {
            return (<RktAnimationLoading />);
        }
    }

    render() {

        return (
            <div className="grid-block rkt-viewer-tiff">
                {this.renderToolbox()}
                {this.renderLoading()}
                <div className="dicomImage" ref={(imgDiv) => this.imageDiv = imgDiv}
                    style={{ top: "0px", left: "0px", width: "100%", height: this.props.canvas_height }}>
                </div>
            </div>
        );
    }
}

RktViewerTiff.defaultProps = {
    //img_url: "",
    add_controls: true,
    //img_source: "wado"
    url: "",
};