//modules
import {isObjectEmpty} from './../../../../modules/rkt_module_object';

export function loadLocalPDF(blob, callback) {

    var file = blob[0];

    callback(file);
}

export function loadWADOPDF(url, callback) {

    fetch(url).then(function (response) {

        return response.blob();

    }).then(function (blob) {

        callback(blob)
    });

}

export function loadPDF(url, blob,callback) {
    
    if(!isObjectEmpty(url)){

        loadWADOPDF(url, function(blob){
            callback(blob);
        });

    }else if(!isObjectEmpty(blob)){

        loadLocalPDF(blob, function(simpleBlob){
            callback(simpleBlob)
        });

    }else{

        alert("Problems with inputs");

    }

}