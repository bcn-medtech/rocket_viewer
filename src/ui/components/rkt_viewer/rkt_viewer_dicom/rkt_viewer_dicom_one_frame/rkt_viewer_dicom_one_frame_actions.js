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
const cornerstoneWADOImageLoader = window.cornerstoneWADOImageLoader;

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

    var numFrames = image.data.intString('x00280008');
    var manufacturer = image.data.string('x00080070');
    var pixelSpacing = image.data.intString('x00280030');
    
    if (numFrames !== undefined) {

        imageMetadata["number_of_frames"] = numFrames;

    } else {

        imageMetadata["number_of_frames"] = 0;
    }

    imageMetadata["manufacturer"] = manufacturer;
    imageMetadata["pixel_spacing"] = pixelSpacing;

    return imageMetadata;
}