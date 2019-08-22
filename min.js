const nodeGles = require("node-gles");
const gl = nodeGles.createWebGLRenderingContext({
    width: 1280,
    height: 720,
    majorVersion: 3,
    minorVersion: 0
});

gl.nvencInit();
gl.nvencBindBuffer();
gl.nvencEncode();
