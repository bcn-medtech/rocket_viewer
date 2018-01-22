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
//Using global variables
const dicomParser = window.dicomParser;

export function isViewerLoadingAURLSource(url) {

    var viewerLoadingAURLResource = false;

    if (!isObjectEmpty(url)) {
        viewerLoadingAURLResource = true;
    }

    return viewerLoadingAURLResource;
}

export function loadLocalImage(blob, callback) {

    var reader = new FileReader();

    reader.onload = function (e) {

        var arrayBuffer = e.target.result;

        // Here we have the file data as an ArrayBuffer.  dicomParser requires as input a
        // Uint8Array so we create that here
        var byteArray = new Uint8Array(arrayBuffer);
        var dataSet = dicomParser.parseDicom(byteArray);

        callback(dataSet);

    };

    reader.readAsArrayBuffer(blob);

}

export function loadWADOImage(url, callback) {

    fetch(url).then(function (response) {

        return response.blob();

    }).then(function (blob) {

        callback(blob);

    });
}

export function exploreDicomImage(url, blob, callback) {

    var imageExplore = {};

    imageExplore["number_of_frames"] = 0;

    if (!isObjectEmpty(blob)) {

        loadLocalImage(blob[0], function (dataSet) {

            var numFrames = dataSet.intString('x00280008');

            if (numFrames) {
                imageExplore["number_of_frames"] = numFrames;
            }

            callback(imageExplore);

        });

    } else {

        loadWADOImage(url, function (blob) {

            loadLocalImage(blob, function (dataSet) {

                var numFrames = dataSet.intString('x00280008');

                if (numFrames) {
                    imageExplore["number_of_frames"] = numFrames;
                }

                callback(imageExplore);

            });

        });
    }
}
