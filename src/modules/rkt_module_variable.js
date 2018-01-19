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

export function isVariableString(variable){

    if(typeof(variable)==="string"){
        return true;
    }else{
        return false;
    }
}

export function isVariableNumeric(variable){

    if(typeof(variable)==="number"){
        return true;
    }else{
        return false;
    }
}

export function isVariableBoolean(variable){

    if(typeof(variable)==="boolean"){
        return true;
    }else{
        return false;
    }
}

export function getType(variable){
    return typeof(variable);
}