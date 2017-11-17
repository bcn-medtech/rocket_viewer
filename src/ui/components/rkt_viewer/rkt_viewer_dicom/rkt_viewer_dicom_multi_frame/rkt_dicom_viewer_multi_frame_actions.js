
//Using global variables
const cornerstoneWADOImageLoader = window.cornerstoneWADOImageLoader;

function prepareLoadLocalImage(image, callback) {
    
    var numFrames = image.data.intString('x00280008');

    var viewerIdImage = image.imageId;
    
    var imageIds = [];
    for (var i = 0; i < numFrames; i++) {
        imageIds.push(viewerIdImage + '?frame=' + i);
    }

    var stack = {
        currentImageIdIndex: 0,
        imageIds: imageIds
    };

    var state = {
        numFrames: numFrames,
        stack: stack
    }

    callback(state);

}

function prepareLoadWADOImage(url, callback) {

    cornerstoneWADOImageLoader.dataSetCacheManager.load(url, cornerstoneWADOImageLoader.internal.xhrRequest).then(function (dataSet) {
        // dataset is now loaded, get the # of frames so we can build the array of imageIds
        var numFrames = dataSet.intString('x00280008');

        if (!numFrames) {
            alert('Missing element NumberOfFrames (0028,0008)');
            return;
        }

        var imageIds = [];

        for (var i = 1; i < numFrames; i++) {
            var imageId = "wadouri:" + url + "?frame=" + i;
            imageIds.push(imageId);
        }

        var stack = {
            currentImageIdIndex: 0,
            imageIds: imageIds
        };

        var state = {
            numFrames: numFrames,
            stack: stack
        }

        callback(state);

    });
}

export function prepareLoadDicom(image, img_source, callback) {

    if (img_source === "filesystem") {

        prepareLoadLocalImage(image, function (loadLocalImagePrepared) {
            callback(loadLocalImagePrepared);
        });

    } else if (img_source === "wado") {

        var url = image.sharedCacheKey;

        prepareLoadWADOImage(url, function (loadWadoImagePrepared) {

            callback(loadWadoImagePrepared);
        });
    }
}