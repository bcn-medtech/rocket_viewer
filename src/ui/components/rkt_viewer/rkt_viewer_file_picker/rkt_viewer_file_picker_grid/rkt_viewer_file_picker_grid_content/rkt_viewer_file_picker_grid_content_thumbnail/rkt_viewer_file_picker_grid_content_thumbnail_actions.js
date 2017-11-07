
import { isObjectEmpty } from './../../../../../../../modules/rkt_module_object';

// libraries
import NRRDLoader from './../../../../../../../libraries/NRRDLoader';
import PLYLoader from './../../../../../../../libraries/PLYLoader';
import VTKLoader from './../../../../../../../libraries/VTKLoader';

var THREE = require('three');
var TrackballControls = require('three-trackballcontrols');

//Using global variables
const cornerstone = window.cornerstone;
const cornerstoneWADOImageLoader = window.cornerstoneWADOImageLoader;
const cornerstoneWebImageLoader = window.cornerstoneWebImageLoader;

export function isViewerLoadingAURLSource(img_url) {

    var viewerLoadingAURLResource = false;

    if (!isObjectEmpty(img_url)) {
        viewerLoadingAURLResource = true;
    }

    return viewerLoadingAURLResource;
}

export function getViewerType(files, url, callback) {

    var viewerType;

    if (isViewerLoadingAURLSource(url)) {

        // Obtain type from a url?
        //console.log("TO DO: OBTAIN FILETYPE FROM A URL");


    } else {

        var fileType = files[0].type;

        if (!isObjectEmpty(fileType)) {

            switch (fileType) {
                case "application/dicom":
                    viewerType = "dicom";
                    break;

                case "image/tiff":
                    viewerType = "tiff";
                    break;

                case "application/pdf":
                    viewerType = "pdf";
                    break;

                default:
                    break;
            }

        } else {

            var nameFile = files[0].name;

            if (nameFile.includes(".nrrd")) viewerType = "nrrd";
            else if (nameFile.includes(".ply")) viewerType = "ply";
            else if (nameFile.includes(".vtk")) viewerType = "vtk";

        }
    }

    callback(viewerType);

}

export function loadImage(viewerType, files, url, on_image_loaded_function, on_error_loading_function) {

    var img_url;

    switch (viewerType) {

        case "dicom":
            var img_source;

            if (isViewerLoadingAURLSource(url)) {
                img_url = url;
                img_source = "wado";
            }

            else {
                img_url = files;
                img_source = "filesystem";
            }

            loadDicom(img_url, img_source, on_image_loaded_function, on_error_loading_function);
            break;

        case "nrrd":
        case "ply":
        case "vtk":

            // SNAPSHOT OF A THREE JS SCENE: IT DOES NOT WORK YET

            // if (isViewerLoadingAURLSource(url)) img_url = url;
            // else img_url = files[0].preview;

            // initSimple3DScene(function (scene, camera, container) {

            //     load3DModel(viewerType, scene, camera, container, img_url, function (rendererURL) {
            //         console.log(rendererURL);
            //         createCornerstoneImage(rendererURL, function (cornerstoneImage) {

            //             if (cornerstoneImage) {

            //                 document.getElementById("container-viewer").remove();
            //                 on_image_loaded_function(cornerstoneImage);

            //             } else {
            //                 on_error_loading_function();
            //             }
            //         });
            //     });
            // });

            // INSTEAD, WE DISPLAY A SIMPLE PNG/JPG AS A CORNERSTONE IMAGE

            //var thumbnail_image;
            var dataURL;

            // switch (viewerType) {
            //     case "nrrd":
            //         thumnbail_image = ;
            //         dataURL = ;
            //         break;
            //     case "ply":
            //         thumnbail_image = ;
            //         dataURL = ;
            //         break;
            //     case "vtk":
            //         thumnbail_image = ;
            //         dataURL = ;
            //         break;
            //     default:
            //         break;
            // }

            dataURL = "https://rawgit.com/chafey/cornerstoneWebImageLoader/master/examples/Renal_Cell_Carcinoma.jpg";
            createCornerstoneImage(dataURL, function (cornerstoneImage) {

                if (cornerstoneImage) {
                    on_image_loaded_function(cornerstoneImage);

                } else {
                    on_error_loading_function();
                }
            });

            break;

        default:
            break;
    }
}

