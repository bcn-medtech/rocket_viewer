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

export function obtainBlobUrl(blob) {
    var file = blob[0];
    var blob_url = window.URL.createObjectURL(file);
    return blob_url;
}

export function readFile(url, callback) {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', url, true);
    xhr.responseType = 'text';
    xhr.onload = function (e) {
        if (this.status === 200) {
            var myBlobText = this.response;
            var lines_all_data = myBlobText.split('\n');

            callback(lines_all_data);
        } else {
            callback(false);
        }
    };
    xhr.send();
}

export function checkVTKFormat(lines_all_data) {
    return lines_all_data[2].trim(); // either "ASCII" or "BINARY"
}

export function loadVTKLabels(lines_data) {

    var insideScalars = false;
    var insideLookupTable = false;

    var regExpScalars = /^SCALARS /;
    var regExpLookUpTable = /^LOOKUP_TABLE /;
    var regExpColorScalars = /^COLOR_SCALARS /;
    var regExpField = /^FIELD /;

    var regExpNoNumber = /^[a-zA-Z]\S/; // lines that start with letters will be labels
    var regExpNumber = /^[\d.]+/; // lines that start with decimal numbers will be values of labels

    var labels = {}; // {{"name":string, "values":array of numbers}, ..., {"name":string, "values":array of numbers}}
    var position = 0;
    var gui_names = ["Solid Color"];

    var current_name, current_values;

    for (var i = 0; i < lines_data.length; i++) {
        var line = lines_data[i];

        // LINE THAT STARTS WITH A NUMBER, and INSIDE A "SCALARS" region
        if ((regExpNumber.exec(line) != null) && (insideScalars) && (!insideLookupTable)) {
            // we store all the values of the line
            var str = line.trim(); // string, e.g.: "1 2 3 4"
            var arr_str = str.split(" "); // array of strings, e.g.: ["1","2","3","4"]
            var arr_num = arr_str.map(Number); // array of numbers, e.g.: [1,2,3,4]

            current_values = current_values.concat(arr_num);
        }

        // LINE THAT STARTS WITH A LETTER --> new possible label
        else if (regExpNoNumber.exec(line) != null) {

            // Line that starts with "SCALARS"
            if (regExpScalars.exec(line) != null) {
                insideScalars = true;

                // we update "labels" and "gui_names" with the current information (if it is defined)
                if ((current_name !== undefined) && (current_values !== undefined)) {
                    updateFinalOutputs();
                }

                // and we initialize the new label
                var line_parts = line.split(" "); // ["SCALARS", "scalarsName", "dataType", "numComponents"]
                var part_of_name = line_parts[1];
                current_name = part_of_name[0].toUpperCase() + part_of_name.slice(1); // so that the name starts with an uppercase letter
                current_values = undefined;
            }

            // Line that starts with "LOOKUP_TABLE"
            else if (regExpLookUpTable.exec(line) != null) {

                // that means we are in a SCALARS region, so let's see where its values start:
                // it depends whether the LOOKUP_TABLE is defined (that is, it has "size" information) or not
                var lookup_table_parts = line.split(" ");

                if (lookup_table_parts.length === 2) {
                    // this is NOT the definition of the LOOKUP_TABLE, 
                    // so the following lines will be SCALAR values
                    insideLookupTable = false;
                    // therefore, we initialize "current_values" AS AN ARRAY
                    current_values = [];

                } else if (lookup_table_parts.length === 3) {
                    // this is the definition of the LOOKUP_TABLE, 
                    // so the following lines will NOT be SCALARS values
                    insideLookupTable = true;
                    // and the SCALARS have been already obtained (previously)
                    updateFinalOutputs();
                }
            }

            // Line that starts with "COLOR_SCALARS"
            else if (regExpColorScalars.exec(line) != null) {
                insideScalars = false;
                insideLookupTable = false;

                // this is already detected by VTKLoader.js, so we stop saving the SCALARS values.
                // we reset the obtained information about SCALARS, and wait until another label of interest is found
                current_name = undefined;
                current_values = undefined;
            }

            // Line that starts with "FIELD"
            else if (regExpField.exec(line) != null) {
                insideScalars = false;
                insideLookupTable = false;

                // we update "labels" and "gui_names" with the current information (if it is defined)
                if ((current_name !== undefined) && (current_values !== undefined)) {
                    updateFinalOutputs();
                }

                // we obtain the labels of the FIELD region, which finishes in the end of the file
                var field_data = lines_data.slice(i, lines_data.length);
                var [field_labels_names, field_labels] = loadFieldLabels(field_data);
                // we add the information in:
                // "gui_names"
                gui_names = gui_names.concat(field_labels_names.sort());
                // and "labels"
                var num_field_labels = Object.keys(field_labels).length;
                for (var j = position; j < num_field_labels; j++) {
                    current_name = field_labels[j].name;
                    current_values = field_labels[j].values;
                    labels[j] = { "name": current_name, "values": current_values };
                }
                // and we exit the "for" loop, because there are not more labels
                break;
            }

            // LINE THAT STARTS WITH ANOTHER LABEL
            else if ((regExpScalars.exec(line) === null) && (regExpLookUpTable.exec(line) == null) &&
                (regExpColorScalars.exec(line) === null) && (regExpField.exec(line) === null)) {

                // we have found another label that is not of our interest (neither SCALARS nor FIELD).
                insideScalars = false;
                insideLookupTable = false;

                // It could be the end of a current label of interest, so we update "labels" and "gui_names" 
                // with the current information (if it defined)
                if ((current_name !== undefined) && (current_values !== undefined)) {
                    updateFinalOutputs();
                }
            }
        }
    }

    function updateFinalOutputs() {
        // labels
        labels[position] = { "name": current_name, "values": current_values };
        position += 1;
        // gui_names
        gui_names = gui_names.concat(current_name);
    }

    if ((Object.keys(labels).length > 0) && (gui_names.length > 0)) {
        return [gui_names, labels];
    }
    else return [false, false];
}

