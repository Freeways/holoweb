var configurator = require('./configurator');
var THREE = window.THREE = require("three");
require('./vendors/renderer/WebGL2Renderer')(THREE);
var collada = require('three-loaders-collada')(THREE);
var animation = require('./vendors/loaders/collada/Animation')(THREE);
var KeyFrameAnimation = require('./vendors/loaders/collada/KeyFrameAnimation')(THREE);
var W = window.innerWidth;
var H = window.innerHeight;

var canvas = document.createElement('canvas');
var ctx = canvas.getContext('webgl2');
var isWebGL2 = !!ctx;
if (!isWebGL2)
  ctx = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
delete canvas;

var HoloWeb = function (selector, config) {
  this.selector = selector || window.document.body;
  this.config = config;
  if (!ctx) {
    return console.error("your browser does not support WebGL");
  }

  var renderer;
  var windowWidth, windowHeight;
  var views = configurator(this.config, {H: H, W: W});
  var scene = new THREE.Scene();
  this.scene = scene;
  init(this.selector);
  animate();

  this.add = function (mesh) {
    return this.scene.add(mesh);
  }
  this.remove = function (mesh) {
    return this.scene.remove(mesh);
  }

  function init(container) {
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
    //if (!isWebGL2){
    //    console.warn('WebGl2 not supported, using WebGL.');
    renderer = new THREE.WebGLRenderer({antialias: true});
    //}else{
    //    var WebGL2Renderer = require('./vendors/renderer/WebGL2Renderer')(THREE);
    //    console.log('WebGl2 selected!');
    //	renderer = new THREE.WebGL2Renderer();
    //}
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(W, H);
    container.appendChild(renderer.domElement);
  }
  function updateSize() {
    if (windowWidth != W || windowHeight != H) {
      windowWidth = W;
      windowHeight = H;
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
      var x = Math.floor(windowWidth * view.x);
      var y = Math.floor(windowHeight * view.y);
      var width = Math.floor(windowWidth * view.width);
      var height = Math.floor(windowHeight * view.height);
      renderer.setViewport(x, y, width, height);
      renderer.setScissor(x, y, width, height);
      renderer.setScissorTest(true);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.render(scene, camera);
    }
  }
}
module.exports = HoloWeb;
