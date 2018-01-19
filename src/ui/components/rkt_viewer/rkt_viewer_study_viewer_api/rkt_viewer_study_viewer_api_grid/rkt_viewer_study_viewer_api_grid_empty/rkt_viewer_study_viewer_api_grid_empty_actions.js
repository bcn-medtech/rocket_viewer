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

import { isObjectEmpty } from "../../../../../../modules/rkt_module_object";

export function array2Object(array) {

    // input: array of N elements of any kind => [element1, element2, ..., elementN]
    // output: object = {0: element1, 1: element2, ..., length: N}

    var object = {};

    for (var i = 0; i < array.length; i++) {
        var key = i;
        var value = array[i];
        object[key] = value;
    }

    object["length"] = array.length;
    return object;
}

export function orderObjectContent(mainObject, property) {
    // inputs: 
    // · mainObject: object (of objects) to sort. Its keys must be **strings**.
    // · property: property (key) to sort the mainObject by. 
    // output:
    // · sortedMainObject: object sorted by the property "property", and in alphabetical and/or ascending order

    // we sort the content in alphabetical and/or ascending order
    var contentToSort = [];
    for (var i = 0; i < mainObject.length; i++) {
        contentToSort[i] = mainObject[i][property];
    }
    var sortedContent = contentToSort.sort();

    // we sort the mainObject according to sortedContent
    var sortedMainObject = [];
    for (var j = 0; j < sortedContent.length; j++) {

        var currentSortedValue = sortedContent[j];

        // we look for the object in "mainObject" that has value "currentSortedValue" in the "property" 
        for (var k = 0; k < mainObject.length; k++) {

            var currentObject = mainObject[k];

            if (currentObject[property] === currentSortedValue) {
                sortedMainObject.push(currentObject);
                break;
            }
        }
    }

    // now we have an array of objects, and we want an object of objects
    sortedMainObject = array2Object(sortedMainObject);

    return sortedMainObject;
}

function createURLSFromFilesNamesFromApi(url_api,patient_id,modality_id,followup_id,array_files){

    var arrayURL = []; 

    for(var i=0;i<array_files.length;i++){
        
        var url = url_api+"/patient/modality/followup/file?name_file="+array_files[i]+"&followup_id="+followup_id+"&patient_id="+patient_id+"&modality_id="+modality_id;
        
        /*var object = {
            "url":url,
            "name":array_files[i],
            "patient_id":patient_id,
            "modality_id":modality_id,
            "followup_id":followup_id
        }*/

        arrayURL.push(url);
    }

    return arrayURL;

}

export function getFilesNamesFromApi(url_api, patient_id, modality_id, followup_id, callback) {

    console.log(url_api);
    console.log(patient_id);
    console.log(modality_id);
    console.log(followup_id);

    var data = "patient_id="+patient_id+"&modality_id="+modality_id+"&followup_id="+followup_id;

    var xhr = new XMLHttpRequest();

    xhr.addEventListener("readystatechange", function () {
        if (this.readyState === 4) {
            if(!isObjectEmpty(this.responseText)){

                var array_of_files = JSON.parse(this.responseText);
                var array_of_urls = createURLSFromFilesNamesFromApi(url_api,patient_id,modality_id,followup_id,array_of_files);
                callback(array_of_urls);
            }else{
                callback(false);
            }
        }
    });

    xhr.open("POST", url_api + "/patient/modality/followup/files");
    xhr.setRequestHeader("patient_id", "030238");
    xhr.setRequestHeader("content-type", "application/x-www-form-urlencoded");
    xhr.setRequestHeader("cache-control", "no-cache");
    xhr.setRequestHeader("postman-token", "b46bd042-0071-fdcc-9c6c-2166a8356e4a");

    xhr.send(data);
}



