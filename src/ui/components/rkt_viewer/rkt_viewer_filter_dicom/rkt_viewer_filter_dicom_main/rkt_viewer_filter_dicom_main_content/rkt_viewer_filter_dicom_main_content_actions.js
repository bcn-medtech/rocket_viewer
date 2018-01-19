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

export function loadDicom(url, img_source, display_image_function) {

    if (img_source === "filesystem") {

        loadLocalImage(url, display_image_function);
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

export function getImageName(blob) {

    // input: "blob" --> blob of the image
    // output: "nameImage" --> name of the image, without the extension of the file

    var nameImage = blob[0].name.split(".")[0];
    return nameImage;

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