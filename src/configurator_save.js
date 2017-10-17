var View = require('./view');
var configs = {
  pyramid: {
    faces: 4,
    reverseHorizental: 0,
    reverseVertical: 1,
    height: 400,
    width: 800,
    base: 100,
    angle: 45
  }
}
var configurator = function (config, monitor) {
  if (typeof config === "function")
    return config(monitor);
  var c = {};//curent config
  var views = [];
  if (!config) {
    config = {model: "pyramid"};
    console.warn('The Configuration was not found, defaulting to Pyramid display.');
  }
  if (!config.setup) {
    if (!configs[config.model]) {
      config = {model: "pyramid"};
      console.warn('The Configuration `' + config.model + '` was not found, defaulting to Pyramid display.');
    }
    c = configs[config.model];
  } else {
    for (var key in config.setup) {
      c[key] = config.setup[key];
    }
  }

  var step = 2 * Math.PI / c.faces;
  var deg2rad = Math.PI / 180;
  var h = c.height;
  var w = c.width;//unused
  var b = c.base;
  var a = c.angle;
  var H = monitor.H || 600;
  var W = monitor.W || 800;

  for (var i = 0; i < c.faces; i++) {
    pSide = h * Math.sin(a * deg2rad);
    mSide = ((H * (H < W) || W) - b) / 2;
    height = width = pSide < mSide ? pSide : mSide;
    cx = Math.round(Math.cos(i * step) * 100) / 100;
    cy = Math.round(Math.sin(i * step) * 100) / 100;
    x = W / 2 - cx * b / 2 - width / 2 - cx * width / 2;
    y = H / 2 + cy * b / 2 - height / 2 + cy * height / 2;
    x = x / W;
    y = y / H;
    height = height / H;
    width = width / W;
    if (c.reverseHorizental) {
      up = [1, cy, 0];
      eye = [cy * 1800, 0, cx * 1800];
    } else {
      up = [cx, cy, 0];
      eye = [0, 0, 1800];
    }
    fov = 60;
    views.push(new View(x, y, up, width, height, eye, fov));
  }
  return views;
}
module.exports = configurator;
