//Using global variables
const cornerstone = window.cornerstone;
const cornerstoneWADOImageLoader = window.cornerstoneWADOImageLoader;

export function loadDicom(url, img_source, display_image_function) {

    if (img_source === "filesystem") {

        loadLocalImage(url, display_image_function);
    }
    else if (img_source === "wado") {
        loadWADOImage(url, display_image_function);
    }
}

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

export function cloneCanvas(sourceCanvas) {
    
    // input: "sourceCanvas" --> canvas to clone
    // output: "clonedCanvas" --> clone, it is NOT added to the document

    var clonedCanvas = document.createElement("canvas");
    var context = clonedCanvas.getContext('2d');

    clonedCanvas.width = sourceCanvas.width;
    clonedCanvas.height = sourceCanvas.height;
    context.drawImage(sourceCanvas, 0, 0);

    return clonedCanvas;

}