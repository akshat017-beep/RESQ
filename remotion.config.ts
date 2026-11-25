import { Config } from "@remotion/cli/config";

Config.setVideoImageFormat("jpeg");
Config.setOverwriteOutput(true);
// "angle" uses the GPU-less ANGLE backend so WebGL (three.js) works in headless rendering.
Config.setChromiumOpenGlRenderer("angle");
