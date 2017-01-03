var Detector = window.Detector = require("detector-webgl");
var THREE = window.THREE = require("three");
var collada = require('three-loaders-collada')(THREE);

window.document.addEventListener('DOMContentLoaded', function () {
    if (!Detector)
        return console.error("your browser does not support WebGL");
    var views, renderer;
    var mesh;
    var windowWidth, windowHeight;
    var views = [
        {
            left: 0,
            bottom: 0.25,
            width: 0.5,
            height: 0.5,
            eye: [0, 300, 1800],
            up: [1, 0, 0],
            fov: 60
        },
        {
            left: 0.25,
            bottom: 0,
            width: 0.5,
            height: 0.5,
            eye: [0, 300, 1800],
            up: [0, -1, 0],
            fov: 60
        },
        {
            left: 0.5,
            bottom: 0.25,
            width: 0.5,
            height: 0.5,
            eye: [0, 300, 1800],
            up: [-1, 0, 0],
            fov: 60
        },
        {
            left: 0.25,
            bottom: 0.5,
            width: 0.5,
            height: 0.5,
            eye: [0, 300, 1800],
            up: [0, 1, 0],
            fov: 60
        }
    ];
    var scene = new THREE.Scene();
    window.holoScene = scene;
    var container = window.document.body;
    init(container, scene);
    animate();
    function init(container, scene) {
        for (var i = 0; i < views.length; ++i) {
            var view = views[i];
            camera = new THREE.PerspectiveCamera(view.fov, window.innerWidth / window.innerHeight, 1, 10000);
            camera.position.x = view.eye[ 0 ];
            camera.position.y = view.eye[ 1 ];
            camera.position.z = view.eye[ 2 ];
            camera.up.x = view.up[ 0 ];
            camera.up.y = view.up[ 1 ];
            camera.up.z = view.up[ 2 ];
            view.camera = camera;
        }

        renderer = new THREE.WebGLRenderer({antialias: true});
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.setSize(window.innerWidth, window.innerHeight);
        container.appendChild(renderer.domElement);
    }
    function updateSize() {
        if (windowWidth != window.innerWidth || windowHeight != window.innerHeight) {
            windowWidth = window.innerWidth;
            windowHeight = window.innerHeight;
            renderer.setSize(windowWidth, windowHeight);
        }
    }
    function animate() {
        requestAnimationFrame(animate);
        render();
    }
    function render() {
        updateSize();
        for (var i = 0; i < views.length; ++i) {
            view = views[i];
            camera = view.camera;
            camera.lookAt(scene.position);
            var left = Math.floor(windowWidth * view.left);
            var bottom = Math.floor(windowHeight * view.bottom);
            var width = Math.floor(windowWidth * view.width);
            var height = Math.floor(windowHeight * view.height);
            renderer.setViewport(left, bottom, width, height);
            renderer.setScissor(left, bottom, width, height);
            renderer.setScissorTest(true);
            camera.aspect = width / height;
            camera.updateProjectionMatrix();
            renderer.render(scene, camera);
        }
    }
}, false);

// var W = window.innerWidth;
// var H = window.innerHeight;

// var defaultConfigs = {
// 	pyramid:{
// 		faces: 4,
// 		L: 600,
// 		B: 20,
// 		revert: 1
// 	}
// }

// var View = function(left, bottom, width, height, eye, up, fov){
// 	this.left = left || 0;
// 	this.bottom = bottom || 0;
// 	this.width = width || W;
// 	this.height = height || H;
// 	this.eye = eye || [ 0, 300, 1800 ];
// 	this.up = up || [ 1, 0, 0 ];
// 	this.fov = fov || 60;
// }

// function initViews(config){
// 	if(typeof(config) === "string"){
// 		if(!defaultConfigs["config"])
// 			return "Unrecognized config";
// 		config = defaultConfigs['config']
// 	}
// 	config.faces.forEach(function(face, index){

// 	})
// }



