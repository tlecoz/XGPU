import { HelloTriangle_inline } from "./samples/basics/HelloTriangle_inline";
import { HelloTriangle_buffer } from "./samples/basics/HelloTriangle_buffer";
import { HelloTriangle_buffer_shorter } from "./samples/basics/HelloTriangle_buffer_shorter";
import { HelloTriangle_inline_shorter } from "./samples/basics/HelloTriangle_inline_shorter";
import { HelloTriangle_uniform } from "./samples/basics/HelloTriangle_uniform";
import { HelloTriangle_uniform_shorter } from "./samples/basics/HelloTriangle_uniform_shorter";
import { HelloTriangle_raw } from "./samples/basics/HelloTriangle_raw";
import { MouseTrailerSample } from "./samples/basics/mouseTrailer/MouseTrailerSample";
import { MouseTrailerSample2 } from "./samples/basics/mouseTrailer/MouseTrailerSample2";
import { MouseTrailerSample3 } from "./samples/basics/mouseTrailer/MouseTrailerSample3";
import { RotatingCubeSample } from "./samples/basics/cube/RotatingCubeSample";
import { SoundSpectrumSample } from "./samples/basics/soundSpectrum/SoundSpectrumSample";


const canvas = document.createElement("canvas");
canvas.width = 512;
canvas.height = 512;

//new HelloTriangle_inline(canvas);
//new HelloTriangle_inline_shorter(canvas);
//new HelloTriangle_buffer(canvas);
//new HelloTriangle_buffer_shorter(canvas);
//new HelloTriangle_uniform(canvas);
//new HelloTriangle_uniform_shorter(canvas);
//new HelloTriangle_raw(canvas);

//new MouseTrailerSample(canvas);
//new MouseTrailerSample2(canvas);
//new MouseTrailerSample3(canvas);

//new RotatingCubeSample();
new SoundSpectrumSample(canvas);










/*

import { Test01 } from "./samples/Test01";
import { Test02 } from "./samples/Test02";
import { Test03 } from "./samples/Test03";
import { Test04 } from "./samples/Test04";
import { Test05 } from "./samples/Test05";
import { Test06 } from "./samples/Test06";
import { Test07 } from "./samples/Test07";
import { Test08 } from "./samples/Test08";
import { Test09 } from "./samples/Test09";
import { Test10 } from "./samples/Test10";
import { Test11 } from "./samples/Test11";
import { Test12 } from "./samples/Test12";
import { Test13 } from "./samples/Test13";
import { Test14 } from "./samples/Test14";
import { Test15 } from "./samples/Test15";
import { Test16 } from "./samples/Test16";
import { Test17 } from "./samples/Test17";
import { Test18 } from "./samples/Test18";
import { Test19 } from "./samples/Test19";

const id = 19;


if (id === 1) new Test01();
else if (id === 2) new Test02();
else if (id === 3) new Test03();
else if (id === 4) new Test04();
else if (id === 5) new Test05();
else if (id === 6) new Test06();
else if (id === 7) new Test07();
else if (id === 8) new Test08();
else if (id === 9) new Test09();
else if (id === 10) new Test10();
else if (id === 11) new Test11();
else if (id === 12) new Test12();
else if (id === 13) new Test13();
else if (id === 14) new Test14();
else if (id === 15) new Test15();
else if (id === 16) new Test16();
else if (id === 17) new Test17();
else if (id === 18) new Test18();
else if (id === 19) new Test19();
*/