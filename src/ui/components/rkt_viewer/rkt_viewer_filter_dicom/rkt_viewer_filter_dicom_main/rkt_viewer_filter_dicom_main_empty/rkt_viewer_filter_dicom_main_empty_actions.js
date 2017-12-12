const dicomParser = window.dicomParser;

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

export function checkFileIsDicom(file, callback) {
    if (file.type === "application/dicom") {
        callback(true);

    } else {
        isFileADicomFile(file, function (fileisDicom) {

            if (fileisDicom) {
                callback(true);
            } else {
                callback(false);
            }

        })
    }
}

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
