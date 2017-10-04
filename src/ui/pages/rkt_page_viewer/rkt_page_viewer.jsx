import React, { Component } from 'react';
//components
import RktViewer from './../../components/rkt_viewer/rkt_viewer.jsx';

export default class RktPageViewer extends Component {

  setUrl(url) {
    
    if (url !== false) {
        var browserHistory = this.props.history;
        browserHistory.push("/viewer"+url);

    } else {
        alert("URL not compatible");
    }
  }

  render() {

    return (
      <div className="grid-frame rkt-page-viewer">
        <RktViewer set_url={this.setUrl.bind(this)}/>
      </div>
    );
  }
}