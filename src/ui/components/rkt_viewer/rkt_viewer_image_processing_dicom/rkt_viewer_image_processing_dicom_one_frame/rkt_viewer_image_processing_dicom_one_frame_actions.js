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

//Using global variables
const cornerstone = window.cornerstone;
//const cornerstoneTools = window.cornerstoneTools;
const cornerstoneWADOImageLoader = window.cornerstoneWADOImageLoader;
const cornerstoneWebImageLoader = window.cornerstoneWebImageLoader;
const pixpipe = window.pixpipe;

function loadLocalImage(url, display_image_function) {

    var imageId = cornerstoneWADOImageLoader.fileManager.add(url[0]);

    cornerstone.loadImage(imageId).then(
        display_image_function,
        function (err) {
            alert(err);
        });
}

function loadWADOImage(url, display_image_function) {

    var imageId = "wadouri:" + url + "?frame=0";

    try {

        cornerstone.loadAndCacheImage(imageId).then(
            display_image_function,
            function (err) {

                alert(err);

            });
    }
    catch (err) {
        alert(err);
    }
}

export function loadDicom(url, img_source, display_image_function) {

    if (img_source === "filesystem") {
        loadLocalImage(url, display_image_function);
    }
    else if (img_source === "wado") {
        loadWADOImage(url, display_image_function);
    }
}

export function getImageMetadata(image) {

    var imageMetadata = {};
    var numFrames;
    var manufacturer;

    if (image.data !== undefined) {
        numFrames = image.data.intString('x00280008');
        manufacturer = image.data.string('x00080070');

        if (numFrames !== undefined) {

            imageMetadata["number_of_frames"] = numFrames;

        } else {

            imageMetadata["number_of_frames"] = 0;
        }

        imageMetadata["manufacturer"] = manufacturer;

        return imageMetadata;
    } else {
        return false;
    }



}

export function cropImageFromCanvas(element, display_image_function) {
    const canvas = document.getElementsByTagName("canvas")[0];
   
    // convert canvas content to data-uri.
    var dataURL = canvas.toDataURL();

    dicom2Png(dataURL, function (png_blob) {

        loadAndCropLocalImage(png_blob, function (croppedImage) {
            display_image_function(croppedImage);
        });

    });
}

function dicom2Png(dataURL, callback) {

    // Create an "image/png" blob from url "dataURL"
    // See: https://stackoverflow.com/questions/12168909/blob-from-dataurls
    var byteString = atob(dataURL.split(",")[1]);
    var ab = new ArrayBuffer(byteString.length);
    var ia = new Uint8Array(ab);
    for (var i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
    }

    var blob = new Blob([ab], { type: 'image/png' }); // --> "image/png" blob
    callback(blob);

};


function loadAndCropLocalImage(blob, callback) {

    // create a filter to write the image into a canvas
    // 1st: create a new <div> "pixpipeDiv"
    var pixpipeDiv = document.createElement("div");
    pixpipeDiv.id = "pixpipeDiv";
    // 2nd: append it to the parent Node
    var parentNode = document.getElementsByClassName("grid-block rkt-dicom-viewer-one-frame")[0];
    parentNode.appendChild(pixpipeDiv);
    // 3rd: create the pixpipe filter
    var imageToCanvasFilter = new pixpipe.CanvasImageWriter();
    imageToCanvasFilter.setMetadata("parentDivID", "pixpipeDiv")

    // The filter to read image from URL
    var file2ImgFilter = new pixpipe.FileImageReader();

    // the image is loaded ...
    // set the input of the filter ("file")
    file2ImgFilter.addInput(blob)
    // Ask to fetch the image from URL
    file2ImgFilter.update();

    // then, cropping
    // here, this = file2ImgFilter
    file2ImgFilter.on("ready", function () {
        var inputImage = this.getOutput();
       
        var croppedImage = cropImage(inputImage);
        
        // we write the image in a canvas thanks to the filter "imageToCanvasWriter"
        imageToCanvasFilter.addInput(croppedImage);
        imageToCanvasFilter.update();
        // we convert canvas content to data-uri
        var pixpipeCanvas = document.getElementById("pixpipeDiv").childNodes[0];
        var canvasURL = pixpipeCanvas.toDataURL();
        // and we remove "pixpipeDiv" because we do not want to display the image with pixpipe
        document.getElementById("pixpipeDiv").remove();

        // we create a cornerstone image with the URL of the pixpipe canvas
        createCornerstoneImage(canvasURL, function (cornerstoneImage) {
            callback(cornerstoneImage);
        });
        
    });
}

function cropImage(inputImage) {

    var cropFilter = new pixpipe.CropImageFilter();
    cropFilter.addInput(inputImage);
    cropFilter.setMetadata("x", inputImage.getWidth() * 1 / 4);
    cropFilter.setMetadata("y", inputImage.getHeight() * 1 / 4);
    cropFilter.setMetadata("w", inputImage.getWidth() * 1 / 2);
    cropFilter.setMetadata("h", inputImage.getHeight() * 1 / 2);
    cropFilter.update();

    var outputImage = cropFilter.getOutput();

    return outputImage;
}

function createCornerstoneImage(canvasURL, callback) {
    var imageId = "cropped-image";
    var image = new Image();
    image.src = canvasURL;
    
    image.onload = function () {

        var imageObject = cornerstoneWebImageLoader.createImage(image, imageId);
        callback(imageObject);

    };
    image.onerror = function (err) {

        alert("Problems loading the image");
    };
}