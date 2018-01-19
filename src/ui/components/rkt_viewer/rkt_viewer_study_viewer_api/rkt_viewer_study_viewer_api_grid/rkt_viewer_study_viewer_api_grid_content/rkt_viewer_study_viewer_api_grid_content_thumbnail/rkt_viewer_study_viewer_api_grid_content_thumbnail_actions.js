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

import { isObjectEmpty } from './../../../../../../../modules/rkt_module_object';

// libraries
// import NRRDLoader from './../../../../../../../libraries/NRRDLoader';
// import PLYLoader from './../../../../../../../libraries/PLYLoader';
// import VTKLoader from './../../../../../../../libraries/VTKLoader';

// var THREE = require('three');
// var TrackballControls = require('three-trackballcontrols');

//modules
import { url_getParameterByName } from './../../../../../../../modules/rkt_module_url';

//Using global variables
const cornerstone = window.cornerstone;
const cornerstoneWADOImageLoader = window.cornerstoneWADOImageLoader;
const cornerstoneWebImageLoader = window.cornerstoneWebImageLoader;
const dicomParser = window.dicomParser;

export function isViewerLoadingAURLSource(img_url) {

    var viewerLoadingAURLResource = false;

    if (!isObjectEmpty(img_url)) {
        viewerLoadingAURLResource = true;
    }

    return viewerLoadingAURLResource;
}

export function getViewerType(files, url, callback) {

    var viewerType;

    if (isViewerLoadingAURLSource(url)) {
        // TO DO? harcoded

        callback("dicom");

    } else {
        var fileType = files[0].type;


        if (!isObjectEmpty(fileType)) {

            switch (fileType) {
                case "application/dicom":
                    viewerType = "dicom";
                    break;

                case "image/tiff":
                    viewerType = "tiff";
                    break;

                case "application/pdf":
                    viewerType = "pdf";
                    break;

                default:
                    break;
            }

            callback(viewerType);

        } else {

            var nameFile = files[0].name;

            if (nameFile.includes(".nrrd")) callback("nrrd");
            else if (nameFile.includes(".ply")) callback("ply");
            else if (nameFile.includes(".vtk")) callback("vtk");
            else {
                isFileADicomFile(files[0], function (fileisDicom) {

                    if (fileisDicom) {
                        callback("dicom");
                    } else {
                        callback(undefined);
                    }

                })
            }
        }
    }
}

export function loadImage(viewerType, files, url, on_image_loaded_function, on_error_loading_function) {

    var img_url;

    switch (viewerType) {

        case "dicom":
            var img_source;

            if (isViewerLoadingAURLSource(url)) {
                img_url = url;
                img_source = "wado";
            }

            else {
                img_url = files;
                img_source = "filesystem";
            }

            loadDicom(img_url, img_source, on_image_loaded_function, on_error_loading_function);
            break;

        case "nrrd":
        case "ply":
        case "vtk":

            var dataURL = default_thumbnails_info[viewerType].localDataURL;

            createCornerstoneImage(dataURL, function (cornerstoneImage) {

                if (cornerstoneImage) {
                    on_image_loaded_function(cornerstoneImage);

                } else {
                    on_error_loading_function();
                }
            });

            break;

        default:
            break;
    }
}

export function getImageName(files, url) {

    var name;

    if (isViewerLoadingAURLSource(url)) {
        
        name = url.substring(url.lastIndexOf('/') + 1);

        if (url.includes("dl.dropboxusercontent") &&
            (name.includes("?dl=0"))) {
            name = name.replace("?dl=0", "");
        }else if(url.includes("file?")){
            name = url_getParameterByName("name_file", url);
        }

    } else {
        name = files[0].name;
    }

    return name;
}


