
export function array2Object(array) {
    
    // input: array of N elements => [element1, element2, ..., elementN]
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

