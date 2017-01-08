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
    var c = {};//curent config
    var views = [];
    if (!config) config = {model: "pyramid"};
    if (!config.model && !config.setup)
        config.model = "pyramid";
    if (!config.setup) {
        c = configs[config.model] ? configs[config.model] : configs.pyramid;
        console.warn('The Configuration `' + config.model + '` was not found, defaulting to Pyramid display.');
    } else {
        c = config.setup;
    }
    
    var step = 2 * Math.PI / c.faces;
    var deg2rad = Math.PI / 180;
    var h = c.height || 400;
    var w = c.width || 800;//unused
    var b = c.base || 100;
    var a = c.angle || 45;
    var H = monitor.H || 600;
    var W = monitor.W ||800;

    for (var i = 0; i < c.faces; i++) {
        height = width = h * Math.sin(a * deg2rad);
        cx = Math.round(Math.cos(i * step)*100)/100;
        cy = Math.round(Math.sin(i * step)*100)/100;
        x = W/2 - cx * b/2 - width/2 - cx * width/2;
        y = H/2 + cy * b/2 - height/2 + cy * height/2;
        x = x / W;
        y = y / H;
        height = height / H;
        width = width / W;
        up = [cx, cy, 0];
        eye = [0, 300, 1800];
        fov = 60;
        views.push(new View(x, y, up, width, height, eye, fov));
    }
    return views;
}
module.exports = configurator;