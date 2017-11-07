// modules
import { createGUI } from "./rkt_viewer_nrrd_modules";

// libraries
import NRRDLoader from "./../../../../libraries/NRRDLoader";
import Volume from "./../../../../libraries/Volume";
import VolumeSlice from "./../../../../libraries/VolumeSlice";

var THREE = require('three');
var TrackballControls = require('three-trackballcontrols');

var camera;

export function initScene(callback) {

    var container = document.getElementById("container-viewer");

    // SCENE

    var scene = new THREE.Scene();

    // CAMERA

    camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.01, 10000000);
    // field of view (fov) [º], aspect ratio (width/height), far clip plane, near clip plane
    camera.position.set(0, 0, 0);
    camera.lookAt(scene.position);
    scene.add(camera);

    // LIGHTS

    // point light that will follow the camera movement to light uniformly the model 
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
}

export function loadNRRD(scene, url, callback) {

    delete3DOBJ(scene, ["box", "cube", "sliceZ", "sliceY", "sliceX"]);
    deleteGUI();

    // LOADER

    var loader = new THREE.NRRDLoader();

    loader.load(url, function (volume) {
        // box helper to see the extend of the volume
        var geometry = new THREE.BoxGeometry(volume.xLength, volume.yLength, volume.zLength);
        var material = new THREE.MeshBasicMaterial({ color: 0xffffff });
        var cube = new THREE.Mesh(geometry, material);
        cube.name = "cube";
        cube.visible = false;
        var box = new THREE.BoxHelper(cube);
        console.log(box);
        box.name = "box";
        scene.add(box);
        box.applyMatrix(volume.matrix);
        scene.add(cube);

        // // we set the camera's position so that it is in the center 
        // // of the mesh (x and y coordinates), and a certain depth (z coordinate)
        var box3 = new THREE.Box3().setFromObject(cube);
        var centerBox3 = box3.getCenter();
        var sizeBox3 = box3.getSize();
        // //var widthBox3 = sizeBox3.x;
        // //var heightBox3 = sizeBox3.y;
        var depthBox3 = sizeBox3.z;
        camera.position.set(centerBox3.x, centerBox3.y, 2 * depthBox3);

        // z plane
        var sliceZ = volume.extractSlice('z', Math.floor(volume.RASDimensions[2] / 4));
        sliceZ.mesh.name = "sliceZ";
        console.log(sliceZ);
        scene.add(sliceZ.mesh);

        //y plane
        var sliceY = volume.extractSlice('y', Math.floor(volume.RASDimensions[1] / 2));
        sliceY.mesh.name = "sliceY";
        scene.add(sliceY.mesh);

        // x plane
        var sliceX = volume.extractSlice('x', Math.floor(volume.RASDimensions[0] / 2));
        sliceX.mesh.name = "sliceX";
        scene.add(sliceX.mesh);

        // gui to control the visualization of the different slices
        createGUI(volume, sliceX, sliceY, sliceZ);

        callback(true); // volume has been loaded
    });
}

function delete3DOBJ(scene, objName) {

    if (objName.length > 0) {
        for (var i = 0; i < objName; i++) {
            var selectedObject = scene.getObjectByName(objName);
            scene.remove(selectedObject);
        }
    }
}

function deleteGUI() {
    // we obtain the container in which the created "gui" will be appended
    var container_gui_menu = document.getElementById("container-gui-menu");

    // If "container_gui_menu" has children (that is, a GUI menu was created before)
    if (container_gui_menu.children.length > 0) {
        var children = container_gui_menu.children;
        for (var j = 0; j < container_gui_menu.children.length; j++) {
            container_gui_menu.removeChild(children[j]);
        }
    }
}