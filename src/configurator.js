import { View } from './view';
import { GuessConfig, Coord2Canvas } from './utils/check';

/**
 * @constructs Configurator - Generate best fitting views for a giving reflection device and a monitor
 * @param {object} config - Configuration of the setup, {@link check|read more about configuration}
 * @description monitor and views
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
 * @returns {Array.<View>} - {@link view|read more about Views}
 */
var Configurator = function (config) {
  this.config = GuessConfig(config);

  this.step = Math.PI / this.config.faces;
  /**
   * @todo initialise diagonals with dummy values for code constentancy
   */

}

Object.assign(Configurator.prototype, {
  
  /**
   * 
   */
  generateViews: function (monitor) {
    var pSide = this.config.height * Math.sin(this.config.angle * Math.PI / 180),
      mSide = ((monitor.H * (monitor.H < monitor.W) || monitor.W) - this.config.base) / 2,
      optimium = pSide < mSide ? pSide : mSide,
      height = 2 * optimium + this.config.base,
      width = height,
      x = monitor.W / 2 - this.config.base / 2 - optimium,
      y = monitor.H / 2 - this.config.base / 2 - optimium;
    this.bigDiagonal = Math.sqrt((optimium * optimium) + (optimium * optimium));
    this.smallDiagonal = Math.sqrt((this.config.base / 2) * (this.config.base / 2) + (this.config.base / 2) * (this.config.base / 2));

    var views = [];
    for (var i = 0; i < this.config.faces; i++) {
      var cx = Math.round(Math.sin(i * 2 * this.step) * 100) / 100;
      var cy = Math.round(Math.cos(i * 2 * this.step) * 100) / 100;
      var parts = this.assignParts(i, monitor);
      var up = [], eye = [];
      if (this.config.trueReflection) {
        up = [-cx, cy, 0];
        eye = [cy * 1800, 0, cx * 1800];
      } else {
        up = [-cx, cy, 0];
        eye = [0, 500, 1800];
      }
      var fov = 60;
      views.push(new View(x, y, width, height, up, eye, fov, parts));
    }
    return views;
  },

  /**
   * 
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
  }
})

export { Configurator };