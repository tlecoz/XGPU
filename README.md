# What is XGPU?

XGPU provides a higher-level way to use WebGPU. It is purpose-agnostic: it can be perfectly suitable as the foundation of a rendering engine based on WebGPU, but it can also be used to process numeric data or textures in a compute shader.

At its higher level, XGPU could be described as a library because it provides basic classes that allow you to build whatever you want, with the logic and variable names you desire. The higher-level code is minimal and straightforward, resembling Canvas2D code (much shorter than raw WebGPU).

At its lower level, XGPU could be considered as a framework because it automatically drives the data from the highest level to the lower level. Data binding is automatic, variable declaration in the shader is automatic, alignment of data in different kinds of buffers is handled automatically, and the ping-pong structure involved in compute shaders is also managed automatically.

XGPU is focused solely on WebGPU. It allows you to produce code that is easy to read, write, maintain, and reuse.

**Note**: XGPU does not contain higher-level classes used in most rendering engines, such as Camera, Light, etc. However, you can easily build them using it (check [this page](https://github.com/tlecoz/xgpu-samples) to see some examples).

# Why "XGPU" ?

The "X" stands for "Extendable". The core idea behind XGPU is the ability to use every kind of data as an extendable component. You can extend everything (uniformBuffer, VertexBuffer, RenderPipeline, ComputePipeline, but also Matrix4x4, Vec4, ...). 

# Key features:

- Automatic data binding
- Automatic buffer alignment
- Automatic declaration of variables in the shaders
- Automatic handling of BindgroupLayout
- Extendable pipelines & resources 
- Ability to plug advanced features (such as light, shadow, etc.) into an existing pipeline.
- Pipelines, textures and buffers automaticly rebuilt when device is lost 
- Declare your variables once for all in javascript with the name you want and use them directly in your shader
- Easy-to-read, easy-to-write, easy-to-maintain


# How to use?

You can install XGPU by using npm install 
 ```
npm install xgpu
 ```

I will complete this section soon, but in the meantime, you can check some samples that use it [here](https://github.com/tlecoz/xgpu-samples).



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



- For now, if you customize a PrimitiveType (Float,Vec2,Vec3,...) and you create custom variable names like that : 

 ```
  class Dimension extends Vec2 {
      constructor(x,y){
         super(x,y);
         this.initStruct(["width", "height"]);
      }
  }
   ```

  it will produce a "struct" with the name of the class with the properties "width" and "height". 
  You will be able to use the keywords "width" and "height" in the shader, but there is an issue... 
  Your object, from the shader point of view, is now a struct, not a vec2 , so you can't write something like

   ```
   pos.xy *= dimension;
   ``` 
   you must write
   ```
   pos.xy = vec2(pos.x * dimension.width, pos.y * dimension.height);
   ```
   
   I'll try to fix it soon 


- For now, you can't have more than one VertexBufferIO or ImageTextureIO by pipeline
  A VertexBufferIO/ImageTextureIO is a resource used in a ComputeShader to store data ; it may be used as input of a renderPipeline after being processed by a computeShader. 
  
- I'm (very) far from having tested every possibilities allowed by WebGPU. 

 