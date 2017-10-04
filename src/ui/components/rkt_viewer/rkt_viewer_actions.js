import { isObjectEmpty, isObjectAnArray } from './../../modules/rkt_module_object';

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




