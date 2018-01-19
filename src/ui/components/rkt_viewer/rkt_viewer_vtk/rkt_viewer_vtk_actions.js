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

// modules
import { readFile, checkVTKFormat, loadVTKLabels, obtainMaxMinValues } from "./rkt_viewer_vtk_modules.js";

// libraries
import VTKLoader from "./../../../../libraries/VTKLoader";

var THREE = require('three');
var TrackballControls = require('three-trackballcontrols');
require('three-lut');

// global variables
var selected_label;
var selected_label_has_changed = false;
var selected_colormap = "rainbow";
var selected_colormap_has_changed = false;
var submitted_min_max = {};
var submitted_min_max_has_changed = false;
var info_luts = {};
var camera;

export function initScene(callback) {
    
    var container = document.getElementById("container-viewer");

    var viewerParent = container.parentNode.parentNode;
    var viewerWidth = viewerParent.offsetWidth;
    var viewerHeight = viewerParent.offsetHeight;

    // SCENE

    var scene = new THREE.Scene();

    // CAMERA

    camera = new THREE.PerspectiveCamera(60, viewerWidth / viewerHeight, 0.01, 10000000);
    // field of view (fov) [º], aspect ratio (width/height), far clip plane, near clip plane
    camera.position.set(0, 0, 0);
    camera.lookAt(scene.position);
    scene.add(camera);

    // LIGHTS

    // point light that will follow the camera movement to light up uniformly 
    // the model (camera has to be a child of scene)
    var light = new THREE.PointLight(0xffffff, 1);
    camera.add(light);

    // RENDERER

    var renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(viewerWidth, viewerHeight);
    renderer.setClearColor(0x000000, 1);
    renderer.setPixelRatio(window.devicePixelRatio);
    container.appendChild(renderer.domElement);

    // CONTROLS

    // to rotate the camera and zoom in/out and pan the 3D objects of the scene
    var cameraControl = new TrackballControls(camera, container);

    cameraControl.rotateSpeed = 5;
    cameraControl.zoomSpeed = 5;
    cameraControl.panSpeed = 1;
    cameraControl.staticMoving = true;

    // RESIZE WINDOW

    function onWindowResize() {

        viewerWidth = viewerParent.offsetWidth;
        viewerHeight = viewerParent.offsetHeight;

        camera.aspect = viewerWidth / viewerHeight;
        camera.updateProjectionMatrix();

        cameraControl.handleResize();

        renderer.setSize(viewerWidth, viewerHeight);
    }

    window.addEventListener('resize', onWindowResize, false);

    // AXES

    // container
    var containerAxes = document.getElementById('container-axes');
    var insetWidth = 150;
    var insetHeight = 150;
    containerAxes.width = insetWidth;
    containerAxes.height = insetHeight;
    // renderer
    var rendererAxes = new THREE.WebGLRenderer({ alpha: true });
    rendererAxes.setClearColor(0x000000, 0);
    containerAxes.appendChild(rendererAxes.domElement);
    // scene
    var sceneAxes = new THREE.Scene();
    //camera
    var cameraAxes = new THREE.PerspectiveCamera(50, insetWidth / insetHeight, 1, 1000);
    // field of view (fov) [º], aspect ratio (width/height), far clip plane, near clip plane
    cameraAxes.up = camera.up;
    // axes
    var axes = new THREE.AxisHelper(100);
    sceneAxes.add(axes);

    // RENDER VIEW

    function renderView() {
        cameraControl.update();

        // if another label has been selected from a toolbox list of VTK labels, 
        // or new min and max values of a label have been submitted
        if ((selected_label_has_changed) || (selected_colormap_has_changed)
            || (submitted_min_max_has_changed)) {

            displaySelectedLut(selected_label, selected_colormap); // we update the label to display in the model

            if (selected_label_has_changed) selected_label_has_changed = false;
            if (selected_colormap_has_changed) selected_colormap_has_changed = false;
            if (submitted_min_max_has_changed) submitted_min_max_has_changed = false;

        }

        // copy position of the camera into cameraAxes
        cameraAxes.position.copy(camera.position);
        cameraAxes.position.setLength(300);
        cameraAxes.lookAt(sceneAxes.position);

        renderer.render(scene, camera);
        rendererAxes.render(sceneAxes, cameraAxes);

        requestAnimationFrame(renderView);
    }

    renderView();

    callback(scene); // scene has been initialized

    /*
        OTHER FUNCTIONS
    */

    function displaySelectedLut(selected_label, selected_colormap) {
        var VTK_mesh = scene.getObjectByName("vtk_mesh");
        var VTK_material = VTK_mesh.material;
        var VTK_geometry = VTK_mesh.geometry;

        if ((selected_label !== undefined) && (selected_label !== "Solid Color")) {

            if ((selected_label_has_changed) ||

                ((selected_label_has_changed === false) && (submitted_min_max_has_changed === false)
                    && (selected_colormap_has_changed) && (VTK_geometry.attributes.color)) ||

                ((selected_label_has_changed === false) && (submitted_min_max_has_changed)
                    && (selected_colormap_has_changed === false) && (VTK_geometry.attributes.color))) {

                // we display the model with the selected label by
                // 1st: updating the material
                VTK_material.vertexColors = THREE.VertexColors;
                VTK_material.needsUpdate = true;
                // 2nd: updating the geometry
                var lutColors_to_display = info_luts[selected_label + " " + selected_colormap].lutColors;
                VTK_geometry.addAttribute("color", new THREE.BufferAttribute(new Float32Array(lutColors_to_display), 3));
                VTK_geometry.attributes.color.needsUpdate = true;
            }
        }

        else if ((selected_label !== undefined) && (selected_label === "Solid Color")) {

            if ((selected_label_has_changed) && (VTK_geometry.attributes.color)) {

                // we display the default model, without labels
                VTK_material.vertexColors = false;
                VTK_material.needsUpdate = true;
                VTK_geometry.attributes.color.needsUpdate = true;
            }
        }
    }
}

