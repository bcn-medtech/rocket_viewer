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

function fakeReplace(str, substr, newstr) {
    return str.split(substr).join(newstr);
}

export function url_getResourceType(url) {

    var type = false;
    var viewers = configviewers.viewers;

    for(var i=0;i<viewers.length;i++){
        
        var viewer = viewers[i];
        var extensions = viewer.extensions;

        for(var j=0;j<extensions.length;j++){
            
            var extension = extensions[j];

            if (url.indexOf(extension) > -1) {
                type = viewer.name;
                break;
            }
        }
    }
    
    return type;
}

export function url_getParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}

export function url_EncodeQueryData(data) {

    let ret = [];
    var queryString;

    for (let d in data) {
        ret.push(encodeURIComponent(d) + '=' + encodeURIComponent(data[d]));
    }

    queryString = ret.join('&');

    queryString = fakeReplace(queryString, ".", "%2E");
    queryString = "?"+queryString;

    return queryString;
}