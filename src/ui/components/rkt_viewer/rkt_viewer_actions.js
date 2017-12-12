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




