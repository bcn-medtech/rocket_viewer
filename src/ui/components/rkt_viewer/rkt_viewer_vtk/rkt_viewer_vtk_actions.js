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
var submitted_min_max;
var submitted_min_max_has_changed = false;
var info_luts = {};

export function initScene(callback) {
    var container = document.getElementById("container-viewer");

    // SCENE

    var scene = new THREE.Scene();

    // CAMERA

    var camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.01, 10000000);
    // field of view (fov) [º], aspect ratio (width/height), far clip plane, near clip plane
    camera.position.set(0, 0, 0.2); // TO DO: 0.2 for the example with field data, 50 for the example with scalars data
    camera.lookAt(scene.position);
    scene.add(camera);

    // LIGHTS

    // point light that will follow the camera movement to light up uniformly the model
    // (camera has to be a child of scene)
    var light = new THREE.PointLight(0xffffff, 1);
    camera.add(light);

    // RENDERER

    var renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
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
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();

        cameraControl.handleResize();

        renderer.setSize(window.innerWidth, window.innerHeight);
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

        // if another label has been selected from a toolbox list of VTK labels
        if ((selected_label_has_changed) || (selected_colormap_has_changed)) {

            // if also another min or max value of a label has been submitted
            if (submitted_min_max_has_changed) {

                changeMinMaxValuesLut(submitted_min_max, selected_label, selected_colormap); // we update the values of the label to display

                if (submitted_min_max_has_changed) submitted_min_max_has_changed = false;
            }

            displaySelectedLut(selected_label, selected_colormap); // we update the label to display in the model

            if (selected_label_has_changed) selected_label_has_changed = false;
            if (selected_colormap_has_changed) selected_colormap_has_changed = false;

        } else if (submitted_min_max_has_changed) { // if only another min or max value of a label has been submitted

            changeMinMaxValuesLut(submitted_min_max, selected_label, selected_colormap) // we update the values of the label to display
            displaySelectedLut(selected_label, selected_colormap); // and we update the label to display in the model

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

    function changeMinMaxValuesLut(submitted_min_max, selected_label, selected_colormap) {
        var new_min = submitted_min_max.min;
        var new_max = submitted_min_max.max;

        var lut_to_change = info_luts[selected_label + " " + selected_colormap].lut;
        lut_to_change.setMax(new_max);
        lut_to_change.setMin(new_min);

        var lutColors_to_change = [];
        var values_selected_label = info_luts[selected_label + " " + selected_colormap].label_values;

        for (var i = 0; i < Object.keys(values_selected_label).length; i++) {

            for (var j = 0; j < values_selected_label.length; j++) {
                var colorValue = values_selected_label[j];
                var color = lut_to_change.getColor(colorValue);
                if (color === undefined) {
                    console.log("ERROR: " + colorValue);
                } else {
                    lutColors_to_change[3 * j] = color.r;
                    lutColors_to_change[3 * j + 1] = color.g;
                    lutColors_to_change[3 * j + 2] = color.b;
                }
            }

            // we update info_luts with the changed lut and lutColors
            info_luts[selected_label + " " + selected_colormap] = { "label_values": values_selected_label, "lut": lut_to_change, "lutColors": lutColors_to_change };
        }

    }

    function displaySelectedLut(selected_label, selected_colormap) {
        var VTK_mesh = scene.getObjectByName("vtk_mesh");
        var VTK_material = VTK_mesh.material;
        var VTK_geometry = VTK_mesh.geometry;

        if ((selected_label !== undefined) && (selected_label !== "Solid Color")) {

            if (((selected_label_has_changed === false) && (selected_colormap_has_changed) &&
                (VTK_geometry.attributes.color)) || (selected_label_has_changed)) {

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

export function loadVTK(scene, url, on_selected_vtk_label_function, callback1, callback2) {

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
            "onclickitem": [changeSelectedLabel.bind(this), on_selected_vtk_label_function]//on_selected_vtk_label_function
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

export function changeMinMaxLabels(currentItems) {
    // currentItems = {"min":number, "max":number}

    // var [max, min] = obtainMaxMinValues(values);

    // if () {

    //     submitted_min_max = currentItems;
    //     submitted_min_max_has_changed = true;

    // } else {
    //     alert("The submitted values are not in the range of possible values");
    // }

}