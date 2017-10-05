import React, {Component} from 'react';

export default class RktViewerDicomMultiFrame extends Component {

    /*constructor() {
        super();
    }*/

    render() {
        
        let elementId = this.props.elementId;

        return (
            <div id={"videoControls-"+elementId} className="grid-block video-controls" style={{width: this.props.canvasWidth}}>
                <div className="medium-1 grid-block">
                    <a className="button" id={"playClip-"+elementId} onClick={this.props.onPlayClick}>
                        {this.props.isPlaying ? <i className="fi-pause" /> :  <i className="fi-play" />}
                    </a>
                </div>
                <div className="medium-9 grid-block">
                    <input type="range" id={"slice-range-"+elementId} className="input-range-stack" onInput={this.props.onChangeTime} value={this.props.currentValue} max={this.props.totalFrames} />
                </div>
                <div className="medium-2 grid-block">
                    <span className="frame-count">{this.props.currentValue+1}/{this.props.totalFrames}</span>
                </div>
            </div>
        );
    }
}