////////////////////////// DICOM
function isFileADicomFile(file, callback) {
    try {
        loadFile(file, function (dicomFileAsBuffer) {
            try {
                var dataSet = dicomParser.parseDicom(dicomFileAsBuffer);
                callback(true);
            }
            catch (exceptionParseDicom) {
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

export function loadDicom(url, img_source, on_image_loaded_function, on_error_loading_function) {

    if (img_source === "filesystem") {
        loadLocalImage(url, on_image_loaded_function, on_error_loading_function);;
    }
    else if (img_source === "wado") {
        loadWADOImage(url, on_image_loaded_function, on_error_loading_function);
    }
}

function loadLocalImage(url, on_image_loaded_function, on_error_loading_function) {
    
    var imageId = cornerstoneWADOImageLoader.fileManager.add(url[0]);
    cornerstone.loadImage(imageId).then(
        on_image_loaded_function,
        function (err) {
            on_error_loading_function();
        });

        cornerstoneWADOImageLoader.fileManager.purge();
}

function loadWADOImage(url, on_image_loaded_function, on_error_loading_function) {

    var imageId = "wadouri:" + url + "?frame=0";

    try {
        cornerstone.loadAndCacheImage(imageId).then(
            on_image_loaded_function,
            function (err) {
                on_error_loading_function();

            });
    }
    catch (err) {
        alert(err);
    }
}

function createCornerstoneImage(dataURL, callback) {
    var imageId = "3d-model";
    var image = new Image();
    image.src = dataURL;

    image.onload = function () {

        var imageObject = cornerstoneWebImageLoader.createImage(image, imageId);
        callback(imageObject);

    };
    image.onerror = function (err) {

        alert("Problems loading the image");
        callback(false);
    };
}

var default_thumbnails_info = [];
default_thumbnails_info["nrrd"] = {
    "serverDataURL": "https://www.dl.dropboxusercontent.com/s/8rdmwwzjk4tlbjw/thumbnail_nrrd.jpg?dl=0",
    "localDataURL": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAKoAAAB+CAYAAAC02Yq7AAANYUlEQVR4Xu2cd+xOVxjHH7VXzRK1d4zWqD2KSIVQI8QISoOSULUqqL0qRqxaCRLUH0bsEWJri1bM2qNIVWtVVItazfcm5+b+7u9933vPu+7vNN/nH8F573nO93zuGc95zk0nIm+ERgXSuALpCGoa7yG6ZylAUAmCEQoQVCO6iU4SVDJghAIE1YhuopMElQwYoQBBNaKb6CRBJQNGKEBQjegmOklQyYARChBUI7qJThJUMmCEAgTViG6ikwSVDBihAEE1opvoJEElA0YoQFCN6CY6SVDJgBEKEFQjuolOElQyYIQCBNWIbqKTBJUMGKEAQTWim+gkQSUDRihAUI3oJjpJUMmAEQoQVCO6iU4SVDJghAIE1YhuopMElQwYoQBBNaKb6CRBJQNGKEBQjegmOklQyYARChBUI7qJThJUMmCEAgTViG6ikwSVDBihAEE1opvoJEElA0YoQFCN6CY6SVDJgBEKEFQjuolOElQyYIQCBNWIbqKTBJUMGKEAQTWim+gkQSUDRihAUI3oJjpJUMmAEQoQVCO6iU4SVDJghAIE1YhuopNpBtRGjRrJgQMHUvXI+PHjZcKECVo99cUXX8icOXPs3zx69Ejy5MkT9hlt2rSRTZs2edbx7Nkz+fPPP+XSpUty+PBh2b59u/z888/y999/e/7WXWD27NkyaNAgefPmjaRLh24IbU+fPpX79+/L+fPnZf/+/bJ79265cOGCwBddO3nypFStWjXVz+CDsufPn1vt+eOPP+T69ety6tQpOXr0qFy9elVu3bol8CcIS/Ogvn79WooVKya3b9/2rU+iQA3lwKtXr+TTTz+VNWvWyL///uvbRwVquB9EAhggtW3bVvbu3WuB7tfCger+fbi68XIsWLBAvvnmG7lx44bfauNSLs2DilZ+/fXXMmrUKN8NjgVU1fGRRjk44u7MPXv2SPPmzQXg+jEnqF6jarjnrVq1Snr06OEb1kgjqld7lQ/K1y1btkiXLl3kn3/+8dPcmMsYASpaWaJECbl586avBscCqqogVMflzZtXqlWrJkOGDJEWLVqkmrLnz58vAwcO9OWje0TFFItnu61AgQJSr149GTlypNSqVSvV//fr10+WLFniq043qFgeDR48OMVv0e63335bSpUqJfXr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"
}
default_thumbnails_info["ply"] = {
    "serverDataURL": "https://www.dl.dropboxusercontent.com/s/0raq9zb4xvs7tsg/thumbnail_ply.jpg?dl=0",
    "localDataURL": "data:image/png;base64,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"
}
default_thumbnails_info["vtk"] = {
    "serverDataURL": "https://www.dl.dropboxusercontent.com/s/8rdmwwzjk4tlbjw/thumbnail_nrrd.jpg?dl=0",
    "localDataURL": "data:image/png;base64,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"
}