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

export default class RktCard extends Component {

    constructor() {
        super();
        this.state = {};
    }

    onClickLink(link) {
        this.props.seturl(link);
    }

    renderTags(tags) {
        return (
            tags.map((tag) => {

                var mytag = "#" + tag;
                return (
                    <div className="grid-block shrink rkt-card-viewer-tag">
                        {mytag}
                    </div>

                )
            })
        );
    }

    renderLinks(examples) {
        return (
            examples.map((example) => {
                return (
                    <div className="grid-block rkt-card-viewer-link">
                        <a onClick={this.onClickLink.bind(this, example.link)}><i className="fi-link"></i> {example.name}</a>
                    </div>

                )
            })
        );
    }

    render() {

        var viewer = this.props.viewer;
        var tittle = viewer.name;
        var description = viewer.description;
        var examples = viewer.examples;
        var tags = viewer.tags;

        return (
            <div className="grid-block shrink rkt-card-viewer">
                <div className="grid-block shrink vertical rkt-card-viewer-content">
                    <div className="grid-block"><h2>{tittle}</h2></div>
                    <div className="grid-block" style={{ overflow: "hidden" }}>{description}</div>
                    <div className="grid-block vertical rkt-card-viewer-links">
                        {this.renderLinks(examples)}
                    </div>
                    <div className="grid-block rkt-card-viewer-tags">
                        {this.renderTags(tags)}
                    </div>
                </div>
            </div>
        );
    }
}