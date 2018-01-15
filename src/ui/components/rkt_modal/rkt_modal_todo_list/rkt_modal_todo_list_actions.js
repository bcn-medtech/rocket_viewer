export function lookForElementInArray(element, array) {
    var isNewElement = true;

    if (array.length === 0) {
        isNewElement = true;

    } else if (array.length > 0) {
        
        for (var i = 0; i < array.length; i++) {
            if (array[i] === element) {
                isNewElement = false;
                break;
            }
    
            if (!isNewElement) break;
        }
    }

    return isNewElement;
}