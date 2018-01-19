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