// libraries
import dat from "./../../../../libraries/dat.gui.min";

export function obtainBlobUrl(blob) {
    var file = blob[0];
    var blob_url = window.URL.createObjectURL(file);
    return blob_url;
}

export function createGUI(volume, sliceX, sliceY, sliceZ) {

    console.log("Create GUI");
    
    var gui = new dat.GUI({ autoPlace: false }); // autoPlace: false => to customize the placement of "gui"

    gui.add(sliceX, "index", 0, volume.RASDimensions[0], 1).name("indexX").onChange(function () { sliceX.repaint.call(sliceX); });
    gui.add(sliceY, "index", 0, volume.RASDimensions[1], 1).name("indexY").onChange(function () { sliceY.repaint.call(sliceY); });
    gui.add(sliceZ, "index", 0, volume.RASDimensions[2], 1).name("indexZ").onChange(function () { sliceZ.repaint.call(sliceZ); });

    gui.add(volume, "lowerThreshold", volume.min, volume.max, 1).name("Lower Threshold").onChange(function () {
        volume.repaintAllSlices();
    });
    gui.add(volume, "upperThreshold", volume.min, volume.max, 1).name("Upper Threshold").onChange(function () {
        volume.repaintAllSlices();
    });
    gui.add(volume, "windowLow", volume.min, volume.max, 1).name("Window Low").onChange(function () {
        volume.repaintAllSlices();
    });
    gui.add(volume, "windowHigh", volume.min, volume.max, 1).name("Window High").onChange(function () {
        volume.repaintAllSlices();
    });

    // adding this gui to the container with id:"container-gui-menu"
    placeGUI(gui);
}

export function placeGUI(gui) {

    // we obtain the container in which the created "gui" will be appended
    var container_gui_menu = document.getElementById("container-gui-menu");
    // and we append "gui" to it ("container_gui_menu")
    container_gui_menu.appendChild(gui.domElement);
}