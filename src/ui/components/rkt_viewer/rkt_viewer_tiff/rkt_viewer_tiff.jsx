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

        if (this.state.loaded === false) {
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