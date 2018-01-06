import { Configurator } from './configurator';
import { Scene, PerspectiveCamera, WebGLRenderer } from 'three';
import { SupportWebGL } from './utils/index';


/**
 * Holoweb is the main prototype.
 * @constructs Holoweb - Scene camera and views for rendering
 * @param {HTMLElement} selector - The DOM element where the canvas will be rendered
 * @param {object} config - Configuration of the setup, {@link CONFIG|read more about configuration} 
 */


var HoloWeb = function (selector, config) {
  if (!SupportWebGL())
    return console.error("your browser does not support WebGL");

  this.selector = selector instanceof Element ? selector : window.document.body;
  this.config = config;

  var H = this.selector.clientHeight;
  var W = this.selector.clientWidth;
  var renderer;
  var configurator = new Configurator(this.config);
  var views = configurator.generateViews({ W: this.selector.clientWidth, H: this.selector.clientHeight }); console.log(views)
  var scene = new Scene();
  this.scene = scene;
  init(this.selector);
  renderer.setSize(this.selector.clientWidth, this.selector.clientHeight);
  animate();

  function init(container) {
    function resizeCanvas() {
      views = configurator.generateViews({ W: container.clientWidth, H: container.clientHeight });
      setupCamera();
      renderer.setSize(container.clientWidth, container.clientHeight);
    }
    setupCamera();
    renderer = new WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(container.clientWidth, container.clientHeight);
    container.appendChild(renderer.domElement);
    window.onresize = resizeCanvas;
  }

  function setupCamera() {
    for (var i = 0; i < views.length; ++i) {
      var view = views[i];
      var camera = new PerspectiveCamera(view.fov, window.innerWidth / window.innerHeight, 1, 10000);
      camera.position.set(view.eye[0], view.eye[1], view.eye[2]);
      camera.up.set(view.up[0], view.up[1], view.up[2]);
      view.camera = camera;
    }
  }

  function animate() {
    requestAnimationFrame(animate);
    render();
  }
  function render() {
    for (var i = 0; i < views.length; ++i) {
      var view = views[i];
      var camera = view.camera;
      camera.lookAt(scene.position);
      renderer.setViewport(view.x, view.y, view.width, view.height);
      camera.aspect = 1;
      camera.updateProjectionMatrix();
      if (i === 0) {
        renderer.setScissor(view.x, view.y, view.width, view.height);
        renderer.setScissorTest(true);
        renderer.render(scene, camera);
      } else {
        view.parts.forEach(function (part) {
          renderer.setScissor(Math.floor(part[0]), Math.floor(part[1]), Math.ceil(part[2]), Math.ceil(part[3]));
          renderer.setScissorTest(true);
          renderer.render(scene, camera);
        });
      }
    }
  }
}

Object.assign(HoloWeb.prototype, {

  /**
  * @function add 
  * @description Adds an Object to the scene 
  * @memberof Holoweb
  * @param {THREE.Object3D} obj - Three Object3D
  * @returns {THREE.Scene}
  */
  add: function (obj) {
    return this.scene.add(obj);
  },

  /**
  * @function remove 
  * @description Removes an Object from the scene 
  * @memberof Holoweb
  * @param {THREE.Object3D} obj - Three Object3D
  * @returns {THREE.Object3D}
  */
  remove: function (obj) {
    this.scene.remove(obj);
    return obj;
  },

  /**
  * @function clear 
  * @description Removes all Objects from the scene 
  * @memberof Holoweb
  */
  clear: function () {
    var that = this;
    that.scene.children.forEach(function (object) {
      that.remove(object);
    });
  }
})

export { HoloWeb };
