import { View } from './view';
import { GuessConfig, Coord2Canvas } from './utils/check';

/**
 * @function configurator - Generate best fitting views for a giving reflection device and a monitor
 * @param {object} config - Configuration of the setup, {@link check|read more about configuration}
 * @param {object} monitor - Width and height of the monitor
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
var configurator = function (config, monitor) {
  var config = GuessConfig(config, monitor);
  console.log(config)
  var views = [];

  var step = Math.PI / config.faces,
      pSide = config.height * Math.sin(config.angle * Math.PI / 180),
      mSide = ((monitor.H * (monitor.H < monitor.W) || monitor.W) - config.base) / 2,
      optimium = pSide < mSide ? pSide : mSide,
      height = 2 * optimium + config.base,
      width = height,
      x = monitor.W / 2 - config.base / 2 - optimium,
      y = monitor.H / 2 - config.base / 2 - optimium,
      diagOp = Math.sqrt((optimium * optimium) + (optimium * optimium)),
      diagBase = Math.sqrt((config.base / 2) * (config.base / 2) + (config.base / 2) * (config.base / 2));
  
  for (var i = 0; i < config.faces; i++) {
    var parts = [];
    var cx = Math.round(Math.sin(i * 2 * step) * 100) / 100;
    var cy = Math.round(Math.cos(i * 2 * step) * 100) / 100;
    for (var j = 0; j < config.precision; j++) {
      parts.push(
          Coord2Canvas(
              Math.sin((2 * i - 1) * step) * (j * diagOp / config.precision + diagBase) + monitor.W / 2,
              Math.cos((2 * i - 1) * step) * (j * diagOp / config.precision + diagBase) + monitor.H / 2,
              Math.sin((2 * i + 1) * step) * ((j + 1) * diagOp / config.precision + diagBase) + monitor.W / 2,
              Math.cos((2 * i + 1) * step) * ((j + 1) * diagOp / config.precision + diagBase) + monitor.H / 2
              )
          )
    }
    var up = [], eye = [];
    if (config.trueReflection) {
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