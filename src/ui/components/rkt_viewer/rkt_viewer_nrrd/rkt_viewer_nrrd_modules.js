/*
# Rocket viewer is (c) BCNMedTech, UNIVERSITAT POMPEU FABRA
#
# Rocket viewer is free software: you can redistribute it and/or modify
# it under the terms of the GNU Affero General Public License as
# published by the Free Software Foundation, either version 3 of the
# License, or (at your option) any later version.
#
# Rocket viewer is distributed in the hope that it will be useful,
# but WITHOUT ANY WARRANTY; without even the implied warranty of
# MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
# GNU Affero General Public License for more details.
#
# You should have received a copy of the GNU Affero General Public License
# along with this program.  If not, see <http://www.gnu.org/licenses/>.
#
# Authors:
# Carlos Yagüe Méndez
# María del Pilar García
# Daniele Pezzatini
# Contributors: 
# Sergio Sánchez Martínez
*/

// libraries
import dat from "./../../../../libraries/dat.gui.min";

export function obtainBlobUrl(blob) {
    var file = blob[0];
    var blob_url = window.URL.createObjectURL(file);
    return blob_url;
}

export function createGUI(volume, sliceX, sliceY, sliceZ) {

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