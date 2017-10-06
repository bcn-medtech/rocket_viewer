import { isObjectEmpty } from './../../../../modules/rkt_module_object';
//Using global variables
const dicomParser = window.dicomParser;

export function isViewerLoadingAURLSource(url) {

    var viewerLoadingAURLResource = false;

    if (!isObjectEmpty(url)) {
        viewerLoadingAURLResource = true;
    }

    return viewerLoadingAURLResource;
}

export function loadLocalImage(blob, callback) {

    var reader = new FileReader();

    reader.onload = function (e) {

        var arrayBuffer = e.target.result;

        // Here we have the file data as an ArrayBuffer.  dicomParser requires as input a
        // Uint8Array so we create that here
        var byteArray = new Uint8Array(arrayBuffer);
        var dataSet = dicomParser.parseDicom(byteArray);

        callback(dataSet);

    };

    reader.readAsArrayBuffer(blob);

}

export function loadWADOImage(url, callback) {

    fetch(url).then(function (response) {

        return response.blob();

    }).then(function (blob) {

        callback(blob);

    });
}

export function exploreDicomImage(url, blob, callback) {

    var imageExplore = {};

    imageExplore["number_of_frames"] = 0;

    if (!isObjectEmpty(blob)) {

        loadLocalImage(blob[0], function (dataSet) {

            var numFrames = dataSet.intString('x00280008');

            if (numFrames) {
                imageExplore["number_of_frames"] = numFrames;
            }

            callback(imageExplore);

        });

    } else {

        loadWADOImage(url, function (blob) {

            loadLocalImage(blob, function (dataSet) {

                var numFrames = dataSet.intString('x00280008');

                if (numFrames) {
                    imageExplore["number_of_frames"] = numFrames;
                }

                callback(imageExplore);

            });

        });
    }
}
