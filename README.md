# What is XGPU?

XGPU provides a higher-level way to use WebGPU. It is purpose-agnostic: it can be perfectly suitable as the foundation of a rendering engine based on WebGPU, but it can also be used to process numeric data or textures in a compute shader.

At its higher level, XGPU could be described as a library because it provides basic classes that allow you to build whatever you want, with the logic and variable names you desire. The higher-level code is minimal and straightforward, resembling Canvas2D code (much shorter than raw WebGPU).

At its lower level, XGPU could be considered as a framework because it automatically drives the data from the highest level to the lower level. Data binding is automatic, variable declaration in the shader is automatic, alignment of data in different kinds of buffers is handled automatically, and the ping-pong structure involved in compute shaders is also managed automatically.

XGPU is focused solely on WebGPU. It allows you to produce code that is easy to read, write, maintain, and reuse.

**Note**: XGPU does not contain higher-level classes used in most rendering engines, such as Camera, Light, etc. However, you can easily build them using it (check [this page](https://xgpu-samples.netlify.app/samples/TonsOfCubes) to see some examples).

# Why "XGPU" ?

The "X" stands for "Extendable". The core idea behind XGPU is the ability to use every kind of data as an extendable component. You can extend everything (uniformBuffer, VertexBuffer, RenderPipeline, ComputePipeline, but also Matrix4x4, Vec4, ...). 

# Key features:

- Automatic data binding
- Automatic buffer alignment
- Automatic declaration of variables in the shaders
- Automatic handling of BindgroupLayout
- Extendable pipelines & resources 
- Ability to plug advanced features (such as light, shadow, etc.) into an existing pipeline.
- Ability to make a (kind of) console.log directly from the vertexShader
- Declare your variables once for all in javascript with the name you want and use them directly in your shader
- produce code easy-to-read, easy-to-write, easy-to-maintain


# DEMOS 

[![image of the samples-page](https://raw.githubusercontent.com/tlecoz/XGPU/main/public/samples.jpg)](https://xgpu-samples.netlify.app/samples/TonsOfCubes)

check the [samples-page](https://xgpu-samples.netlify.app/samples/TonsOfCubes)

The repo containing the samples is [here](https://github.com/tlecoz/xgpu-samples).

# How to use?

You can install XGPU by using npm install 
 ```
npm install xgpu
 ```
Contrary to Vanilla-WebGPU that use GPUTexture/GPUBuffer everywhere, XGPU uses very specialized types for every resources usable in a shader to handle the different usecase.

Every data type used in WGSL has been reproduced in typescript and are usable in XGPU. 
This primitive type, once associated to a Pipeline using Pipeline.initFromObject is automaticly binded to the pipeline : if you update its value, it will be updated in the shader.

# Primitive types : 

- **Float**
- **Vec2**
- **Vec3**
- **Vec4**
- **Int**
- **IVec2**
- **IVec3**
- **IVec4**
- **Uint**
- **UVec2**
- **UVec3**
- **UVec4**
- **Matrix3x3**
- **Matrix4x4**
- **Vec4Array**
- **IVec4Array**
- **UVec4Array**
- **Matrix4x4Array**




# List of Shader Resources

## 1) Buffers

- **VertexAttribute:** Represents a set of data defined by vertex in a VertexBuffer.
- **VertexBuffer:** Represents a set of vertexAttributes packaged in a single buffer (the final buffer transferred to the GPU).
- **VertexBufferIO:** Represents 2 vertexBuffers: one buffer "read-only" usable in a computePipeline AND in a renderPipeline, and another buffer "read-write" usable only in a computeShader.
- **UniformGroup:** Acts like an object containing primitive types only (Float, Vec2, ...), or other UniformGroup, and produces a "struct" in the shader.
- **UniformGroupArray:** An array of uniformGroups sharing the same buffer.
- **UniformBuffer:** Extends UniformGroup and may contain other UniformGroup/UniformGroupArray. UniformGroup & UniformGroupArray are just abstractions; they are contained by a UniformBuffer that is transferred to the GPU.

## 2) Textures

### a) Textures for General Use

- **ImageTexture:** Represents an image (it can be an HTMLImageElement, an HTMLCanvasElement, or an ImageBitmap).
- **ImageTextureArray:** An array of ImageTexture.
- **CubeMapTexture:** An array of 6 ImageTextures with some data dedicated to this use case.
- **VideoTexture:** A texture that contains a video.
- **ImageTextureIO:** Represents 2 textures: one "read-only" usable in a computePipeline AND in a renderPipeline, and another texture "read-write" usable only in a computeShader.
- **TextureSampler:** An object that works with every kind of texture in a fragmentShader. If you don't know what you are doing, just create a new instance without parameters and use it with your texture in the fragmentShader.

### b) Textures for Pipeline Use

- **DepthStencilTexture:** Works with 'depthTest:true' in RenderPipeline.initFromObject; also works with shadow rendering.
- **DepthTextureArray:** An array of DepthTexture.
- **MultiSampleTexture:** Works with 'antialiasing:true' in RenderPipeline.initFromObject.



---------------------------

## Bindgroups in XGPU vs. Vanilla-WebGPU

In Vanilla-WebGPU, the concept of Bindgroup and BindgroupLayout is introduced. While the idea is great, getting started with it can be confusing (refer to the [official WebGPU samples](https://webgpu.github.io/webgpu-samples/) to understand the complexity).

### XGPU Approach:

In XGPU, the handling of Bindgroups is designed to be more intuitive and efficient. Here's how it works:

- **Bindgroups in XGPU:**
  - A `RenderPipeline` or `ComputePipeline` in XGPU has a property called "bindGroups" which can contain up to 4 Bindgroups (referred to as BindgroupLayout in Vanilla-WebGPU).
  - A Bindgroup in XGPU is a collection of resources utilized in a shader, such as textures, vertex buffers, uniform buffers, and more. Each Bindgroup can hold up to 1000 resources.

- **Default Bindgroup:**
  - By default, XGPU places all resources in a default bindgroup called "default" if you don't explicitly define one in `Pipeline.initFromObject`. It simplifies the process when you want everything in the same bindgroup.

- **Multiple Bindgroups Usage:**
  - Multiple bindgroups become useful when you have multiple pipelines sharing common resources. This enables you to pack these resources in an object and efficiently share it among pipelines, avoiding redundant resource definition and transfer.

- **Advanced Logic with Bindgroups:**
  - Bindgroups also enable the creation of advanced logic involving specific resources. For instance, when dealing with a `VertexBufferIO` or an `ImageTextureIO` in a `computePipeline`, these resources work differently and have a dedicated Bindgroup called "io." The "io" Bindgroup allows updating the index of buffers/textures for each frame without affecting resources in another Bindgroup.

- **Flexible Data Structure:**
  - `Pipeline.initFromObject` imposes no constraints on the data structure. You can add a `VertexAttribute` without creating a `VertexBuffer` explicitly. Similarly, you can include primitive types without creating a separate `UniformBuffer`. Each resource is defined above the shader code, resembling properties in a class. XGPU handles the necessary details automatically while providing customization options.

- **Future Samples:**
  - The plan is to include more samples illustrating the usage of multiple bindgroups to enhance clarity and provide practical insights into their application.



Let's see the code of the very first sample, just to see what it look like : 

 ```

export class HelloTriangle_Sample extends Sample {
    protected async start(renderer: GPURenderer): Promise<void> {
        const pipeline: RenderPipeline = new RenderPipeline(renderer);
        pipeline.initFromObject({
            position: VertexAttribute.Vec2([
                [0.0, 0.5],
                [-0.5, -0.5],
                [0.5, -0.5]
            ]),
            vertexShader: `output.position = vec4(position,0.0,1.0);`,
            fragmentShader: `output.color = vec4(1.0,0.0,0.0,1.0);`
        })
        renderer.addPipeline(pipeline);
    }
}
  ```


The object used in "initFromObject" describe the pipeline itself and the resource it will use. 

This object follow this type : 
  ```
export type RenderPipelineProperties = {

    vertexShader: VertexShaderDescriptor,
    fragmentShader?: FragmentShaderDescriptor,
    vertexCount?: number, 
    instanceCount?: number,  
    firstVertexId?: number,
    firstInstanceId?: number,
    cullMode?: "front" | "back" | "none",
    topology?: "point-list" | "line-list" | "line-strip" | "triangle-list" | "triangle-strip",
    frontFace?: "ccw" | "cw",
    stripIndexFormat?: "uint16" | "uint32",
    antiAliasing?: boolean,
    useDepthTexture?: boolean,
    depthTextureSize?: number,
    depthTest?: boolean,
    clearColor?: { r: number, g: number, b: number, a: number },
    blendMode?: BlendMode,
    bindgroups?: BindgroupsDescriptor,
    indexBuffer?: IndexBuffer,
}
  ```
as you can see, only "vertexShader" is required. 
There are default properties set everywhere behind the hood.
"fragmentShader" is not required because a renderPipeline used to create a shadow doesn't use any fragmentShader. 

You can choose the name of every resource used in the shader. 
The name used in "initFromObject" will be the name of the object in the shader.


# Limitations:
- For now it's impossible to use serveral times the same object in the same pipeline. For example, you can't do that : 
  ```
  const pipeline = new RenderPipeline();
  const someValues = new Vec3(0,1,2);
  pipeline.initFromObject({
     a:someValues,
     b:someValues,
     //other properties
  })
  ```
  you must write :
  ```
  pipeline.initFromObject({
     a:new Vec3(0,1,2),
     b:new Vec3(0,1,2),
     //other properties
  })
  ```
  or 
  ```
  const a = new Vec3(0,1,2);
  const b = new Vec3(0,1,2);
  pipeline.initFromObject({
     a,
     b,
     //other properties
  })
  ```

  This is because I assign the name of the variable to the object and an object can't have two different names.
  This is a bit complex to fix but the problem is well identified, I should be able to fix it in a near future. 

- RenderBundle feature is still a "work in progress"


- For now, you can't have more than one VertexBufferIO or ImageTextureIO by pipeline
  A VertexBufferIO/ImageTextureIO is a resource used in a ComputeShader to store data ; it may be used as input of a renderPipeline after being processed by a computeShader. 
  


 