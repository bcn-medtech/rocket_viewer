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
            displaySelectedLut(selected_label, selected_colormap); // we update the label to display in the model

            if (selected_label_has_changed) selected_label_has_changed = false;
            if (selected_colormap_has_changed) selected_colormap_has_changed = false;
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

    function displaySelectedLut(selected_label, selected_) {
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
                var lut_to_display = VTK_mesh.geometry.attributes[selected_label + " " + selected_colormap].array;
                VTK_geometry.addAttribute("color", new THREE.BufferAttribute(new Float32Array(lut_to_display), 3));
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
    // info_luts;

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
                    // and we load the model and add these labels as attributes of the geometry
                    loadModel(url, labels);

                    if (info_toolbox_list.length > 0) {
                        callback1(info_toolbox_list);
                    } else callback1(false);

                } else { // if the VTK DOES NOT have labels

                    // we load the model normally
                    loadModel(url, false);
                }
            } else if (vtk_format === "BINARY") {
                alert("For the moment only ASCII VTK files can be read");
                // ??????????????????
            } else alert("Incompatible VTK format")

        } else { // if we cannot read/load the VTK file
            alert("Error reading the VTK file");
        }

    });

    function createVTKLabelsToolboxList(info_toolbox_list, names_labels) {

        info_toolbox_list[num_toolbox_list] = {
            "title": "VTK LABELS", "items": names_labels,
            "onclickitem": changeSelectedLabel.bind(this)
        };
        num_toolbox_list += 1;
    }

    function createColormapsToolboxList(info_toolbox_list) {
        info_toolbox_list[num_toolbox_list] = {
            "title": "COLORMAPS", "items": ["rainbow", "cooltowarm", "blackbody"],
            "onclickitem": changeSelectedColormap.bind(this)
        };
        num_toolbox_list += 1;
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
            if (labels) addLabelsToGeometry(labels, geometry);

            var mesh = new THREE.Mesh(geometry, material);
            mesh.name = "vtk_mesh";

            scene.add(mesh);

            callback2(true); // VTK geometry is loaded
        });

        function delete3DOBJ(scene, objName) {
            var selectedObject = scene.getObjectByName(objName);
            scene.remove(selectedObject);
        }

        function addLabelsToGeometry(labels, geometry) {

            // Adding labels to the geometry
            //var arr_colormaps = ["rainbow"];
            var arr_colormaps = ["rainbow", "cooltowarm", "blackbody"];
            var lutColors = [];

            for (var num_colormap = 0; num_colormap < arr_colormaps.length; num_colormap++) {

                var colorMap = arr_colormaps[num_colormap];

                for (var i = 0; i < Object.keys(labels).length; i++) {

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
                    geometry.addAttribute(name + " " + colorMap, new THREE.BufferAttribute(new Float32Array(lutColors), 3));
                    //info_luts[name+" "+colorMap] = {lut};
                }
            }

        }
    }
}

export function changeSelectedLabel(currentItem) {
    selected_label = currentItem;
    selected_label_has_changed = true;
}

export function changeSelectedColormap(currentItem) {
    selected_colormap = currentItem;
    selected_colormap_has_changed = true;
}