const THREE = require("three");
const nodeGles = require("node-gles");


const gl = nodeGles.binding.createWebGLRenderingContext();


const width = 128;
const height = 128;
const canvas = {
    style: {
        width: width,
        height: height,
    },
    addEventListener: () => {}
}

var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera( 75, width/height, 0.1, 1000 );

var renderer = new THREE.WebGLRenderer({context: gl, canvas: canvas, preserveDrawingBuffer: true} );
renderer.setSize( width, height );
//document.body.appendChild( renderer.domElement );

var geometry = new THREE.BoxGeometry( 30, 30, 30 );
var material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
var cube = new THREE.Mesh( geometry, material );
scene.add( cube );

camera.position.z = 5;

renderer.autoClear = false;

let count = 0;
var animate = function () {
    if(count++ < 10)
        setImmediate( animate );

    cube.rotation.x += 0.01;
    cube.rotation.y += 0.01;

    renderer.render( scene, camera );
    
    const pixels = new Uint8Array(width * height * 4);
    gl.readPixels(0, 0, width, height, gl.RGBA, gl.UNSIGNED_BYTE, pixels);

    
    //saveAsPNG(String(count) + ".png", pixels);

};


var fs = require('fs'),
    PNG = require('pngjs').PNG;
function saveAsPNG(path, pixels) {
    var png = new PNG({
        width: width,
        height: height,
        filterType: -1
    });
    
    for (var y = 0; y < png.height; y++) {
        for (var x = 0; x < png.width; x++) {
            
            var idx = (png.width * y + x) << 2;
            png.data[idx  ] = pixels[idx];
            png.data[idx+1] = pixels[idx+1];
            png.data[idx+2] = pixels[idx+2];
            png.data[idx+3] = pixels[idx+3];
            if(pixels[idx] > 0 )
                console.log(idx, pixels[idx])
        }
    }
    
    png.pack().pipe(fs.createWriteStream(path));
}


animate();