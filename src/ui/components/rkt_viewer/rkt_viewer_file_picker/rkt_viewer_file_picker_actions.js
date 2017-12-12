
export function setConfigInfo(config) {
    //console.log("SET CONFIG INFO");

    var image_types = config.image_types;
    //console.log(image_types);

    // "sidebar_targets_info": info of the drop targets (SIDEBAR elements) of the file picker -->
    var sidebar_targets_info = {};

    // for the moment we can initialize "sidebar_targets_info":
    for (var i = 0; i < image_types.length; i++) {

        // DROP TARGET
        var dicom_type = image_types[i];
        var label = dicom_type.label;

        sidebar_targets_info[i] = { "index": i, "label": label, "isAssigned": false, "index_source": undefined };

    }
    return sidebar_targets_info;
}