/**
 * @constructs View - A View is mini configuration of both a camera position/rotation and a protion of the area of the canvas,
 * where the captured projection by that camera of the scene will be rendered.
 * @param {float} x - The position within the X axis of the initial point of the bbox - defaults to 0.
 * @param {float} y - The position within the Y axis of the initial point of the bbox - defaults to 0.
 * @param {float} width - The width of the bbox.
 * @param {float} height - The height of the bbox.
 * @param {Array} up - An ordered triplet of integers - the rotation of the camera.
 * @param {Array} eye - An ordered triplet of integers - the position of the camera.
 * @param {float} fov - Camera frustum vertical field of view.
 * @param {Array} parts - Smaller rectangular portions within the bbox.
 */

var View = function (x, y, width, height, up, eye, fov, parts) {
  this.x = x || 0;
  this.y = y || 0;
  this.up = up || [1, 0, 0];
  this.width = width || 0;
  this.height = height || 0;
  this.eye = eye || [0, 300, 1800];
  this.fov = fov || 60;
  this.parts = parts || [];
}
export { View };