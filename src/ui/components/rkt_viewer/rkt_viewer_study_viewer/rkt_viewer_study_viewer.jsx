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

// components
import RktViewerStudyViewerGrid from './rkt_viewer_study_viewer_grid/rkt_viewer_study_viewer_grid';
import RktViewerStudyViewerViewer from './rkt_viewer_study_viewer_viewer/rkt_viewer_study_viewer_viewer';

export default class RktViewerStudyViewer extends Component {

    constructor() {
        super();

        this.state = {};

        this.handleImgSelected = this.handleImgSelected.bind(this);
    }

    componentDidMount() {

    }

    handleImgSelected(files, url, viewerType) {
        // we update the data of the image to display in the viewer
        this.setState({
            files_to_display: files,
            url_to_display: url, 
            viewerType: viewerType
        });
    }

    renderGrid() {
        return (<RktViewerStudyViewerGrid handleimgselected={this.handleImgSelected}/>);
    }

    renderViewer() {
        var url = this.state.url_to_display;
        var files = this.state.files_to_display;
        var viewerType = this.state.viewerType;

        return (<RktViewerStudyViewerViewer url={url} files={files} viewerType={viewerType}/>);
    }

    render() {

        return (
            <div className="grid-block rkt-viewer-study-viewer">
                {this.renderGrid()}
                {this.renderViewer()}
            </div>
        );
    }
}