import React, { Component } from 'react';
//import { Page } from 'react-pdf';
import { Document, Page } from 'react-pdf/build/entry.webpack';

export default class RktViewerPDF extends Component {

    constructor() {
        super();

        this.state = {
            numPages: null,
            pageNumber: 1,
        }
    }

    onDocumentLoad({ numPages }) {
        this.setState({ numPages });
    }

    render() {

        var files = this.props.files;
        var url = this.props.url;

        const { pageNumber, numPages } = this.state;
        var file = files[0];

        return (
            <div>
                {/*<Document
                    file={file}
                    onLoadSuccess={this.onDocumentLoad.bind(this)}>
                    <Page pageNumber={pageNumber}/>
                </Document>
                <p>Page {pageNumber} of {numPages}</p>*/}
                <div className="Example">
                    <div className="Example__container">
                        <div className="Example__container__document rkt-pdf-viewer-page">
                            <Document
                                file={file}
                                onLoadSuccess={this.onDocumentLoadSuccess}
                            >
                                {
                                    Array.from(
                                        new Array(numPages),
                                        (el, index) => (
                                            <Page
                                                className=""
                                                key={`page_${index + 1}`}
                                                pageNumber={index + 1}
                                                onRenderSuccess={this.onPageRenderSuccess}
                                                width={Math.min(900, document.body.clientWidth)}
                                            />
                                        ),
                                    )
                                }
                            </Document>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}