var View = require('./view');

var configurate = function (config) {
    var configs = {
        pyramid: {
            faces: 4,
            reverseHorizental: 0,
            reverseVertical: 1,
            step: 90
        }
    }

    function conf2Views(config) {
        var H = config.heigh || 4;
        var W = config.width || 8;
        var b = config.base || 1;
        var a = config.angle || 45;
        var c = {};//curent config
        var views = [];
        if (!config.model && !config.setup)
            config.model = "pyramid";
        if (!config.setup) {
            c = configs[config.model] ? configs[config.model] : configs.pyramid;
            console.warn('The Configuration `' + config.model + '` was not found, defaulting to Pyramid display.');
        } else {
            c = config.setup;
        }
        
        for(var i = 0; i < c.faces; i++){
            left = 0;
            bottom = 0;
            up = [1, 0, 0];
            width = W;
            height = H;
            eye = [0, 300, 1800];
            fov = 60;
            views.push(new View(left, bottom, up, width, height, eye, fov));
        }
    }
}