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

import { isObjectEmpty, isObjectAnArray } from './../../../modules/rkt_module_object';
const dicomParser = window.dicomParser;

export function isFileADicomFile(file, callback) {

    try {
        loadFile(file, function (dicomFileAsBuffer) {
            try {
                var dataSet = dicomParser.parseDicom(dicomFileAsBuffer);
                callback(true);
            } catch (exceptionParseDicom) {
                callback(false);
            }
        });

    } catch (exceptionFileReader) {
        callback(false);
    }

    // based on view-source:https://rawgit.com/chafey/dicomParser/master/examples/gettingStarted/index.html
    function loadFile(file, callback) {
        var reader = new FileReader();

        reader.onload = function (file) {
            var arrayBuffer = reader.result;
            var byteArray = new Uint8Array(arrayBuffer);
            callback(byteArray);
        }

        reader.readAsArrayBuffer(file);
    }
}



function getFileType(file) {
    return file.type;
}


export function typeOfViewerFromBlob(blob) {

    var viewerType;

    if (!isObjectEmpty(blob)) {

        if (blob.length == 1) {

            var fileType = getFileType(blob[0]);

            if (fileType == "image/tiff") {

                viewerType = "tiff";

            } else if (fileType == "application/dicom") {

                viewerType = "dicom";

            } else {

                viewerType = false;
            }

        } else if (blob.length > 1) {

            viewerType = false;

        } else {

            viewerType = false;

        }
    } else {
        viewerType = false;
    }

    return viewerType;
}




