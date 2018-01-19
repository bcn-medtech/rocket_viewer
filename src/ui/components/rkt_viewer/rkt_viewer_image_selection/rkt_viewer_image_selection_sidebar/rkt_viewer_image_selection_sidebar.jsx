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
import RktViewerImageSelectionSidebarDropTarget from "./rkt_viewer_image_selection_sidebar_drop_target/rkt_viewer_image_selection_sidebar_drop_target";

export default class RktViewerImageSelectionSidebar extends Component {

    constructor() {
        super();

        this.state = {}

        this.renderDicomPlaceholders = this.renderDicomPlaceholders.bind(this);

    }

    renderDicomPlaceholders() {
        var sidebar_targets_info = this.props.sidebar_targets_info;

        if (sidebar_targets_info) {

            var keys_sidebar_targets_info = Object.keys(sidebar_targets_info); // ["0", "1", ... , "n"]

            return (
                <div className="grid-block vertical drop-targets-items">
                    {keys_sidebar_targets_info.map((key) => {

                        var sidebar_targets_item_info = this.props.sidebar_targets_info[key];
                        // sidebar_targets_item_info = {"index":key, "label": ?, "isAssigned":true/false, "index_source":?};

                        return (
                            <RktViewerImageSelectionSidebarDropTarget
                                index={key}
                                sidebar_targets_item_info={sidebar_targets_item_info}
                                onimgdragdrop={this.props.onimgdragdrop}
                            />
                        )
                    })}

                </div>

            );

        } else {
            return <p>Loading</p>
        }
    }

    render() {
        return (
            <div className="grid-block medium-2 vertical image-selection-sidebar" >
                {this.renderDicomPlaceholders()}
            </div>
        );
    }
}