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