# RktToolboxTableInputs: a toolbox of a table to submit inputs

**Input (Props):**

* **title**: name of the toolbox table inputs

* **items**: elements of the toolbox table inputs

* **onclickitem**: function to execute when an item is clicked

Example of 1 toolbox table inputs with N items:

```
info_toolbox_table_inputs = [
    {
        "title": "Toolbox table inputs #1",
        "items": [
           { "type": "text", "name": "Name Item #1", "extra_info_name": " ", "placeholder": "" },
           ...,
           { "type": "text", "name": "Name Item #N", "extra_info_name": " ", "placeholder": "" }
        ],
        "onSubmit": this.exampleMethod.bind(this)
    }
];

info_toolbox_table_inputs.map((toolbox_table_inputs) => {
    return (
        <RktToolboxTableInputs key={newId()}
            title={toolbox_table_inputs.title}
            items={toolbox_table_inputs.items}
            onsubmitinputs={toolbox_table_inputs.onSubmit} />
    )
})
```