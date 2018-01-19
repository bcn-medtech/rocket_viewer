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
//libraries
import PDF from 'react-pdf-js';
//actions
import { loadPDF } from './rkt_viewer_pdf_actions.js';
//components
import RktAnimationLoading from './../../rkt_animation/rkt_animation_loading/rkt_animation_loading';

export default class RktViewerPDF extends Component {

    constructor() {
        super();

        this.state = {
            pages: false,
            loaded: false
        }
    }

    initstate(){
        
        this.setState({
            loaded:false,
            pages:false
        });
    }

    componentDidMount() {

        this.initstate();

        var url = this.props.url;
        var blob = this.props.files;

        var myComponent = this;

        loadPDF(url, blob, function(newblob){

            myComponent.setState({
                pages:false,
                loaded:true,
                blob:newblob
            });

        });
    }

    componentWillReceiveProps(nextProps) {

        this.initstate();

        var url = nextProps.url;
        var blob = nextProps.files;

        var myComponent = this;

        loadPDF(url, blob, function(newblob){

            myComponent.setState({
                pages:false,
                loaded:true,
                blob:newblob
            });

        });
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

    renderPDFLoading(){

        if(!this.state.loaded){
            return(<RktAnimationLoading/>);
        }
    }

    renderPDF(){

        var file = this.state.blob;

        if(this.state.loaded){
            return(<PDF className="center" file={file} onDocumentComplete={this.onDocumentComplete} onPageComplete={this.onPageComplete} page={this.state.page} />);
        }
    }

    render() {

        //let pagination = null;
        //var files = this.props.files;
        //var file = files[0];

        /*if (this.state.pages) {
            pagination = this.renderPagination(this.state.page, this.state.pages);
        }*/

        return (
            <div className="grid-block rkt-viewer-pdf">
                {this.renderPDFLoading()}
                {this.renderPDF()}
                {/*pagination*/}
            </div>
        )
    }
}