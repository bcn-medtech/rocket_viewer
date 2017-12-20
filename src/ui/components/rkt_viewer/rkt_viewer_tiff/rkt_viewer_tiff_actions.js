import { isObjectEmpty } from './../../../../modules/rkt_module_object';
//import { blob_getNumberOfFiles } from './../../../modules/rkt_module_blob';

//Using global variables
const Tiff = window.Tiff;
const cornerstoneWebImageLoader = window.cornerstoneWebImageLoader;

function loadLocalImage(blob, display_image_function){ 
    
    var reader = new FileReader();

    reader.onload = function (e) {

        var tiff = new Tiff({ buffer: e.target.result });

        var canvasTiff = tiff.toCanvas();

        //var canvasTiffContext = canvasTiff.getContext("2d");

        var dataURL = canvasTiff.toDataURL();

        var image = new Image();

        image.src = dataURL;

        image.onload = function () {

            var url="www.google.es";

            var imageObject = cornerstoneWebImageLoader.createImage(image, url);

            display_image_function(imageObject);
        };
        image.onerror = function (err) {

        };
    };
    reader.readAsArrayBuffer(blob);
}

function loadWADOImage(url, display_image_function) {

    fetch(url).then(function (response) {

        return response.blob();

    }).then(function (myBlob) {

        loadLocalImage(myBlob,display_image_function);
    });
}

export function loadTiff(url, blob, display_image_function) {

    if(!isObjectEmpty(url)){

        loadWADOImage(url, display_image_function);

    }else if(!isObjectEmpty(blob)){

        loadLocalImage(blob[0], display_image_function);

    }else{

        alert("Problems with inputs");

    }

}