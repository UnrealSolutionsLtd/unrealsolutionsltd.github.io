import { Config } from '@remotion/cli/config';

Config.setVideoImageFormat('jpeg');
Config.setOverwriteOutput(true);
// Encode a web-friendly, broadly-compatible H.264 MP4.
Config.setPixelFormat('yuv420p');
