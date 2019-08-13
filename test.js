const nodeGles = require("node-gles");
const gl = nodeGles.binding.createWebGLRenderingContext();
var program = gl.createProgram();
const width = 256;
const height = 256;

const vs = `// Vertex Shader
attribute vec4 aVertexPosition;
void main() {
  gl_Position = aVertexPosition;
}`

const fs = `// Fragment shader
void main() {
  gl_FragColor = vec4(1.);
}`

function loadShader(gl, type, source) {
    const shader = gl.createShader(type);  
    gl.shaderSource(shader, source);  
    gl.compileShader(shader);  
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      gl.deleteShader(shader);
      return null;
    }
    return shader;
}

gl.attachShader(program, loadShader(gl, gl.VERTEX_SHADER, vs));
gl.attachShader(program, loadShader(gl, gl.FRAGMENT_SHADER, fs));
gl.linkProgram(program);

if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    console.error('Unable to initialize the shader program: ' + gl.getProgramInfoLog(program));
}

const positionLocation = gl.getAttribLocation(program, 'aVertexPosition');

const positionBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
const positions = [
  -1.0,  1.0,
   1.0,  1.0,
  -1.0, -1.0,
   1.0, -1.0,
];
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);
gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);
gl.enableVertexAttribArray(positionLocation);
gl.useProgram(program);
gl.viewport(0,0,width, height);

gl.clearColor(0.3, 0.3, 0.3, 1.0);  // Clear to black, fully opaque
gl.clearDepth(1.0);                 // Clear everything
gl.enable(gl.DEPTH_TEST);           // Enable depth testing
gl.depthFunc(gl.LEQUAL);            // Near things obscure far things

// Clear the canvas before we start drawing on it.

gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);


const pixels = new Uint8Array(width * height * 4);
gl.readPixels(0, 0, width, height, gl.RGBA, gl.UNSIGNED_BYTE, pixels);

for(var i = 0; i < pixels.length; i++) {
  if (pixels[i] > 0) {
    console.log(i, pixels[i], pixels.length)
  }
}
