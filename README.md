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
- Declare your variables once for all in javascript with the name you want and use them directly in your shader
- produce code easy-to-read, easy-to-write, easy-to-maintain


# How to use?

You can install XGPU by using npm install 
 ```
npm install xgpu
 ```

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

Let's rebuild this sample with an extendable renderPipeline and an interactive color usable outside of the pipeline




class Triangle extends RenderPipeline {
    
    constructor(renderer: GPURenderer, options?: any) {
        super(renderer);
        this.initFromObject({
            //the name of your property can be whatever you want. 
            //These names will be used in the shader code.
            myCustomColor: new Vec4(1.0, 0.0, 0.0, 1.0),
            myVertexPosition: VertexAttribute.Vec2([
                [0.0, 0.5],
                [-0.5, -0.5],
                [0.5, -0.5]
            ]),
            vertexShader: `output.position = vec4(myVertexPosition,0.0,1.0);`,
            fragmentShader: `output.color = myCustomColor;`,
            ...options
        })
    }
}

export class TestSample extends Sample {
    protected async start(renderer: GPURenderer): Promise<void> {
      const trianglePipeline = new Triangle(renderer);
        console.log(trianglePipeline.resources);

        trianglePipeline.onDrawBegin = () => {
            trianglePipeline.resources.myCustomColor.y = Math.random();
        }
        renderer.addPipeline(trianglePipeline);
    }
}

The console.log will look like this :