export function getImageName(files, url) {

    var name;

    if (isViewerLoadingAURLSource(url)) {
        name = url.substring(url.lastIndexOf('/') + 1);

        if (url.includes("dl.dropboxusercontent") &&
            (name.includes("?dl=0"))) {
            name = name.replace("?dl=0", "");
        }

    } else {
        name = files[0].name;
    }

    return name;
}


////////////////////////// DICOM
export function loadDicom(url, img_source, on_image_loaded_function, on_error_loading_function) {

    if (img_source === "filesystem") {
        loadLocalImage(url, on_image_loaded_function, on_error_loading_function);
    }
    else if (img_source === "wado") {
        loadWADOImage(url, on_image_loaded_function, on_error_loading_function);
    }
}

function loadLocalImage(url, on_image_loaded_function, on_error_loading_function) {

    var imageId = cornerstoneWADOImageLoader.fileManager.add(url[0]);
    cornerstone.loadImage(imageId).then(
        on_image_loaded_function,
        function (err) {
            on_error_loading_function();
        });
}

function loadWADOImage(url, on_image_loaded_function, on_error_loading_function) {

    var imageId = "wadouri:" + url + "?frame=0";

    try {
        cornerstone.loadAndCacheImage(imageId).then(
            on_image_loaded_function,
            function (err) {
                on_error_loading_function();

            });
    }
    catch (err) {
        alert(err);
    }
}

//////////////////////////////////////////////////// 3D IMAGES
// function initSimple3DScene(callback) {

//     var container = document.createElement("div");
//     container.id = "container-viewer";

//     // SCENE
//     var scene = new THREE.Scene();

//     // CAMERA
//     var camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.01, 10000000);
//     camera.position.set(0, 0, 0);
//     camera.lookAt(scene.position);
//     scene.add(camera);

//     // LIGHTS

//     // point light that will follow the camera movement to light uniformly the model 
//     // (camera has to be a child of scene)
//     var light = new THREE.PointLight(0xffffff, 1);
//     camera.add(light);

//     // RENDERER

//     var renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, preserveDrawingBuffer: true });
//     renderer.setSize(window.innerWidth, window.innerHeight);
//     renderer.setClearColor(0x000000, 1);
//     renderer.setPixelRatio(window.devicePixelRatio);
//     container.appendChild(renderer.domElement);

//     // RENDER VIEW 

//     function renderView() {

//         renderer.render(scene, camera);
//         requestAnimationFrame(renderView);
//     }

//     renderView();

//     callback(scene, camera, container); // scene has been initialized

// }

// function load3DModel(viewerType, scene, camera, container, img_url, callback) {
//     var rendererUrl;

//     switch (viewerType) {

//         case "nrrd":
//             rendererUrl = loadNRRD(scene, camera, container, img_url);
//             break;

//         case "ply":
//             rendererUrl = loadPLY(scene, camera, container, img_url);
//             break;

//         case "vtk":
//             rendererUrl = loadVTK(scene, camera, container, img_url);
//             break;

//         default:
//             break;
//     }

//     callback(rendererUrl);
// }

function createCornerstoneImage(dataURL, callback) {
    var imageId = "3d-model";
    var image = new Image();
    image.src = dataURL;

    image.onload = function () {

        var imageObject = cornerstoneWebImageLoader.createImage(image, imageId);
        callback(imageObject);

    };
    image.onerror = function (err) {

        console.log("Problems loading the image");
        callback(false);
    };
}


// ////////////////////////// NRRD
// function loadNRRD(scene, camera, container, url) {
//     var rendererUrl;

//     var loader = new THREE.NRRDLoader();

//     loader.load(url, function (volume) {
//         // box helper to see the extend of the volume
//         var geometry = new THREE.BoxGeometry(volume.xLength, volume.yLength, volume.zLength);
//         var material = new THREE.MeshBasicMaterial({ color: 0xffffff });
//         var cube = new THREE.Mesh(geometry, material);
//         cube.name = "cube";
//         cube.visible = false;
//         var box = new THREE.BoxHelper(cube);
//         box.name = "box";
//         scene.add(box);
//         box.applyMatrix(volume.matrix);
//         scene.add(cube);

