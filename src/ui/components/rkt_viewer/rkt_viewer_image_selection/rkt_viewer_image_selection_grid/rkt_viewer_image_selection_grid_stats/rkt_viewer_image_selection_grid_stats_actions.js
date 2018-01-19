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

var JSZip = require("jszip");
var FileSaver = require('file-saver');

export function loadZipWithInfo(grid_sources_info) {
    // grid_sources_item_info = {"index":id, "imgCanvas": ?, "metadata": ?, "file": ?, "hasLabelAssigned":true/false, "assigned_label":?, "index_target":?}; 

    // we only want the info of the thumnails with a label assigned
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