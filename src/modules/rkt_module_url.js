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

    console.log(queryString);

    queryString = fakeReplace(queryString, ".", "%2E");
    queryString = "?"+queryString;

    return queryString;
}