![console_log](https://raw.githubusercontent.com/tlecoz/XGPU/main/assets/xgpu_pipeline_resources.jpg)

the bindgroup "properties" expose the true data structure of the buffer.
Our vertexAttribute called "myVertexPosition" is actually contained in a VertexBuffer called "buffer" in a bindgroup called "default".
Our Vec4 called "myCustomColor" is actually contained in an UniformBuffer called "uniforms" in a bindgroup called "default". 

A pipeline can handle up to 4 Bindgroups (also called BindgroupLayout in vanilla-webgpu). 
Each Bindgroup can contains more than 1000 differents resources used in a shader (texture / buffer / textureSampler / ... )

In most simples cases, you put everything in the same Bindgroup, but you can share a Bindgroup instance between multiple pipelines and it can be usefull in some particular scenarios. 

Pipeline.resource is the same object used as input of "initFromObject" but the data contained in it are now linked to the pipeline : 
if you update of value of "myCustomColor" for example, it will be updated in the shader

The object used in "initFromObject" describe the pipeline itself and the resource it will use. 

This object follow this type : 
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

as you can see, only "vertexShader" is required. 
There are default properties set everywhere behind the hood.
"fragmentShader" is not required because a renderPipeline used to create a shadow doesn't use any fragmentShader. 

Let's focus on every property : 

- vertexShader : it can be a string that contains the code inside the "main" function of your shader. 
                 Every variables are declared automaticly in XGPU. You write only the interesting part.

                 it can also be an object defined like that : 
                  ```
                 {
                  constants:string,
                  main:string,
                 }
                  ```

                 the "main" properties leads to the code inside the "main" function of the shader. 
                 the "constants" properites lead to code defined before the "main" function. 


                 for example, this object could look like that : 
                  ```
                 vertexShader: {
                     constants: `
                     const pos = array<vec2<f32>,6>(
                        vec2(-1.0, -1.0),
                        vec2(1.0, -1.0),
                        vec2(-1.0, 1.0),
                        vec2(1.0, -1.0),
                        vec2(1.0, 1.0),
                        vec2(-1.0, 1.0),
                     );
                     `,
                     main: `
                     output.position = vec4(pos[vertexId],0.0,1.0);
                     output.uv = (pos[vertexId] + 1.0) * 0.5;
                     `
                  },
                   ```

                   or like that :
                  ```
                   vertexShader:`
                     const pos = array<vec2<f32>,6>(
                        vec2(-1.0, -1.0),
                        vec2(1.0, -1.0),
                        vec2(-1.0, 1.0),
                        vec2(1.0, -1.0),
                        vec2(1.0, 1.0),
                        vec2(-1.0, 1.0),
                     );
                     output.position = vec4(pos[vertexId],0.0,1.0);
                     output.uv = (pos[vertexId] + 1.0) * 0.5;
                   `
                  ```
                  (but the first version is better because the constant is created a single time, outside of the main function)  

- fragmentShader : it works exactly like vertexShader

- vertexCount : By default, when you use a VertexBuffer or a VertexAttribute (implying a VertexBuffer behind the hood), the value will be set automaticly if undefined. But in some case (like the shader exposed just above) , you don't need a VertexBuffer at all because all the data may be defined directly in the shader. In such scenario, you need to define "vertexCount" to tell the pipeline how much it should call the "main" function of the vertexShader. 

                "vertexCount" is ususally used with an additional property that contains the index of the current vertex read in the "main" function. This property must be defined in the object used in "pipeline.initFromObject" ; it can have the name you want (in the example above I called it "vertexId") but its value must be 
                ```
                BuiltIns.vertexInputs.vertexIndex
                ```
                

- instanceCount : 1 by default. 
                  instanceCount works like "vertexCount" except that "instanceCount" tells the pipeline how much time it will repeat the code of the shader. 
                  
                  If you want to draw a single triangle, vertexCount would be 3 and the main function would be called 3 times , but if you want to draw 10 triangles for example, you can reuse the structure of your first triangle and set "instanceCount" to 10 ;  the "main" function would be called 10 x 3 times. 

                  "instanceCount" is ususally used with an additional property that contains the index of the current instance read in the "main" function. This property must be defined in the object used in "pipeline.initFromObject" ; it can have the name you want but its value must be 
                ```
                BuiltIns.vertexInputs.instanceIndex
                ```  
               



- firstVertexId : 0 by default. 
                  Allow you to start the reading of the shader at a particular vertex index 



- firstInstanceId : 0 by default
                  Allow you to start the reading of the shader at a particular instance index 



- cullMode: "front" | "back" | "none"

- topology:  https://gpuweb.github.io/gpuweb/#enumdef-gpuprimitivetopology

- frontFace : https://gpuweb.github.io/gpuweb/#enumdef-gpufrontface

- stripIndexFormat : https://gpuweb.github.io/gpuweb/#dom-gpuprimitivestate-stripindexformat 

- antiAliasing : false by default
                 if true, it will smooth the rendering a bit. 
                 (the shader will be drawn in a depthTexture before to drawn on the screen)

- useDepthTexture : false by default.
                    it indicate if you want to draw the shader in a depthTexture (to handle shadow for example)

- depthTextureSize : 1024 by default. 
                     The size of the depthTexture if "useDepthTexture" is set to true

- depthTest: false by default
             Indicate if you want to apply a z-sorting of your triangles during the shader pass
            
- clearColor: an object with r,g,b,a properties to set the defaut color of the backgound when the renderer render new frame.

- blendMode : undefined by default. 
              you can create a custom BlendMode extending the BlendMode class or use a new AlphaBlendMode 
              in order to handle image with alpha channel

- indexBuffer : undefined by default
                you can assign an IndexBuffer to a pipeline to manage your triangles defined in your vertexBuffer (if you have one)

- bindgroups : undefined by default
               This property is a vestige of the previous version of GPU. If defined, it describe the complete structure of the resources used in a shader with every buffer defined explicitly. 

               Actually, the very first step of Pipeline.initFromObject is to parse the input object to produce an object that fit in "bindgroups" properties. 

               you should not use this property, except maybe if you work with PipelinePlugin (show the samples Light & Shadow to see an example)




# DEMOS 

check the [samples-page](https://xgpu-samples.netlify.app/samples/TonsOfCubes)

The repo containing the samples is [here](https://github.com/tlecoz/xgpu-samples).



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
  


 