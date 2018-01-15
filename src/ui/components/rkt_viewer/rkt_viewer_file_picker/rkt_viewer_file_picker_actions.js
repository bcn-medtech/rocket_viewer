
export function setConfigInfo(config) {

    var image_types = config.image_types;

    //"sidebar_targets_info": info of the drop targets(SIDEBAR elements) of the file picker-- >
    var sidebar_targets_info = {};

    //for the moment we can initialize "sidebar_targets_info":
    // for (var i = 0; i < image_types.length; i++) {

    //     //DROP TARGET
    //     var dicom_type = image_types[i];
    //     var label = dicom_type.label;

    //     sidebar_targets_info[i] = { "index": i, "label": label, "isAssigned": false, "index_source": undefined };

    // }

    for (var i = 0; i < config.length; i++) {

        //DROP TARGET
        var label = config[i];
        sidebar_targets_info[i] = { "index": i, "label": label, "isAssigned": false, "index_source": undefined };

    }

    return sidebar_targets_info;
}

export function updateFilePickerInfo(grid_sources_info, sidebar_targets_info, index_sidebar, label_sidebar, toAssignDropTarget, index_grid) {

    var grid_source_to_update = grid_sources_info[index_grid];
    var sidebar_target_to_update = sidebar_targets_info[index_sidebar];

    if (!toAssignDropTarget) { // case of clicking a deleteIcon in a GRID thumbnail

        // DRAG SOURCE update: 
        // the current label of the GRID thumbnail is updated to FALSE,
        grid_source_to_update.hasLabelAssigned = false;
        grid_source_to_update.assigned_label = false;
        // and it does NOT have any target associated:
        grid_source_to_update.index_target = false;

        // DROP TARGET update: 
        // the current SIDEBAR element has NOT any GRID thumbnail assigned,
        sidebar_target_to_update.isAssigned = false;
        // and it does NOT have any source associated
        sidebar_target_to_update.index_source = false;

    } else { // case of dragging a GRID thumbnail into a SIDEBAR element

        for (var i = 0; i < Object.keys(sidebar_targets_info).length; i++) {

            if (sidebar_targets_info[i].index_source === index_grid) {
                // this sidebar element cannot have the current source associated
                sidebar_targets_info[i].index_source = false;
                sidebar_targets_info[i].isAssigned = false;
            }
        }

        for (var i = 0; i < Object.keys(grid_sources_info).length; i++) {

            if (grid_sources_info[i].assigned_label === label_sidebar) {
                // this grid thumbnail cannot have the current sidebar label any more
                grid_sources_info[i].assigned_label = false;
                grid_sources_info[i].hasLabelAssigned = false;
                grid_sources_info[i].index_target = false;
            }
        }

        // DRAG SOURCE update: 
        // the current label of the GRID thumbnail is updated,
        grid_source_to_update.hasLabelAssigned = true;
        grid_source_to_update.assigned_label = label_sidebar;
        // and it DOES have a target associated
        grid_source_to_update.index_target = index_sidebar;

        // DROP TARGET update: 
        // the current SIDEBAR element HAS a thumbnail assigned
        sidebar_target_to_update.isAssigned = true;
        // and it DOES have a source associated
        sidebar_target_to_update.index_source = index_grid;

    }

    // final update
    grid_sources_info[index_grid] = grid_source_to_update;
    sidebar_targets_info[index_sidebar] = sidebar_target_to_update;

    return [grid_sources_info, sidebar_targets_info];
}