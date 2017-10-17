var View = function (x, y, up, width, height, eye, fov, parts) {
  this.x = x || 0;
  this.y = y || 0;
  this.up = up || [1, 0, 0];
  this.width = width || 0;
  this.height = height || 0;
  this.eye = eye || [0, 300, 1800];
  this.fov = fov || 60;
  this.parts = parts || [];
}
module.exports = View;