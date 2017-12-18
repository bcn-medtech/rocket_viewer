var JSZip = require("jszip");
var FileSaver = require('file-saver');

export function setConfigInfo(config) {
    // config: array

    //"sidebar_targets_info": info of the drop targets (SIDEBAR elements) of the file picker-- >
    var sidebar_targets_info = {};

    for (var i = 0; i < config.length; i++) {

        //DROP TARGET
        var label = config[i];
        sidebar_targets_info[i] = { "index": i, "label": label, "isAssigned": false, "index_source": undefined };

    }

    return sidebar_targets_info;
}

export function updateImageSelectionInfo(grid_sources_info, sidebar_targets_info, index_sidebar, label_sidebar, toAssignDropTarget, index_grid) {

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

        for (var j = 0; j < Object.keys(grid_sources_info).length; j++) {

            if (grid_sources_info[j].assigned_label === label_sidebar) {
                // this grid thumbnail cannot have the current sidebar label any more
                grid_sources_info[j].assigned_label = false;
                grid_sources_info[j].hasLabelAssigned = false;
                grid_sources_info[j].index_target = false;
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

export function loadZipWithInfo(grid_sources_info) {
    // grid_sources_item_info = {"index":id, "imgCanvas": ?, "metadata": ?, "file": ?, "hasLabelAssigned":true/false, "assigned_label":?, "index_target":?}; 

    // we only want the info of the thumbnails with a label assigned
    obtainDesiredInfo(grid_sources_info, function (pngs_data, json_data) {
        // pngs_data = [{"canvas": canvas, "imgName": string}, ..., {"canvas": canvas, "imgName": string}];
        // json_data = ["patient_name_1":{"fileName":string, "filePath":string, "label":string, "metadata": object}, ..., "patient_name_n":{"fileName":string, "filePath":string, "label":string, "metadata": object}]

        // load this info in a ZIP
        var zip = new JSZip();

        var zipName;
        if (Object.keys(json_data).length === 1) { // there are images of only one patient:
            zipName = Object.keys(json_data)[0];
        } else zipName = "image_selection";

        // JSON DATA
        zip.file("images_data.json", JSON.stringify(json_data));

        // PNGs
        for (var i = 0; i < Object.keys(pngs_data).length; i++) {
            var imgName = pngs_data[i].imgName;

            var canvas = pngs_data[i].canvas;
            var dataURL = canvas.toDataURL();
            var imgData = dataURL.replace("data:image/png;base64", "");

            zip.file(imgName+".png", imgData, { base64: true });
        }

        zip.generateAsync({ type: "blob" })
            .then(function (content) {
                FileSaver.saveAs(content, zipName+".zip");
            });
    })
}

function obtainDesiredInfo(grid_sources_info, callback) {
    // we only want the info of the thumbnails with a label assigned
    var pngs_to_load = [];
    var json_to_load = {};
    var patient_names_array = [];

    for (var i = 0; i < Object.keys(grid_sources_info).length; i++) {
        var info_to_check = grid_sources_info[i];

        if (info_to_check.hasLabelAssigned) {

            // UPDATE OF "json_to_load"
            var file_to_load = info_to_check.file;
            var fileName = file_to_load.name;

            var filePath;
            if (file_to_load.webkitRelativePath !== "") {
                filePath = file_to_load.webkitRelativePath;
            } else {
                filePath = fileName;
            }

            var label = info_to_check.assigned_label;
            var metadata = info_to_check.metadata;

            // in case some of there are tags with "undefined" values (which are not detected by JSZip.js):
            var tags = Object.keys(metadata);
            for (var j = 0; j < tags.length; j++) {
                var current_tag = tags[j];
                var current_value = metadata[current_tag];
                if (current_value === undefined) {
                    metadata[current_tag] = ""; // these are changed with ""
                }
            }

            // "json_to_load" will distinguish dicoms depending on their patient name:
            var patient_name = metadata["patient_name"];

            var isNewPatient = lookForElementInArray(patient_name, patient_names_array);
            
            if (isNewPatient) {
                patient_names_array.push(patient_name);
                json_to_load[patient_name] = [];
            }

            json_to_load[patient_name].push({ "fileName": fileName, "filePath": filePath, "label": label, "metadata": metadata });
            
            // UPDATE OF "pngs_to_load"
            var png_canvas_to_load = info_to_check.imgCanvas;
            pngs_to_load.push({"canvas":png_canvas_to_load, "imgName":fileName});
        }

    }

    callback(pngs_to_load, json_to_load)
}

function lookForElementInArray(element, array) {
    var isNewElement = true;

    if (array.length === 0) {
        isNewElement = true;

    } else if (array.length > 0) {
        
        for (var i = 0; i < array.length; i++) {
            if (array[i] === element) {
                isNewElement = false;
                break;
            }
    
            if (!isNewElement) break;
        }
    }

    return isNewElement;
}