export function loadVTK(scene, url, callback1, callback2) {

    // variables for when the VTK file has labels
    var info_toolbox_list = [];
    var num_toolbox_list = 0;
    var info_toolbox_table_inputs = [];
    var min_max_values_labels = [];

    // LOADER

    readFile(url, function (lines_all_data) {

        if (lines_all_data) {
            var vtk_format = checkVTKFormat(lines_all_data);

            if (vtk_format === "ASCII") {

                // we detect whether the VTK has labels (SCALARS and/or FIELD) or not
                var [gui_names, labels] = loadVTKLabels(lines_all_data);

                if ((gui_names) && (labels)) { // if the VTK has labels

                    // we create a toolbox to select which label to display
                    createVTKLabelsToolboxList(info_toolbox_list, gui_names);
                    // we create a toolbox to select in which colormap display the model
                    createColormapsToolboxList(info_toolbox_list);
                    // we load the model and add these labels as attributes of the geometry
                    loadModel(url, labels);
                    // and we create a toolbox to set the min and max values of the lut to display
                    createMinAndMaxToolboxTableInputs(info_toolbox_table_inputs, min_max_values_labels);

                    if ((info_toolbox_list.length > 0) && (info_toolbox_table_inputs.length > 0)) {
                        callback1(info_toolbox_list, info_toolbox_table_inputs);
                    } else callback1(false, false);

                } else { // if the VTK DOES NOT have labels

                    // we load the model normally
                    loadModel(url, false);
                }
            } else if (vtk_format === "BINARY") {
                alert("For the moment only ASCII VTK files can be read");
                //
            } else alert("Incompatible VTK format")

        } else { // if we cannot read/load the VTK file
            alert("Error reading the VTK file");
        }

    });

    function createVTKLabelsToolboxList(info_toolbox_list, names_labels) {

        info_toolbox_list[num_toolbox_list] = {
            "title": "VTK LABELS", "items": names_labels,
            "onclickitem": [changeSelectedLabel.bind(this), retrieveSelectedLabelInfo.bind(this)]
        };
        num_toolbox_list += 1;
    }

    function createColormapsToolboxList(info_toolbox_list) {
        info_toolbox_list[num_toolbox_list] = {
            "title": "COLORMAPS", "items": ["rainbow", "cooltowarm", "blackbody"],
            "onclickitem": [changeSelectedColormap.bind(this)]
        };
        num_toolbox_list += 1;
    }

    function createMinAndMaxToolboxTableInputs(info_toolbox_table_inputs, min_max_values_labels) {

        info_toolbox_table_inputs[0] = {
            "title": "Lookup table editor",
            "items": [
                { "type": "text", "name": "Min value", "extra_info_name": " ", "placeholder": "" },
                { "type": "text", "name": "Max value", "extra_info_name": " ", "placeholder": "" }
            ],
            "onSubmit": changeMinMaxLabels.bind(this)
        };
    }

    function loadModel(url, labels) {

        delete3DOBJ(scene, "vtk_mesh");

        var loader = new THREE.VTKLoader();

        loader.load(url, function (geometry) {
            geometry.computeVertexNormals();
            geometry.normalizeNormals();

            var material = new THREE.MeshLambertMaterial({
                color: 0xffffff,
                wireframe: false,
                morphTargets: false,
                side: THREE.DoubleSide,
            });

            // if VTK has labels, we add them to the geometry as attributes
            if (labels) saveLabelsOfGeometry(labels);

            var mesh = new THREE.Mesh(geometry, material);
            mesh.name = "vtk_mesh";
            scene.add(mesh);

            // we set the camera's position so that it is in the center 
            // of the mesh (x and y coordinates), and a certain depth (z coordinate)
            var box3 = new THREE.Box3().setFromObject(mesh);
            var centerBox3 = box3.getCenter();
            var sizeBox3 = box3.getSize();
            //var widthBox3 = sizeBox3.x;
            //var heightBox3 = sizeBox3.y;
            var depthBox3 = sizeBox3.z;
            camera.position.set(centerBox3.x, centerBox3.y, 3*depthBox3);

            callback2(true); // VTK geometry is loaded
        });

        function delete3DOBJ(scene, objName) {
            var selectedObject = scene.getObjectByName(objName);
            scene.remove(selectedObject);
        }

        function saveLabelsOfGeometry(labels) {
            // Adding labels to the geometry
            //var arr_colormaps = ["rainbow"];
            var arr_colormaps = ["rainbow", "cooltowarm", "blackbody"];

            for (var num_colormap = 0; num_colormap < arr_colormaps.length; num_colormap++) {

                var colorMap = arr_colormaps[num_colormap];

                for (var i = 0; i < Object.keys(labels).length; i++) {

                    var lutColors = [];
                    var name = labels[i].name;
                    var values = labels[i].values;

                    var numberOfColors = 512;
                    var lut = new THREE.Lut(colorMap, numberOfColors);

                    var [max, min] = obtainMaxMinValues(values);
                    lut.setMax(max);
                    lut.setMin(min);

                    for (var j = 0; j < values.length; j++) {
                        var colorValue = values[j];
                        var color = lut.getColor(colorValue);
                        if (color === undefined) {
                            console.log("ERROR: " + colorValue);
                        } else {
                            lutColors[3 * j] = color.r;
                            lutColors[3 * j + 1] = color.g;
                            lutColors[3 * j + 2] = color.b;
                        }
                    }
                    info_luts[name + " " + colorMap] = { "label_values": values, "min_value": min, "max_value": max, "lut": lut, "lutColors": lutColors };
                }
            }
        }
    }
}

