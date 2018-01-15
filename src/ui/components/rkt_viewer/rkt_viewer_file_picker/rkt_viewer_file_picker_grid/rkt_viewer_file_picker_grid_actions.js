export function computeStats(instances, callback) {
    var manufacturerDict = []
    for (var i in instances) {
        if (instances[i] != null) {
            var man = instances[i].string('x00080070');
            if (manufacturerDict[man]) {
                manufacturerDict[man] = manufacturerDict[man] + 1;
            } else {
                manufacturerDict[man] = 1;
            }
        }
    }

    callback(manufacturerDict);
}