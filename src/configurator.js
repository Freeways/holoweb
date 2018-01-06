import { View } from './view';
import { GuessConfig, Coord2Canvas } from './utils/index';

/**
 * @constructs Configurator - Generate best fitting views for a giving reflection device and a monitor
 * @param {object} config - Configuration of the setup, {@link CONFIG|read more about configuration}
 * <pre>
 * +----+---------------------------------+----+
 * |    |__                          __|  |    |
 * |    |  |__                    __|     |    |
 * |    |     |__              __|        |    |
 * |    |        |__        __|           |    |
 * |    |           |______|              |    |
 * |    |             |    |              |    |
 * |    |             |____|__            |    |
 * |    |           __|       |__         |    |
 * |    |         __|            |__      |    |
 * |    |      __|                  |__   |    |
 * |    |   __|                        |__|    |
 * |    |  |                              |    |
 * +----+---------------------------------+----+
 * </pre>
 * @description monitor and views
 */
var Configurator = function (config) {
  this.config = GuessConfig(config);

  var offset = +!this.config.reverseVertical * 2 * Math.PI;
  this.step = (offset + Math.PI) / this.config.faces;
  
  // Initializing with dummy vlaues just for code consistency 
  this.bigDiagonal = 280;
  this.smallDiagonal = 70;
}

Object.assign(Configurator.prototype, {

  /**
   * @function generateViews 
   * @description Generate views for a giving monitor
   * @memberof Configurator
   * @param {object} monitor - Width and height of a selection
   * @returns {Array.<View>} Array of views
   */
  generateViews: function (monitor) {
    var optimium = this.calculateViewHeight(monitor),
      height = 2 * optimium + this.config.base,
      width = height,
      x = monitor.W / 2 - this.config.base / 2 - optimium,
      y = x + (monitor.H - monitor.W) / 2;
    this.bigDiagonal = Math.sqrt(2 * optimium * optimium);
    this.smallDiagonal = Math.sqrt(2 * (this.config.base / 2) * (this.config.base / 2));

    var views = [];
    for (var i = 0; i < this.config.faces; i++) {
      var cx = Math.round(Math.sin(i * 2 * this.step) * 100) / 100;
      var cy = Math.round(Math.cos(i * 2 * this.step) * 100) / 100;
      var parts = this.assignParts(i, monitor);
      var up = this.config.trueReflection ? [Math.abs(cx), cy, 0] : [cx, cy, 0];
      var eye = this.config.trueReflection ? [cy * 1800, 0, cx * 1800] : [0, 500, 1800];
      views.push(new View(x, y, width, height, up, eye, this.config.fov, parts));
    }
    return views;
  },

  /**
   * @function assignParts
   * @description Calculate view's parts
   * @memberof Configurator
   * @param {integer} index - index of the processed view
   * @param {object} monitor - Width and height of a selection
   * @returns {Array} Array of parts
   */
  assignParts: function (index, monitor) {
    if (!index)
      return [];
    var parts = [];
    for (var i = 0; i < this.config.precision; i++) {
      parts.push(
        Coord2Canvas(
          Math.sin((2 * index - 1) * this.step) * (i * this.bigDiagonal / this.config.precision + this.smallDiagonal) + monitor.W / 2,
          Math.cos((2 * index - 1) * this.step) * (i * this.bigDiagonal / this.config.precision + this.smallDiagonal) + monitor.H / 2,
          Math.sin((2 * index + 1) * this.step) * ((i + 1) * this.bigDiagonal / this.config.precision + this.smallDiagonal) + monitor.W / 2,
          Math.cos((2 * index + 1) * this.step) * ((i + 1) * this.bigDiagonal / this.config.precision + this.smallDiagonal) + monitor.H / 2
        )
      )
    }
    return parts;
  },

  /**
   * @function calculateViewHeight
   * @description Calculate the max posible height of a view from the available monitor and the reflexion device
   * @memberof Configurator
   * @param {object} monitor - Width and height of a selection
   * @returns {float} Height of view
   */
  calculateViewHeight: function (monitor) {
    var projected = this.config.height * Math.sin(this.config.angle * Math.PI / 180);
    var available = ((monitor.H * (monitor.H < monitor.W) || monitor.W) - this.config.base) / 2;
    return projected < available ? projected : available;
  }
})

export { Configurator };