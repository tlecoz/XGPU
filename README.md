# What is XGPU ? 

XGPU provide a higher level way to use WebGPU.  
It's purpose-agnostic : it could be perfectly suitable as the fundations of a rendering engine based on WebGPU but it also be used to process numeric data or texture in a computeShader. 


At its higher level, it could be described as a library because it provide basic class that allow to build whatever you want, with the logic you want and the variable name you want. The higher level code is very minimal and straight forward, it feel like Canvas2D code (much shorter than raw webGPU)

At its lower level, XGPU could be considered as a framework because it drive the data automaticly from highest level to lower level, the data-binding is automatic, the declaration of the variable in the shader is automatic, the alignement of the data in the differents kind of buffer are handled automaticly, the ping-pong structure involved in computeShaders is handled automaticly, ... 

XGPU is focus on WebGPU only. 
It allow you to produce a code easy-to-read, easy-to-write, easy-to-maintain, easy-to-reuse. 

It DOES NOT contain higher level class used in most of rendering engine such as Camera, Light, etc.... But you can build it easyly using it ( [show the samples to see how to proceed](https://github.com/tlecoz/xgpu-samples) )
 
# Key features : 

- automatic data-binding : the datas used in your pipelne will be transfered and used during the draw process automaticly 
- automatic buffer alignment : don't overthink about how to fit your datas in the buffer, it's automatic and optimized , you have nothing to do 
- automatic declaration of the variable in the shader : because the data-binding is automatic , it would be a shame to write the declaration of the variable by hand. It's a bit complex and verbose, trust me, you don't want to write it. 
- extendable renderPipeline & computePipeline : because data-binding and variable déclaration in the shader are handled automaticly, it's possible to extends and declinate your renderPipelines and/or your computePipelines
- pipeline plugin : ability to plug an advanced feature (such as light, shadow, ...) in an existing pipeline 
- easy-to-read , easy-to-write, easy-to-maintain at its higher level , and very powerfull and flexible at its lower level. 

# How to use ? 

I will complete this section soon but you can check some samples that use it [here](https://github.com/tlecoz/xgpu-samples) 
