import React, { Component } from 'react';

import PDF from 'react-pdf-js';

export default class RktViewerPDF extends Component {

    constructor(){
        super();
        this.state={
            pages:false
        }
    }

    onDocumentComplete = (pages) => {
        this.setState({ page: 1, pages });
    }

    onPageComplete = (page) => {
        this.setState({ page });
    }

    handlePrevious = () => {
        this.setState({ page: this.state.page - 1 });
    }

    handleNext = () => {
        this.setState({ page: this.state.page + 1 });
    }

    /*renderPagination = (page, pages) => {
        let previousButton = <li className="previous" onClick={this.handlePrevious}><a href="#"><i className="fa fa-arrow-left"></i> Previous</a></li>;
        if (page === 1) {
            previousButton = <li className="previous disabled"><a href="#"><i className="fa fa-arrow-left"></i> Previous</a></li>;
        }
        let nextButton = <li className="next" onClick={this.handleNext}><a href="#">Next <i className="fa fa-arrow-right"></i></a></li>;
        if (page === pages) {
            nextButton = <li className="next disabled"><a href="#">Next <i className="fa fa-arrow-right"></i></a></li>;
        }
        return (
            <nav>
                <ul className="pager">
                    {previousButton}
                    {nextButton}
                </ul>
            </nav>
        );
    }*/

    render() {
        
        let pagination = null;
        var files = this.props.files;
        var file = files[0];

        /*if (this.state.pages) {
            pagination = this.renderPagination(this.state.page, this.state.pages);
        }*/

        return (
            <div className="grid-block rkt-viewer-pdf">
                <PDF className="center" file={file} onDocumentComplete={this.onDocumentComplete} onPageComplete={this.onPageComplete} page={this.state.page} />
                {/*pagination*/}
            </div>
        )
    }
}