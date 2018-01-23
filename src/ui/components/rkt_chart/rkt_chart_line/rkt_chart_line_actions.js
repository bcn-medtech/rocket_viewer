//import modules
import {generate_rainbow_color} from './../../../../modules/rkt_module_colors';

export function generateRandomColors(lines_names){
    
    console.log(lines_names);

    var colors = {};

    for(var i=0;i<lines_names.length;i++){

        var line_name = lines_names[i];
        colors[line_name] = generate_rainbow_color(lines_names.length,i);
    }

    return colors;
}