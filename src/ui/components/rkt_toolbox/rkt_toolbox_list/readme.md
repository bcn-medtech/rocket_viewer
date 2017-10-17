# RktToolboxList

**Input (Props):**

* title: name of the toolbox list

* items: elements of the toolbox list

* onclickitem: function to execute when an item is clicked


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