
import { isObjectEmpty } from './../../../../../../../modules/rkt_module_object';

//Using global variables
const cornerstone = window.cornerstone;
const cornerstoneWADOImageLoader = window.cornerstoneWADOImageLoader;

export function isViewerLoadingAURLSource(img_url) {

    var viewerLoadingAURLResource = false;

    if (!isObjectEmpty(img_url)) {
        viewerLoadingAURLResource = true;
    }

    return viewerLoadingAURLResource;
}

export function getImageName(files, url) {

    var name;

    if (isViewerLoadingAURLSource(url)) {
        name = url.substring(url.lastIndexOf('/') + 1);

        if (url.includes("dl.dropboxusercontent") &&
            (name.includes("?dl=0"))) {
            name = name.replace("?dl=0", "");
        }

    } else {
        name = files[0].name;
    }

    return name;
}


// DICOM
export function loadDicom(url, img_source, on_image_loaded_function, on_error_loading_function) {

    console.log("loadDicom in actions");
    if (img_source === "filesystem") {
        loadLocalImage(url, on_image_loaded_function, on_error_loading_function);
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

export function getDicomNumFrames(image) {

    var numFrames = image.data.intString('x00280008');

    return numFrames;
}

// export function getImageMetadata(image) {

//     var imageMetadata = {};

//     var numFrames = image.data.intString('x00280008');
//     var manufacturer = image.data.string('x00080070');
//     var pixelSpacing = image.data.intString('x00280030');

//     if (numFrames !== undefined) {

//         imageMetadata["number_of_frames"] = numFrames;

//     } else {

//         imageMetadata["number_of_frames"] = 0;
//     }

//     imageMetadata["manufacturer"] = manufacturer;
//     imageMetadata["pixel_spacing"] = pixelSpacing;

//     return imageMetadata;
// }