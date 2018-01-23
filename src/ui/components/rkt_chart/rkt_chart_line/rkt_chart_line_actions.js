//import modules
import {generate_rainbow_color} from './../../../../modules/rkt_module_colors';

export function generateRandomColors(lines_names){

    var colors = {};

    for(var i=0;i<lines_names.length;i++){

        var line_name = lines_names[i];
        colors[line_name] = generate_rainbow_color(lines_names.length,i);
    }

    return colors;
}

export function initLinesToShow(lines_names){

    var linesToShow = {};

    for(var i=0;i<lines_names.length;i++){

        var line_name = lines_names[i];
        linesToShow[line_name]=true;

    }

    return linesToShow;
}

export function intChartOptions(){

    return {
        show_cartesian_grid:false,
        show_axis:false
    }
}