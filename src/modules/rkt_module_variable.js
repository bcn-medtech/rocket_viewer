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