//         // // we set the camera's position so that it is in the center 
//         // // of the mesh (x and y coordinates), and a certain depth (z coordinate)
//         var box3 = new THREE.Box3().setFromObject(cube);
//         var centerBox3 = box3.getCenter();
//         var sizeBox3 = box3.getSize();
//         // //var widthBox3 = sizeBox3.x;
//         // //var heightBox3 = sizeBox3.y;
//         var depthBox3 = sizeBox3.z;
//         camera.position.set(centerBox3.x, centerBox3.y, 2 * depthBox3);

//         // z plane
//         var sliceZ = volume.extractSlice('z', Math.floor(volume.RASDimensions[2] / 4));
//         sliceZ.mesh.name = "sliceZ";
//         scene.add(sliceZ.mesh);

//         //y plane
//         var sliceY = volume.extractSlice('y', Math.floor(volume.RASDimensions[1] / 2));
//         sliceY.mesh.name = "sliceY";
//         scene.add(sliceY.mesh);

//         // x plane
//         var sliceX = volume.extractSlice('x', Math.floor(volume.RASDimensions[0] / 2));
//         sliceX.mesh.name = "sliceX";
//         scene.add(sliceX.mesh);

//         // finally, we obtain the url of the canvas with the scene (renderer)
//         var renderer = container.childNodes[0];
//         rendererUrl = renderer.toDataURL();
//         return rendererUrl;
//     });
// }

// ////////////////////////// PLY
// function loadPLY(scene, camera, container, url) {
//     var rendererUrl;

//     // LOADER 
//     var loader = new THREE.PLYLoader();

//     loader.load(url, function (geometry) {
//         geometry.computeVertexNormals();

//         var material = new THREE.MeshLambertMaterial({
//             color: 0xffffff
//         });

//         var mesh = new THREE.Mesh(geometry, material);
//         mesh.name = "ply_mesh";
//         scene.add(mesh);

//         // we set the camera's position so that it is in the center 
//         // of the mesh (x and y coordinates), and a certain depth (z coordinate)
//         var box3 = new THREE.Box3().setFromObject(mesh);
//         var centerBox3 = box3.getCenter();
//         var sizeBox3 = box3.getSize();
//         //var widthBox3 = sizeBox3.x;
//         //var heightBox3 = sizeBox3.y;
//         var depthBox3 = sizeBox3.z;
//         camera.position.set(centerBox3.x, centerBox3.y, 3 * depthBox3);

//         // finally, we obtain the url of the canvas with the scene (renderer)
//         var renderer = container.childNodes[0];
//         rendererUrl = renderer.toDataURL();
//         return rendererUrl;
//     });
// }

// ////////////////////////// VTK
// function loadVTK(scene, camera, container, url) {
//     var rendererUrl;

//     var loader = new THREE.VTKLoader();

//     loader.load(url, function (geometry) {
//         geometry.computeVertexNormals();
//         geometry.normalizeNormals();

//         var material = new THREE.MeshLambertMaterial({
//             color: 0xffffff,
//             wireframe: false,
//             morphTargets: false,
//             side: THREE.DoubleSide,
//         });

//         var mesh = new THREE.Mesh(geometry, material);
//         mesh.name = "vtk_mesh";
//         scene.add(mesh);

//         // we set the camera's position so that it is in the center 
//         // of the mesh (x and y coordinates), and a certain depth (z coordinate)
//         var box3 = new THREE.Box3().setFromObject(mesh);
//         var centerBox3 = box3.getCenter();
//         var sizeBox3 = box3.getSize();
//         //var widthBox3 = sizeBox3.x;
//         //var heightBox3 = sizeBox3.y;
//         var depthBox3 = sizeBox3.z;
//         camera.position.set(centerBox3.x, centerBox3.y, 3 * depthBox3);

//         // finally, we obtain the url of the canvas with the scene (renderer)
//         var renderer = container.childNodes[0];
//         rendererUrl = renderer.toDataURL();
//         return rendererUrl;
//     });
// }