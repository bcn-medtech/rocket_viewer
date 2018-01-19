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
import PLYLoader from './../../../../libraries/PLYLoader.js';

var THREE = require('three');
var TrackballControls = require('three-trackballcontrols');

export function obtainBlobUrl(blob) {

    var file = blob[0];
    var blob_url = window.URL.createObjectURL(file);
    return blob_url;
}

var camera;

export function initScene(callback) {

    var container = document.getElementById("container-viewer");

    var viewerParent = container.parentNode.parentNode;
    var viewerWidth = viewerParent.offsetWidth;
    var viewerHeight = viewerParent.offsetHeight;
 
    // SCENE

    var scene = new THREE.Scene();

    // CAMERA
    camera = new THREE.PerspectiveCamera(45, viewerWidth / viewerHeight, 0.01, 10000000);
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

export function loadPLY(scene, url, callback) {

    delete3DOBJ(scene, "ply_mesh");

    // LOADER 
    var loader = new THREE.PLYLoader();

    loader.load(url, function (geometry) {
        geometry.computeVertexNormals();

        var material = new THREE.MeshLambertMaterial({
            color: 0xffffff
        });

        var mesh = new THREE.Mesh(geometry, material);
        mesh.name = "ply_mesh";
        scene.add(mesh);

        // we set the camera's position so that it is in the center 
        // of the mesh (x and y coordinates), and a certain depth (z coordinate)
        var box3 = new THREE.Box3().setFromObject(mesh);
        var centerBox3 = box3.getCenter();
        var sizeBox3 = box3.getSize();
        //var widthBox3 = sizeBox3.x;
        //var heightBox3 = sizeBox3.y;
        var depthBox3 = sizeBox3.z;
        camera.position.set(centerBox3.x, centerBox3.y, 3 * depthBox3);

        callback(true); // mesh has been loaded
    });
}

function delete3DOBJ(scene, objName) {
    var selectedObject = scene.getObjectByName(objName);
    scene.remove(selectedObject);
}