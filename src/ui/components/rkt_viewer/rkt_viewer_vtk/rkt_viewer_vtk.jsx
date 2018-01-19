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

// actions
import { initScene, loadVTK } from "./rkt_viewer_vtk_actions.js";
// modules
import { isObjectEmpty } from './../../../../modules/rkt_module_object';
import { obtainBlobUrl } from "./rkt_viewer_vtk_modules.js";
// components
import RktToolboxList from "./../../rkt_toolbox/rkt_toolbox_list/rkt_toolbox_list";
import RktToolboxTableInputs from "./../../rkt_toolbox/rkt_toolbox_table_inputs/rkt_toolbox_table_inputs";
import RktAnimationLoading from './../../rkt_animation/rkt_animation_loading/rkt_animation_loading';
// utils
import newId from "./../../../../utils/newid.js";

export default class RktViewerVTK extends Component {

    constructor() {
        super()
        this.state = {
            loaded: false,
            info_toolbox_list: false,
            info_toolbox_table_inputs: false,
            open_toolbox_table_inputs: false
        }
    }

    initstate() {

        this.setState({
            loaded: false,
            info_toolbox_list: false,
            info_toolbox_table_inputs: false
        });
    }

    componentDidMount() {

        var url = this.props.url;
        var blob = this.props.files;

        var myComponent = this;

        initScene(function (scene) {

            if (!isObjectEmpty(scene)) {

                myComponent.setState({
                    scene: scene
                });

                myComponent.loadVTK(scene, url, blob);

            } else {
                alert("Problems creating the Scene");
            }
        });
    }

    componentWillReceiveProps(nextProps) {

        this.initstate(); // this.state.loaded is set to "false"

        var url = nextProps.url;
        var blob = nextProps.files;
        var scene = this.state.scene;

        if (!isObjectEmpty(scene)) {
            this.loadVTK(scene, url, blob);
        } else {
            alert("Problems with the scene");
        }

    }

    loadVTK(scene, url, blob) {

        var url_to_load;
        var myComponent = this;

        if (!isObjectEmpty(url)) {

            url_to_load = url;

        } else if (!isObjectEmpty(blob)) {

            var blob_url = obtainBlobUrl(blob);
            url_to_load = blob_url;

        }

        loadVTK(scene, url_to_load,
            // in case of VTK labels obtention
            function (info_toolbox_list, info_toolbox_table_inputs) {

                if ((info_toolbox_list) || (info_toolbox_table_inputs)) {

                    myComponent.setState({
                        info_toolbox_list: info_toolbox_list,
                        info_toolbox_table_inputs: info_toolbox_table_inputs
                    });
                }

            },
            // when geometry has been loaded
            function (geometryLoaded) {

                if (geometryLoaded) {
                    myComponent.setState({
                        loaded: true
                    })
                }
            }
        );
    }

    createToolboxList(info_toolbox_list, info_toolbox_table_inputs) {

        if (info_toolbox_list) {
            return (
                info_toolbox_list.map((toolbox_list) => {
                    if (toolbox_list.title === "VTK LABELS") {
                        // the toolbox list will have an extra toolbox
                        return (
                            <RktToolboxList key={newId()}
                                title={toolbox_list.title}
                                items={toolbox_list.items}
                                addextratoolboxfunction={this.createToolboxTableInputs}
                                extratoolboxinfo={info_toolbox_table_inputs}
                                onclickitem={toolbox_list.onclickitem} />
                        )
                    } else {
                        // this will be a default toolbox list
                        return (
                            <RktToolboxList key={newId()}
                                title={toolbox_list.title}
                                items={toolbox_list.items}
                                onclickitem={toolbox_list.onclickitem} />
                        )
                    }

                })
            );
        }
    }

    createToolboxTableInputs(info_toolbox_table_inputs) {

        if (info_toolbox_table_inputs) {

            return (
                info_toolbox_table_inputs.map((toolbox_table_inputs) => {
                    return (
                        <RktToolboxTableInputs key={newId()}
                            title={toolbox_table_inputs.title}
                            items={toolbox_table_inputs.items}
                            onsubmitinputs={toolbox_table_inputs.onSubmit} />
                    )
                })
            );

        }
    }

    renderVTKLoading() {
        if (!this.state.loaded) {
            return (<RktAnimationLoading />);
        }
    }

    render() {
        var info_toolbox_list = this.state.info_toolbox_list;
        var info_toolbox_table_inputs = this.state.info_toolbox_table_inputs;

        return (
            <div className="vertical grid-block rkt-viewer-vtk" >
                {this.renderVTKLoading()}
                <div className="grid-block container-toolboxes" id="container-toolboxes" >
                    {this.createToolboxList(info_toolbox_list, info_toolbox_table_inputs)}
                </div>
                <div className="container-axes" id="container-axes" ></div>
                <div className="container-viewer" id="container-viewer" ></div>
            </div>
        );
    }
}