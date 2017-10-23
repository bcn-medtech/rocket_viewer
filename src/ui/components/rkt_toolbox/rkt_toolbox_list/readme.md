# RktToolboxList

**Input (Props):**

* **title**: name of the toolbox list

* **items**: elements of the toolbox list

* **onclickitem**: function to execute when an item is clicked


In order to create several toolbox lists, a Javascript object *info_tool_box_list* with keys "title", "items" and "onclickitem" is mapped:

```
var info_toolbox_list = [
    {
        "title": Toolbox list #1, 
        "items": ["Item #1", "Item #2", ... ,"Item #n"],
        "onclickitem": this.exampleMethod1.bind(this)
    },
    ..., 
    {
        "title": Toolbox list #n, 
        "items": ["Item #1", "Item #2", ... ,"Item #n"],
        "onclickitem": this.exampleMethodN.bind(this)
    }
];

info_toolbox_list.map((toolbox_list) => {
    return (
        <RktToolboxList key={newId()}
            title={toolbox_list.title}
            items={toolbox_list.items}
            onclickitem={toolbox_list.onclickitem} />
        )
    })
}
```

**Adding extra toolboxes**

It is possible to add extra toolboxes to the different toolbox lists by adding 2 more props to component *RktToolboxList*:

* **addextratoolboxfunction**: a method to create the extra toolbox within the toolbox list

* **extratoolboxinfo**: the information (props) of the extra toolbox

```
info_toolbox_list.map((toolbox_list) => {
    return (
        <RktToolboxList key={newId()}
            title={toolbox_list.title}
            items={toolbox_list.items}
            onclickitem={toolbox_list.onclickitem} 
            addextratoolboxfunction={this.createExtraToolbox}
            extratoolboxinfo={info_extra_toolbox}/>
        )
    })
}
``` 