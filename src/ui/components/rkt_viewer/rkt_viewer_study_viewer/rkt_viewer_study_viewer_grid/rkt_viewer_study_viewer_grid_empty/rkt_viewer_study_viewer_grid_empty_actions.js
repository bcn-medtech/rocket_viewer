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

export function array2Object(array) {

    // input: array of N elements of any kind => [element1, element2, ..., elementN]
    // output: object = {0: element1, 1: element2, ..., length: N}

    var object = {};

    for (var i = 0; i < array.length; i++) {
        var key = i;
        var value = array[i];
        object[key] = value;
    }

    object["length"] = array.length;
    return object;
}

export function orderObjectContent(mainObject, property) {
    // inputs: 
    // · mainObject: object (of objects) to sort. Its keys must be **strings**.
    // · property: property (key) to sort the mainObject by. 
    // output:
    // · sortedMainObject: object sorted by the property "property", and in alphabetical and/or ascending order

    // we sort the content in alphabetical and/or ascending order
    var contentToSort = [];
    for (var i = 0; i < mainObject.length; i++) {
        contentToSort[i] = mainObject[i][property];
    }
    var sortedContent = contentToSort.sort();

    // we sort the mainObject according to sortedContent
    var sortedMainObject = [];
    for (var j = 0; j < sortedContent.length; j++) {

        var currentSortedValue = sortedContent[j];

        // we look for the object in "mainObject" that has value "currentSortedValue" in the "property" 
        for (var k = 0; k < mainObject.length; k++) {

            var currentObject = mainObject[k];

            if (currentObject[property] === currentSortedValue) {
                sortedMainObject.push(currentObject);
                break;
            }
        }
    }
    
    // now we have an array of objects, and we want an object of objects
    sortedMainObject = array2Object(sortedMainObject);

    return sortedMainObject;
}



