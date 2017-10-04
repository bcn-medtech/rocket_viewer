# RktButtonIconCircleTextBig

### How to use it?

**Input (Props):**

* text: Text to show bellow

* onclickbutton: Function to call in the current component

* icon: Icon or character to put whitin the button

```
<RktButtonIconCircleTextBig text="" onclickbutton={this.onClickRemoveUser.bind(this)} icon="-"/>
```

### Example

*rkt_page_right_layout_users*

````
import React, { Component } from 'react';

//import syntheticData
import syntheticDataUser from './../../../../json/rkt_metadata_user/rkt_metadata_user.json';
//import ui components
import RktJSONViewer from './../../../components/rkt_json_viewer/rkt_json_viewer';
import RktButtonIconCircleTextBig from './../../../components/rkt_button/rkt_button_icon_circle_text_big/rkt_button_icon_circle_text_big';

export default class RktPageRightLayoutUsers extends Component {

    constructor(){
        super();
        this.state={};
    }

    onClickRemoveUser(){
        console.log("Remove user");
    }

    render() {
        return (
            <div className="grid-block">
                 <RktJSONViewer json={syntheticDataUser}/>
                 <div className="rkt-page-right-layout-users-right-menu">
                     <RktButtonIconCircleTextBig text="" onclickbutton={this.onClickRemoveUser.bind(this)} icon="-"/>
                 </div>
            </div>
        );
    }
}
````



