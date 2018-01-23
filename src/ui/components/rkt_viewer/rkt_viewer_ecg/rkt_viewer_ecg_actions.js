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

import { convert_csv_in_json } from './../../../../modules/rkt_module_csv';
import { getKeysOfAnObject } from './../../../../modules/rkt_module_object';
import { downloadFile } from './../../../../modules/rkt_module_download';

export function readSignalsFromBlob(blob, callback) {

    var reader = new FileReader();

    reader.onload = function (e) {

        var csv = e.currentTarget.result;
        var data = convert_csv_in_json(csv);
        var signals = data.data;
        var silnals_names = getKeysOfAnObject(signals[0]);

        var object = {
            signals: signals,
            signals_names: silnals_names
        }

        callback(object);

    }

    reader.readAsBinaryString(blob[0]);
}

export function readSignalsFromURL(url,callback) {


    downloadFile(url, function (result) {


        if (result) {

            var data = convert_csv_in_json(result);
            var signals = data.data;
            var silnals_names = getKeysOfAnObject(signals[0]);

            var object = {
                signals: signals,
                signals_names: silnals_names
            }

            callback(object);
        }

    });
}

