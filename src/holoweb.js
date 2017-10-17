var configurator = require('./configurator');
var THREE = window.THREE = require("three");
var collada = require('three-loaders-collada')(THREE);
var animation = require('./vendors/loaders/collada/Animation')(THREE);
var KeyFrameAnimation = require('./vendors/loaders/collada/KeyFrameAnimation')(THREE);

var canvas = document.createElement('canvas');
var ctx = canvas.getContext('webgl2');
var isWebGL2 = !!ctx;
if (!isWebGL2)
  ctx = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
delete canvas;

var HoloWeb = function (selector, config) {
  this.selector = selector || window.document.body;
  var W = this.selector.clientWidth;
  var H = this.selector.clientHeight;

  this.config = config;
  if (!ctx) {
    return console.error("your browser does not support WebGL");
  }

  var renderer;
  var views = configurator(this.config, {H: H, W: W});
  var scene = new THREE.Scene();
  this.scene = scene;
  init(this.selector);
  renderer.setSize(W, H);
  animate();

  this.add = function (mesh) {
    return this.scene.add(mesh);
  }
  this.remove = function (mesh) {
    return this.scene.remove(mesh);
  }
  this.clear = function () {
    that = this;
    that.scene.children.forEach(function (object) {
      that.remove(object);
    });
  }

  function init(container) {
    function resizeCanvas() {
      W = container.clientWidth;
      H = container.clientHeight;
      views = configurator(this.config, {H: H, W: W});
      setupCamera();
      renderer.setSize(W, H);
    }
    setupCamera();
    renderer = new THREE.WebGLRenderer({antialias: true});
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(W, H);
    container.appendChild(renderer.domElement);
    window.onresize = resizeCanvas;
  }
  function setupCamera() {
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
  }
  function animate() {
    requestAnimationFrame(animate);
    render();
  }
  function render() {
    for (var i = 0; i < views.length; ++i) {
      view = views[i];
      camera = view.camera;
      camera.lookAt(scene.position);
      //renderer.setClearColor(4304 + 4190000 * i, 0.5);
      renderer.setViewport(view.x, view.y, view.width, view.height);
      camera.aspect = 1;
      camera.updateProjectionMatrix();
      if (i === 0) {
        renderer.setScissor(view.x, view.y, view.width, view.height);
        renderer.setScissorTest(true);
        renderer.render(scene, camera);
      }
      else
        view.parts.forEach(function (part) {
          renderer.setScissor(Math.floor(part[0]), Math.floor(part[1]), Math.ceil(part[2]), Math.ceil(part[3]));
          renderer.setScissorTest(true);
          renderer.render(scene, camera);
        });
    }
  }
}
module.exports = HoloWeb;