export function retrieveSelectedLabelInfo(selected_label, info_toolbox_table_inputs, callback) {
    // current_min, current_max, default_min, default_max: we show these values in the toolbox table inputs

    if (selected_label !== "Solid Color") {
        // we retrieve the info to display in the toolbox table inputs, which is related to the selected label
        // (This is only done when selected_label is NOT Solid Color)

        var info_selected_label_lut = info_luts[selected_label + " " + selected_colormap];

        var current_min = info_selected_label_lut.lut["minV"];
        var current_max = info_selected_label_lut.lut["maxV"];

        var default_min = info_selected_label_lut.min_value;
        var extra_info_name_min = "(default value: " + default_min.toString() + ")";

        var default_max = info_selected_label_lut.max_value;
        var extra_info_name_max = "(default value: " + default_max.toString() + ")";

        // we update the toolbox table inputs
        info_toolbox_table_inputs[0] = {
            "title": "Lookup table editor",
            "items": [
                { "type": "text", "name": "Min value", "extra_info_name": extra_info_name_min, "placeholder": current_min },
                { "type": "text", "name": "Max value", "extra_info_name": extra_info_name_max, "placeholder": current_max }
            ],
            "onSubmit": changeMinMaxLabels.bind(this)
        };

        callback(info_toolbox_table_inputs);

    } else callback(false);
}

