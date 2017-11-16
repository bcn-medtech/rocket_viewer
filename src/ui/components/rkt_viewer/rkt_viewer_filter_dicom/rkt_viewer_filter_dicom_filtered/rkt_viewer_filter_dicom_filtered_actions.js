//Using global variables
const pixpipe = window.pixpipe;
const cornerstoneWebImageLoader = window.cornerstoneWebImageLoader;

export function cropImageFromCanvas(canvas, inputs, parentNode, display_image_function) {

    // we convert canvas content to data-uri.
    var dataURL = canvas.toDataURL();
    
    if (dataURL.includes("image/dicom")) {

        dicom2Png(dataURL, function (png_blob) {
            loadAndCropLocalImage(png_blob, inputs, parentNode, function (croppedImage) {
                display_image_function(croppedImage);
            });

        });

    } else { // else if (dataURL.includes("image/png"))?

        canvas.toBlob(function (png_blob) {
            loadAndCropLocalImage(png_blob, inputs, parentNode, function (croppedImage) {
                display_image_function(croppedImage);
            });
        });

    }
}

function dicom2Png(dataURL, callback) {

    // Create an "image/png" blob from url "dataURL"
    var byteString = atob(dataURL.split(",")[1]);
    var ab = new ArrayBuffer(byteString.length);
    var ia = new Uint8Array(ab);
    for (var i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
    }

    var blob = new Blob([ab], { type: 'image/png' }); // --> "image/png" blob
    callback(blob);

};


function loadAndCropLocalImage(blob, coordinates, parentNode, callback) {

    // create a filter to write the image into a canvas
    // 1st: create a new <div> with id "pixpipeDiv"
    var pixpipeDiv = document.createElement("div");
    pixpipeDiv.id = "pixpipeDiv";
    // 2nd: append it to the parent Node
    parentNode.appendChild(pixpipeDiv);
    // 3rd: create the pixpipe filter
    var imageToCanvasFilter = new pixpipe.CanvasImageWriter();
    imageToCanvasFilter.setMetadata("parentDivID", "pixpipeDiv")

    // The filter to read image from blob
    var file2ImgFilter = new pixpipe.FileImageReader();

    // the image is loaded ...
    // set the input of the filter ("blob")
    file2ImgFilter.addInput(blob)
    // Ask to fetch the image from URL
    file2ImgFilter.update();

    // then, cropping
    // here, this = file2ImgFilter
    file2ImgFilter.on("ready", function () {
        var inputImage = this.getOutput();

        var croppedImage = cropImage(inputImage, coordinates);

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

function cropImage(inputImage, coordinates) {

    var cropFilter = new pixpipe.CropImageFilter();

    var top_left_x = coordinates.top_left_x;
    var top_left_y = coordinates.top_left_y;
    var outputWidth = coordinates.width;
    var outputHeight = coordinates.height;

    cropFilter.addInput(inputImage);
    cropFilter.setMetadata("x", top_left_x);
    cropFilter.setMetadata("y", top_left_y);
    cropFilter.setMetadata("w", outputWidth);
    cropFilter.setMetadata("h", outputHeight - 20); // the "-20" is just a TEST
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