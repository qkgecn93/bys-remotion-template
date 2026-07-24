import { Config } from "@remotion/cli/config";

// 不写死浏览器路径，保证工程可以在任何机器上打开
Config.setVideoImageFormat("jpeg");
Config.setOverwriteOutput(true);
