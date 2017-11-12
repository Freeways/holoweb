/**
 * This config provide a way of describing your displaying/reflection device.
 * There is no standard device config but the most used is the pyramid 
 * ({@link https://www.youtube.com/watch?v=YfzEwI6nAMM|make your own}),
 * the lib will try to use the configuration provided in the constructor but may fallback
 * to the default pyramid or some of the pyramid propreity if needed.
 * 
 * A valid Config can be:
 * - a `string` e.g. "pyramid" which design a name of a preset configuration
 * - an object containing some or all of the config props, the props will overrides the attributes
 * of the default pyramid. If the object contain an attribute model then the props will overrides
 * that model instead.
 * - a `function` in case more indepth customizations is needed
 * 
 * @namespace
 * @constant {object} CONFIG - Presets of common configurations
 * @property {object} model - A preset of a config
 * @property {integer} model.faces - number of faces of the display device
 * @property {boolean} model.trueReflection - if true displays the rear, left, front and right side on each
 * respective face, displays same rendering otherwise.
 * @property {boolean} model.reverseVertical - if true displays the rendering upside down
 * @property {float} model.height - height of the display device
 * @property {float} model.base - the width of the smalles suqare of the pyramid
 * @property {float} model.angle - degree angle between a face and the plateform
 * @property {integer} model.precision - how offen the views is sliced to parts, the more parts you have
 * the sharper rendering area is provided and the least performent.
 * @todo Add more common configurations
 */
var CONFIG = {
  pyramid: {
    faces: 4,
    trueReflection: 0,
    reverseVertical: 1,
    height: 400,
    base: 100,
    angle: 45,
    precision: 8
  }
};

/**
 * @function SupportWebGL
 * @description Detect either or not the runtime support WebGL
 * @returns {boolean}
 */
var SupportWebGL = function () {
  var canvas = window.document.createElement('canvas');
  var ctx = canvas.getContext('webgl2');
  var isWebGL2 = !!ctx;
  if (isWebGL2)
    return true;
  else
    ctx = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
  if (!ctx)
    return false;
  return true;
}

/**
 * @function GuessConfig
 * @description Try to understand the configuration
 * @param {object} config - A configuration 
 * @returns {object} Valid configuration
 */
var GuessConfig = function (config) {
  if (!config) {
    console.warn('The Configuration was not found, defaulting to pyramid display.');
    return CONFIG.pyramid;
  }

  if (typeof config === "string") {
    if (!CONFIG[config]) {
      console.warn('The Configuration `' + config + '` was not found, defaulting to pyramid display.');
      return CONFIG.pyramid;
    } else {
      console.info('Using `' + config +'` configuration!');
      return CONFIG[config];
    }
  }

  if (typeof config === "object") {
    var c = {};
    if (!config.model) {
      c = CONFIG.pyramid;
    } else {
      if(!CONFIG[config.model]) {
        console.warn('The Configuration model `' + config.model + '` was not found, defaulting to pyramid display.');
        c = CONFIG.pyramid;
      }else {
        c = CONFIG[config.model];
      }
    }
    for (var key in c) {
      c[key] = config[key] ? config[key] : c[key];
    }
    return c;
  }

  /**
   * @todo function.call returns views
   */
  if (typeof config === "function")
    return config();
}

/**
 * WebGL dosen't allow rendering on a negative width or height area.
 * @function coord2canvas
 * @description Trasforms 2 boundary points (opposit corners) a renderable area.
 * @param {float} x1 - Boundry 1 position within the X axis
 * @param {float} y1 - Boundry 1 position within the Y axis
 * @param {float} x2 - Boundry 2 position within the X axis
 * @param {float} y2 - Boundry 2 position within the Y axis
 * @returns {Array} top left point, width and height
 */
function Coord2Canvas(x1, y1, x2, y2) {
  var w = x2 - x1;
  var h = y2 - y1;
  if (w > 0) {
    x2 = w;
  } else {
    x1 = x2;
    x2 = -w;
  }
  if (h > 0) {
    y2 = h;
  } else {
    y1 = y2;
    y2 = -h;
  }
  return [Math.floor(x1), Math.floor(y1), Math.ceil(x2), Math.ceil(y2)];
}
export { SupportWebGL, GuessConfig, Coord2Canvas };
