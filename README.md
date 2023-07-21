# What is XGPU?

XGPU provides a higher-level way to use WebGPU. It is purpose-agnostic: it can be perfectly suitable as the foundation of a rendering engine based on WebGPU, but it can also be used to process numeric data or textures in a compute shader.

At its higher level, XGPU could be described as a library because it provides basic classes that allow you to build whatever you want, with the logic and variable names you desire. The higher-level code is minimal and straightforward, resembling Canvas2D code (much shorter than raw WebGPU).

At its lower level, XGPU could be considered as a framework because it automatically drives the data from the highest level to the lower level. Data binding is automatic, variable declaration in the shader is automatic, alignment of data in different kinds of buffers is handled automatically, and the ping-pong structure involved in compute shaders is also managed automatically.

XGPU is focused solely on WebGPU. It allows you to produce code that is easy to read, write, maintain, and reuse.

**Note**: XGPU does not contain higher-level classes used in most rendering engines, such as Camera, Light, etc. However, you can easily build them using it (see the [samples](https://github.com/tlecoz/xgpu-samples) for examples).

# Why "XGPU" ?

The "X" stands for "Extendable". The core idea behind XGPU is the ability to use every kind of data as an extendable component. You can extend everything (uniformBuffer, VertexBuffer, RenderPipeline, ComputePipeline, but also Matrix4x4, Vec4, ...). 

# Key features:

- Automatic data binding: The data used in your pipeline will be transferred and used during the draw process automatically.
- Automatic buffer alignment: Don't overthink how to fit your data structure into the different kinds of buffer; it's automatic and optimized, so you have nothing to worry about.
- Automatic declaration of variables in the shader: Since data binding is automatic, it would be a shame to write variable declarations by hand. XGPU takes care of this complex and verbose process for you.
- Automatic handling of BindgroupLayout: Your pipeline data structure will be "aligned" to your own data structure automatically.
- Extendable renderPipeline & computePipeline: Data binding and variable declarations in the shader are handled automatically, allowing you to extend and customize your renderPipelines and/or computePipelines.
- Pipeline plugins: Ability to plug advanced features (such as light, shadow, etc.) into an existing pipeline.
- Pipelines, textures and buffers are automaticly rebuilt when device is lost 
- Declare you variables a single time in javascript with the name you want and use them directly in the code of your shader (the shader code become the continuity of the javascript code)
- Easy-to-read, easy-to-write, easy-to-maintain at its higher level, and very powerful and flexible at its lower level.

# How to use?

I will complete this section soon, but in the meantime, you can check some samples that use it [here](https://github.com/tlecoz/xgpu-samples).
