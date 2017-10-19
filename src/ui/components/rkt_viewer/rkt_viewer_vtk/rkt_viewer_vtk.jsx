import React, { Component } from 'react';

// actions
import { initScene, loadVTK } from "./rkt_viewer_vtk_actions.js";
// modules
import { isObjectEmpty } from './../../../../modules/rkt_module_object';
import { obtainBlobUrl } from "./rkt_viewer_vtk_modules.js";
// components
import RktToolboxList from "./../../rkt_toolbox/rkt_toolbox_list/rkt_toolbox_list";
import RktAnimationLoading from './../../rkt_animation/rkt_animation_loading/rkt_animation_loading';
// utils
import newId from "./../../../../utils/newid.js";

export default class RktViewerVTK extends Component {

    constructor() {
        super()
        this.state = {
            loaded: false,
            info_toolbox_list: false
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

        loadVTK(scene, url_to_load,
            // VTK labels obtention
            function (info_toolbox_list) {
                if (info_toolbox_list) {
                    myComponent.setState({
                        info_toolbox_list: info_toolbox_list
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

    createToolboxList(info_toolbox_list) {
        if (info_toolbox_list) {
            return (
                info_toolbox_list.map((toolbox_list) => {
                    return (
                        <RktToolboxList key={newId()}
                            title={toolbox_list.title}
                            items={toolbox_list.items}
                            onclickitem={toolbox_list.onclickitem} />
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
        return (
            <div className="vertical grid-block rkt-viewer-vtk" >
                {this.renderVTKLoading()}
                <div className="grid-block container-toolboxes" id="container-toolboxes" >
                    {this.createToolboxList(info_toolbox_list)}
                </div>
                <div className="container-axes" id="container-axes" ></div>
                <div className="container-viewer" id="container-viewer" ></div>
            </div>
        );
    }
}