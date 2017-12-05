var JSZip = require("jszip");
var FileSaver = require('file-saver');


export function loadZipWithInfo(grid_sources_info) {
    // grid_sources_item_info = {"index":id, "imgCanvas": ?, "metadata": ?, "file": ?, "hasLabelAssigned":true/false, "assigned_label":?, "index_target":?}; 

    // we only want the info of the thumnails with a label assigned
    obtainDesiredInfo(grid_sources_info, function (pngs_array, json_data) {
        // pngs_array = [canvas, canvas, ..., canvas];
        // json_data = [{"fileName":string, "filePath":string, "label":string, "metadata": object}, ..., {"fileName":string, "filePath":string, "label":string, "metadata": object}]
        
        // load this info in a ZIP
        //var nameZip = ;
        // json data
        var zip = new JSZip();
        zip.file("images_data.json", JSON.stringify(json_data)); // THIS WORKS

        // pngs
        for (var i = 0; i < pngs_array.length; i++) {
            var imgName = json_data[i].fileName.split(".")[0] + ".png";

            var canvas = pngs_array[i];
            var dataURL = canvas.toDataURL();
            var imgData = dataURL.replace("data:image/png;base64", "");

            zip.file(imgName, imgData, {base64:true});
        }

        zip.generateAsync({ type: "blob" })
            .then(function (content) {
                FileSaver.saveAs(content, "image_selection.zip");
            });

    })
}

function obtainDesiredInfo(grid_sources_info, callback) {
    var pngs_to_load = [];
    var json_to_load = [];//{};

    for (var i = 0; i < Object.keys(grid_sources_info).length; i++) {
        var info_to_check = grid_sources_info[i];

        if (info_to_check.hasLabelAssigned) {

            // update of "pngs_to_load"
            var png_canvas_to_load = info_to_check.imgCanvas;
            pngs_to_load.push(png_canvas_to_load);

            // update of "json_to_load"
            var file_to_load = info_to_check.file;
            var fileName = file_to_load.name;

            var filePath;
            if (file_to_load.webkitRelativePath !== "") {
                filePath = file_to_load.webkitRelativePath;
            } else {
                filePath = fileName;
            }

            var metadata = info_to_check.metadata;
            
            // in case some of there are tags with "undefined" values (which are not detected by JSZip.js):
            var tags = Object.keys(metadata);
            for (var j = 0; j < tags.length; j++) {
                var current_tag = tags[j];
                var current_value = metadata[current_tag];
                if (current_value === undefined) {
                    metadata[current_tag] = "";
                }
            }

            var label = info_to_check.assigned_label;
            json_to_load.push({ "fileName": fileName, "filePath": filePath, "label": label, "metadata": metadata });
        }

    }

    callback(pngs_to_load, json_to_load)
}