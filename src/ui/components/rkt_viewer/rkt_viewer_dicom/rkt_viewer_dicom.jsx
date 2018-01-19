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
//Components
import RktViewerDicomOneFrame from './rkt_viewer_dicom_one_frame/rkt_viewer_dicom_one_frame.jsx';
import RktViewerDicomMultiframe from './rkt_viewer_dicom_multi_frame/rkt_dicom_viewer_multi_frame';
//actions
import { isViewerLoadingAURLSource } from './rkt_viewer_dicom_actions.js';

export default class RktViewerDicom extends Component {

    constructor() {
        super();

        this.state = {
            cine_mode: false
        };
    }

    componentDidMount() {

    }

    componentWillReceiveProps(nextProps) {
        
        this.setState({
            cine_mode: false
        });

    }

    setCineMode(image) {

        this.setState({
            cine_mode: true,
            image:image
        });

    }

    renderViewer() {

        var files = this.props.files;
        var url = this.props.url;
        var cine_mode = this.state.cine_mode;
        var image = this.state.image;

        if (cine_mode) {

            if (isViewerLoadingAURLSource(url)) {

                return (<RktViewerDicomMultiframe image={image} img_source="wado"/>);

            }else{
                return (<RktViewerDicomMultiframe image={image} img_source="filesystem"/>);
            }

        } else {

            if (isViewerLoadingAURLSource(url)) {

                return (<RktViewerDicomOneFrame img_url={url} img_source="wado" open_cine_viewer={this.setCineMode.bind(this)} />);

            } else {

                return (<RktViewerDicomOneFrame img_url={files} img_source="filesystem" open_cine_viewer={this.setCineMode.bind(this)} />);

            }
        }
    }

    render() {

        return (
            <div className="grid-block">
                {this.renderViewer()}
            </div>
        );
    }
}