export function loadFieldLabels(field_data) {
    // labels = 
    var labels = {}; // { {"name":string, "values":array of numbers}, ..., {"name":string, "values":array of numbers} }
    var names = [];

    var regNoNumber = /^[a-zA-Z]\S/; // lines that start with a letter will be labels of the FIELD region
    var regNumber = /^[\d.]+/; // lines that start with decimal numbers will be the values of these labels

    var first_label = true;
    var position = 0;

    // line #0 of field_data is "FIELD FieldData", so we start with line #1
    for (var num_line = 1; num_line < field_data.length; num_line++) {
        var line = field_data[num_line];

        // LINE THAT STARTS WITH A LETTER --> new label
        if (regNoNumber.exec(line) != null) {

            // if this is NOT the first label that we find
            if (!first_label) {
                // we update "names" and "labels" with the current information
                updateFinalOutputs()

            }
            // otherwise, we do not update anything
            else { first_label = false; }

            // and we initialize the information of the new label
            var current_values = [];
            var current_name = line.split(" ")[0]; // e.g.: line "RRT_Dia 1 23964 double" has name "RRT_Dia"
        }

        // LINE THAT STARTS WITH A NUMBER --> values of the new label
        else if ((regNumber.exec(line) != null) && (current_values)) {
            var str = line.trim(); // string, e.g.: "1 2 3 4"
            var arr_str = str.split(" "); // array of strings, e.g.: ["1","2","3","4"]
            var arr_num = arr_str.map(Number); // array of numbers, e.g.: [1,2,3,4]

            current_values = current_values.concat(arr_num);
        }

        // LAST LINE --> we update "names" and "labels" the current information
        if (num_line === field_data.length - 1) {
            // we have studied all lines, so we update the last label before exiting the for loop
            updateFinalOutputs()
        }
    }

    function updateFinalOutputs() {
        // labels
        labels[position] = { "name": current_name, "values": current_values };
        position += 1;
        // gui_names
        names.push(current_name);
    }

    return [names, labels];
}

export function obtainMaxMinValues(array) {
    var max, min;

    try {
        max = Math.max(...array);
        min = Math.min(...array);
    }
    catch (err) {
        // Case in which "array" is too large
        // we divide the array in two halves and obtain the max and min values of all of them instead
        var right_side = array.slice(); // so that "array" is not modified in the following line
        // we remove the first half from the whole array "right_side"
        var left_side = right_side.splice(0, Math.ceil(array.length / 2));
        // Now, "left_side" is the first half of "array", and "right_side" the second one

        // Obtention max number
        var first_max = Math.max(...left_side);
        var second_max = Math.max(...right_side);
        max = (Math.max(first_max, second_max));

        // Obtention min number
        var first_min = Math.min(...left_side);
        var second_min = Math.min(...right_side);
        min = (Math.min(first_min, second_min));
    }

    return [max, min]
}