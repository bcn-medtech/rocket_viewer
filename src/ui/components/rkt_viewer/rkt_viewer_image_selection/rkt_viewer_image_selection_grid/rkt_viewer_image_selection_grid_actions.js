export function computeStats(cornerstoneDataArray, callback) {
    var manufacturersDict = []
    for (var i in cornerstoneDataArray) {
        if (cornerstoneDataArray[i] != null) {
            var man = cornerstoneDataArray[i].string('x00080070');
            if (manufacturersDict[man]) {
                manufacturersDict[man] = manufacturersDict[man] + 1;
            } else {
                manufacturersDict[man] = 1;
            }
        }
    }

    callback(manufacturersDict);
}