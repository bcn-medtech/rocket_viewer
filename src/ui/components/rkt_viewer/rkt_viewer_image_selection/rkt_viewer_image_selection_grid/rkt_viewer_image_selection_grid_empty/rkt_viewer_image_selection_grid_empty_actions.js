
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



