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

import configviewers from './../config/config_viewers.json';
import { isObjectEmpty } from './rkt_module_object';

function getFileType(file) {

    return file.type;

}

//Get if the blob type is compatible with the viewer
export function blob_getResourceType(blob) {

    var type = false;
    var viewers = configviewers.viewers;
    var files = blob.dataTransfer.files;

    if (!isObjectEmpty(files)) {

        if (files.length === 1) {

            var fileType = getFileType(files[0]);
            var viewer;
            var i;
            var j;

            if (!isObjectEmpty(fileType)) {
                for (i = 0; i < viewers.length; i++) {

                    viewer = viewers[i];
                    var blob_types = viewer.blob_types;

                    for (j = 0; j < blob_types.length; j++) {

                        var blob_type = blob_types[j];

                        if (fileType.indexOf(blob_type) > -1) {
                            type = viewer.name;
                            break;
                        }
                    }
                    if (type) break;
                }
            } else {
                var fileName = files[0].name;

                for (i = 0; i < viewers.length; i++) {

                    viewer = viewers[i];
                    var extensions = viewer.extensions;

                    for (j = 0; j < extensions.length; j++) {

                        var extension = extensions[j];

                        if (fileName.indexOf(extension) > -1) {
                            type = viewer.name;
                            break;
                        }
                    }
                    if (type) break;
                }
            }
        }
    }

    return type;

}

export function blob_getNumberOfFiles(blob) {

    var files = blob.dataTransfer.files;
    var number_of_files = 0;

    if (!isObjectEmpty(files)) {

        number_of_files = files.length;

    }

    return number_of_files;
}