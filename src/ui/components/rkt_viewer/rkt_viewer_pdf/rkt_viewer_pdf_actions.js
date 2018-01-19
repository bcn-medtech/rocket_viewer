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

//modules
import {isObjectEmpty} from './../../../../modules/rkt_module_object';

export function loadLocalPDF(blob, callback) {

    var file = blob[0];

    callback(file);
}

export function loadWADOPDF(url, callback) {

    fetch(url).then(function (response) {

        return response.blob();

    }).then(function (blob) {

        callback(blob)
    });

}

export function loadPDF(url, blob,callback) {
    
    if(!isObjectEmpty(url)){

        loadWADOPDF(url, function(blob){
            callback(blob);
        });

    }else if(!isObjectEmpty(blob)){

        loadLocalPDF(blob, function(simpleBlob){
            callback(simpleBlob)
        });

    }else{

        alert("Problems with inputs");

    }

}