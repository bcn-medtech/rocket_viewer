import React, { Component } from 'react';

// actions
import { obtainBlobUrl, initScene, loadPLY } from "./rkt_viewer_ply_actions.js"
// modules
import { isObjectEmpty } from './../../../../modules/rkt_module_object';
// components
import RktAnimationLoading from './../../rkt_animation/rkt_animation_loading/rkt_animation_loading';

export default class RktViewerPLY extends Component {

    constructor() {
        super()
        this.state = {
            loaded: false
        }
    }

    initstate() {

        this.setState({
            loaded: false
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

                myComponent.loadPLY(scene,url,blob);

            }else{
                alert("Problems creating the Scene");
            }
        });
    }

    componentWillReceiveProps(nextProps) {

        this.initstate(); // this.state.loaded is set to "false"

        var url = nextProps.url;
        var blob = nextProps.files;
        var scene = this.state.scene;

        if(!isObjectEmpty(scene)){
            this.loadPLY(scene,url,blob);
        }else{
            alert("Problems with the scene");
        }
    }
            
    loadPLY(scene,url,blob){
        
        var url_to_load;
        var myComponent = this;

        if (!isObjectEmpty(url)) {

            url_to_load = url;

        } else if (!isObjectEmpty(blob)) {

            var blob_url = obtainBlobUrl(blob);
            url_to_load = blob_url;

        }
        
        loadPLY(scene, url_to_load,function(geometryLoaded){
            if(geometryLoaded){
                myComponent.setState({
                    loaded: true
                });
            }
        });
    }

    renderPLYLoading() {
        if (!this.state.loaded) {
            return (<RktAnimationLoading />);
        }
    }

    render() {
        return (
            <div className="vertical grid-block rkt-viewer-ply" >
                {this.renderPLYLoading()}
                <div className="container-axes" id="container-axes" ></div>
                <div className="container-viewer" id="container-viewer" ></div>
            </div>
        );
    }
}