export function changeSelectedLabel(currentItem) {
    // currentItem = string: name of the selected label
    selected_label = currentItem;
    selected_label_has_changed = true;
}

export function changeSelectedColormap(currentItem) {
    // currentItem = string: name of the selected colormap
    selected_colormap = currentItem;
    selected_colormap_has_changed = true;
}

export function changeMinMaxLabels(submittedValues, callback) {
    // currentItems: {["name":string of the name],["value":string of the value]};
    // callback will inform the toolbox_table_inputs whether the submitted values are valid or not

    if (submittedValues.length === 2) {

        var value1 = submittedValues[0].value;
        var value2 = submittedValues[1].value;

        // 1st we have to check that TWO value have been submitted
        if ((value1 === "") || (value2 === "")) {

            // --> user has NOT submiited two numbers
            alert("You must submit 2 values");
            callback(false);

        } else {

            // THEN, we have to check that the submitted values are NUMBERS
            if ((!isNaN(value1)) && (!isNaN(value2))) {

                // --> both submitted values ARE NUMBERS ("NaN" stands for "Not-a-number" )

                // we obtain the submitted values
                for (var i = 0; i < submittedValues.length; i++) {
                    var submittedValue = submittedValues[i];

                    if (submittedValue.name === "Min value") var current_min = parseFloat(submittedValue.value);
                    else if (submittedValue.name === "Max value") var current_max = parseFloat(submittedValue.value);
                }

                // FINALLY, we have to check that the submitted values are within a VALID RANGE
                var info_selected_label_lut = info_luts[selected_label + " " + selected_colormap];
                var default_min = info_selected_label_lut.min_value;
                //var default_max = info_selected_label_lut.max_value; // MAYBE I DO NOT NEED THAT

                // valid current min values are within the range [default_min, infinity],
                // valid current max values are within the range [default_min, infinity],
                // and the current min value must be < current max value

                if ((current_min < default_min) || (current_max < default_min) ||
                    (current_min > current_max)) {

                    // --> submitted values are NOT within a valid range
                    alert("Submitted values must be within a valid range")
                    callback(false);

                } else {

                    // --> submitted values ARE within a valid range
                    submitted_min_max["Min value"] = current_min;
                    submitted_min_max["Max value"] = current_max;

                    changeMinMaxValuesLut(submitted_min_max, selected_label, selected_colormap);

                    submitted_min_max_has_changed = true;

                    callback(true);
                }

            } else { // --> submitted values are NOT numbers

                alert("You must submit numbers");
                callback(false);

            }
        }

    } else {
        alert("ERROR: two inputs must be obtained from the toolbox table inputs");
    }

}

export function changeMinMaxValuesLut(submitted_min_max, selected_label, selected_colormap) {
    var new_min = submitted_min_max["Min value"];
    var new_max = submitted_min_max["Max value"];

    // we change the min and max values of the luts, 
    // and for the three possible colormaps to do all calculations once

    var arr_colormaps = ["rainbow", "cooltowarm", "blackbody"];

    for (var num_colormap = 0; num_colormap < arr_colormaps.length; num_colormap++) {

        var colorMap = arr_colormaps[num_colormap];
        var lut_to_change = info_luts[selected_label + " " + colorMap].lut;

        lut_to_change.setMax(new_max);
        lut_to_change.setMin(new_min);

        var lutColors_to_change = [];
        var values_selected_label = info_luts[selected_label + " " + colorMap].label_values;

        for (var i = 0; i < values_selected_label.length; i++) {

            var colorValue = values_selected_label[i];
            var color = lut_to_change.getColor(colorValue);
            if (color === undefined) {
                console.log("ERROR: " + colorValue);
            } else {
                lutColors_to_change[3 * i] = color.r;
                lutColors_to_change[3 * i + 1] = color.g;
                lutColors_to_change[3 * i + 2] = color.b;
            }
        }

        // we update "info_luts" with the changed "lut" and "lutColors"
        info_luts[selected_label + " " + colorMap].lut = lut_to_change;
        info_luts[selected_label + " " + colorMap].lutColors = lutColors_to_change;
    }
}