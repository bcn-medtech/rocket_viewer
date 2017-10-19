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