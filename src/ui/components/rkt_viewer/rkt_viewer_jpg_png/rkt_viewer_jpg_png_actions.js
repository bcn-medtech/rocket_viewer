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

import { isObjectEmpty } from './../../../../modules/rkt_module_object';
//import { blob_getNumberOfFiles } from './../../../modules/rkt_module_blob';

//Using global variables
const cornerstoneWebImageLoader = window.cornerstoneWebImageLoader;

function loadLocalImage(blob, display_image_function) {

    var objectURL = URL.createObjectURL(blob);

    var image = new Image();

    image.src = objectURL;

    image.onload = function () {

        var url = "www.google.es";

        var imageObject = cornerstoneWebImageLoader.createImage(image, url);

        display_image_function(imageObject);

    };
    image.onerror = function (err) {
        alert("Imposible to load image");
    };

}

function loadWADOImage(url, display_image_function) {

    fetch(url).then(function (response) {

        return response.blob();

    }).then(function (myBlob) {

        loadLocalImage(myBlob, display_image_function);
    });
}

export function loadJPGPNG(url, blob, display_image_function) {

    if (!isObjectEmpty(url)) {

        loadWADOImage(url, display_image_function);

    } else if (!isObjectEmpty(blob)) {

        loadLocalImage(blob[0], display_image_function);

    } else {

        alert("Problems with inputs");

    }
}