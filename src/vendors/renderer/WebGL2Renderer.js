/**
 * @author mrdoob / http://mrdoob.com/
 */

function WebGLExtensions( gl ) {

    var extensions = {};

    return {

        get: function ( name ) {

            if ( extensions[ name ] !== undefined ) {

                return extensions[ name ];

            }

            var extension;

            switch ( name ) {

                case 'WEBGL_depth_texture':
                    extension = gl.getExtension( 'WEBGL_depth_texture' ) || gl.getExtension( 'MOZ_WEBGL_depth_texture' ) || gl.getExtension( 'WEBKIT_WEBGL_depth_texture' );
                    break;

                case 'EXT_texture_filter_anisotropic':
                    extension = gl.getExtension( 'EXT_texture_filter_anisotropic' ) || gl.getExtension( 'MOZ_EXT_texture_filter_anisotropic' ) || gl.getExtension( 'WEBKIT_EXT_texture_filter_anisotropic' );
                    break;

                case 'WEBGL_compressed_texture_s3tc':
                    extension = gl.getExtension( 'WEBGL_compressed_texture_s3tc' ) || gl.getExtension( 'MOZ_WEBGL_compressed_texture_s3tc' ) || gl.getExtension( 'WEBKIT_WEBGL_compressed_texture_s3tc' );
                    break;

                case 'WEBGL_compressed_texture_pvrtc':
                    extension = gl.getExtension( 'WEBGL_compressed_texture_pvrtc' ) || gl.getExtension( 'WEBKIT_WEBGL_compressed_texture_pvrtc' );
                    break;

                case 'WEBGL_compressed_texture_etc1':
                    extension = gl.getExtension( 'WEBGL_compressed_texture_etc1' );
                    break;

                default:
                    extension = gl.getExtension( name );

            }

            if ( extension === null ) {

                console.warn( 'THREE.WebGLRenderer: ' + name + ' extension not supported.' );

            }

            extensions[ name ] = extension;

            return extension;

        }

    };

}

module.exports = function(THREE){
    WebGLState = require('./webgl/WebGLState')(THREE);
    THREE.WebGL2Renderer = function( parameters ) {

        console.log( 'THREE.WebGL2Renderer', THREE.REVISION );

        parameters = parameters || {};

        var _canvas = parameters.canvas !== undefined ? parameters.canvas : document.createElementNS( 'http://www.w3.org/1999/xhtml', 'canvas' ),
        _context = parameters.context !== undefined ? parameters.context : null,

        _alpha = parameters.alpha !== undefined ? parameters.alpha : false,
        _depth = parameters.depth !== undefined ? parameters.depth : true,
        _stencil = parameters.stencil !== undefined ? parameters.stencil : true,
        _antialias = parameters.antialias !== undefined ? parameters.antialias : false,
        _premultipliedAlpha = parameters.premultipliedAlpha !== undefined ? parameters.premultipliedAlpha : true,
        _preserveDrawingBuffer = parameters.preserveDrawingBuffer !== undefined ? parameters.preserveDrawingBuffer : false;

        // initialize

        var gl;

        try {

            var attributes = {
                alpha: _alpha,
                depth: _depth,
                stencil: _stencil,
                antialias: _antialias,
                premultipliedAlpha: _premultipliedAlpha,
                preserveDrawingBuffer: _preserveDrawingBuffer
            };

            gl = _context || _canvas.getContext( 'webgl2', attributes );

            if ( gl === null ) {

                if ( _canvas.getContext( 'webgl2' ) !== null ) {

                    throw 'Error creating WebGL2 context with your selected attributes.';

                } else {

                    throw 'Error creating WebGL2 context.';

                }

            }

            _canvas.addEventListener( 'webglcontextlost', onContextLost, false );

        } catch ( error ) {

            console.error( 'THREE.WebGL2Renderer: ' + error );

        }

        //

        var _this = this,

            _autoClear = true,
            _autoClearColor = true,
            _autoClearDepth = true,
            _autoClearStencil = true,

            _clearColor = new THREE.Color( 0x000000 ),
            _clearAlpha = 0,

            _width = _canvas.width,
            _height = _canvas.height,

            _pixelRatio = 1,

            _viewport = new THREE.Vector4( 0, 0, _width, _height );

        var extensions = WebGLExtensions( gl );
        var state = new THREE.WebGLState( gl, extensions, function () {} );

        //

        function clear( color, depth, stencil ) {

            var bits = 0;

            if ( color === undefined || color ) bits |= gl.COLOR_BUFFER_BIT;
            if ( depth === undefined || depth ) bits |= gl.DEPTH_BUFFER_BIT;
            if ( stencil === undefined || stencil ) bits |= gl.STENCIL_BUFFER_BIT;

            gl.clear( bits );

        }

        function setPixelRatio( value ) {

            if ( value === undefined ) return;

            _pixelRatio = value;

            setSize( _viewport.z, _viewport.w, false );

        }

        function setSize( width, height, updateStyle ) {

            _width = width;
            _height = height;

            _canvas.width = width * _pixelRatio;
            _canvas.height = height * _pixelRatio;

            if ( updateStyle !== false ) {

                _canvas.style.width = width + 'px';
                _canvas.style.height = height + 'px';

            }

            setViewport( 0, 0, width, height );

        }

        function setViewport( x, y, width, height ) {

            state.viewport( _viewport.set( x, y, width, height ) );

        }

        function render( scene, camera ) {

            if ( camera !== undefined && camera.isCamera !== true ) {

                console.error( 'THREE.WebGL2Renderer.render: camera is not an instance of THREE.Camera.' );
                return;

            }

            var background = scene.background;
            var forceClear = false;

            if ( background === null ) {

                state.buffers.color.setClear( _clearColor.r, _clearColor.g, _clearColor.b, _clearAlpha, _premultipliedAlpha );

            } else if ( background && background.isColor ) {

                state.buffers.color.setClear( background.r, background.g, background.b, 1, _premultipliedAlpha );
                forceClear = true;

            }

            if ( _autoClear || forceClear ) {

                this.clear( _autoClearColor, _autoClearDepth, _autoClearStencil );

            }

        }

        function onContextLost( event ) {

            event.preventDefault();

        }

        return {
            domElement: _canvas,

            clear: clear,
            setPixelRatio: setPixelRatio,
            setSize: setSize,
            render: render
        }

    }
}