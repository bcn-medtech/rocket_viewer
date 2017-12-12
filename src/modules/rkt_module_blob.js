import configviewers from './../config/config_viewers.json';
import { isObjectEmpty } from './rkt_module_object';

function getFileType(file) {

    return file.type;

}

//Get if the blob type is compatible with the viewer
export function blob_getResourceType(blob) {

    var type = false;
    var viewers = configviewers.viewers;
    var files = blob.dataTransfer.files;

    if (!isObjectEmpty(files)) {

        if (files.length === 1) {

            var fileType = getFileType(files[0]);
            var viewer;
            var i;
            var j;

            if (!isObjectEmpty(fileType)) {
                for (i = 0; i < viewers.length; i++) {

                    viewer = viewers[i];
                    var blob_types = viewer.blob_types;

                    for (j = 0; j < blob_types.length; j++) {

                        var blob_type = blob_types[j];

                        if (fileType.indexOf(blob_type) > -1) {
                            type = viewer.name;
                            break;
                        }
                    }
                    if (type) break;
                }
            } else {
                var fileName = files[0].name;

                for (i = 0; i < viewers.length; i++) {

                    viewer = viewers[i];
                    var extensions = viewer.extensions;

                    for (j = 0; j < extensions.length; j++) {

                        var extension = extensions[j];

                        if (fileName.indexOf(extension) > -1) {
                            type = viewer.name;
                            break;
                        }
                    }
                    if (type) break;
                }
            }
        }
    }

    return type;

}

export function blob_getNumberOfFiles(blob) {

    var files = blob.dataTransfer.files;
    var number_of_files = 0;

    if (!isObjectEmpty(files)) {

        number_of_files = files.length;

    }

    return number_of_files;
}