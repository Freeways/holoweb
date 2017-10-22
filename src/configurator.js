import { View } from './view';
var configs = {
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
function coord2canvas(x1, y1, x2, y2) {
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
var configurator = function (config, monitor) {
  if (typeof config === "function")
    return config(monitor);
  var c = {};
  var views = [];
  if (!config) {
    config = {model: "pyramid"};
    console.warn('The Configuration was not found, defaulting to pyramid display.');
  }
  if (!config.setup) {
    if (!configs[config.model]) {
      config = {model: "pyramid"};
      console.warn('The Configuration `' + config.model + '` was not found, defaulting to pyramid display.');
    }
    c = configs[config.model];
  } else {
    for (var key in config.setup) {
      c[key] = config.setup[key];
    }
  }

  var step = Math.PI / c.faces,
      pSide = c.height * Math.sin(c.angle * Math.PI / 180),
      mSide = ((monitor.H * (monitor.H < monitor.W) || monitor.W) - c.base) / 2,
      optimium = pSide < mSide ? pSide : mSide,
      height = 2 * optimium + c.base,
      width = height,
      x = monitor.W / 2 - c.base / 2 - optimium,
      y = monitor.H / 2 - c.base / 2 - optimium,
      diagOp = Math.sqrt((optimium * optimium) + (optimium * optimium)),
      diagBase = Math.sqrt((c.base / 2) * (c.base / 2) + (c.base / 2) * (c.base / 2));
  
  for (var i = 0; i < c.faces; i++) {
    var parts = [];
    var cx = Math.round(Math.sin(i * 2 * step) * 100) / 100;
    var cy = Math.round(Math.cos(i * 2 * step) * 100) / 100;
    for (var j = 0; j < c.precision; j++) {
      parts.push(
          coord2canvas(
              Math.sin((2 * i - 1) * step) * (j * diagOp / c.precision + diagBase) + monitor.W / 2,
              Math.cos((2 * i - 1) * step) * (j * diagOp / c.precision + diagBase) + monitor.H / 2,
              Math.sin((2 * i + 1) * step) * ((j + 1) * diagOp / c.precision + diagBase) + monitor.W / 2,
              Math.cos((2 * i + 1) * step) * ((j + 1) * diagOp / c.precision + diagBase) + monitor.H / 2
              )
          )
    }
    var up = [], eye = [];
    if (c.trueReflection) {
      up = [-cx, cy, 0];
      eye = [cy * 1800, 0, cx * 1800];
    } else {
      up = [-cx, cy, 0];
      eye = [0, 500, 1800];
    }
    var fov = 60;
    views.push(new View(x, y, up, width, height, eye, fov, parts));
  }
  return views;
}
export { configurator };