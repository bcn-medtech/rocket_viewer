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

import {url_getResourceType,url_EncodeQueryData} from './../../../../modules/rkt_module_url';


export function createURL(url){
    
    var newUrl =false;
    var type = url_getResourceType(url);
    
    if(type !== false){

        var data = {};
        data["type"]=type;
        data["url"]=url;

        var queryData=url_EncodeQueryData(data);
        newUrl = "/viewer"+queryData;

    }

    return newUrl;
}