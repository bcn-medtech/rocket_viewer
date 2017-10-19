import React, { Component } from 'react';

// actions
import { initScene, loadVTK, retrieveSelectedLabelInfo  } from "./rkt_viewer_vtk_actions.js";
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
            openToolboxTableInputs: false
        }

    }

    initstate() {

        this.setState({
            loaded: false,
            info_toolbox_list: false
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

        loadVTK(scene, url_to_load, this.onSelectedVTKLabel.bind(this),
            // VTK labels obtention
            function (info_toolbox_list, info_toolbox_table_inputs) {

                if ((info_toolbox_list) || (info_toolbox_table_inputs)) {

                    myComponent.setState({
                        info_toolbox_list: info_toolbox_list,
                        info_toolbox_table_inputs: info_toolbox_table_inputs
                    });
                }

            },
            // geometry has been loaded
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
        console.log("CREATE TOOLBOX LIST");
        if (info_toolbox_list) {
            return (
                info_toolbox_list.map((toolbox_list) => {
                    if (toolbox_list.title === "VTK LABELS") {
                        // the toolbox list will have an extra toolbox
                        return (
                            <RktToolboxList key={newId()}
                                title={toolbox_list.title}
                                items={toolbox_list.items}
                                addextratoolboxfunction={this.createToolboxTableInputs.bind(this)}
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

    createToolboxTableInputs(info_toolbox_table_inputs, openToolboxTableInputs) {
        console.log("CREATE TOOLBOX TABLE INPUTS");
        console.log(info_toolbox_table_inputs);
        console.log(openToolboxTableInputs);

        if (info_toolbox_table_inputs) {
            // the toolbox table inputs will only be seen when user 
            // selects a vtk label from the toolbox list
            if (openToolboxTableInputs) {
                return (
                    info_toolbox_table_inputs.map((toolbox_table_inputs) => {
                        return (
                            <RktToolboxTableInputs key={newId()}
                                title={toolbox_table_inputs.title}
                                items={toolbox_table_inputs.items}
                                onsubmit={toolbox_table_inputs.onsubmit} />
                        )
                    })
                );
            }

        }
    }

    onSelectedVTKLabel(selected_label) {

        var myComponent = this;

        var info_toolbox_table_inputs = myComponent.state.info_toolbox_table_inputs;

        retrieveSelectedLabelInfo(selected_label, info_toolbox_table_inputs, function (updated_info) {

            if (updated_info) { // that is, we have to show the toolbox table inputs
                var openToolboxTableInputs = true;

            } else {

            }
            // we "update" (create again) the toolbox table inputs with the info of the current selected label

            if (selected_label !== "Solid Color") openToolboxTableInputs = true;
            else openToolboxTableInputs = false;
            myComponent.createToolboxTableInputs(updated_info, openToolboxTableInputs)

        });
    }

    openCloseToolboxTableInputs(state) {
        this.setState({
            openToolboxTableInputs: state
        });
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