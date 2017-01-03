var View = function (left, bottom, up, width, height, eye, fov) {
    this.left = left || 0;
    this.bottom = bottom || 0;
    this.up = up || [1, 0, 0];
    this.width = width || 0;
    this.height = height || 0;
    this.eye = eye || [0, 300, 1800];
    this.fov = fov || 60;
}

module.exports = View;