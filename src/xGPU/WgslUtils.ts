// Copyright (c) 2023 Thomas Le Coz. All rights reserved.
// This code is governed by an MIT license that can be found in the LICENSE file.

export class WgslUtils {

    public static get rotationX(): string {
        return `
        fn rotationX( angle:f32 )->mat4x4<f32> {
            return mat4x4<f32>(	
                    vec4(1.0,		0,			0,			0),
                    vec4(0 , 	cos(angle),	-sin(angle),	0),
                    vec4(0 , 	sin(angle),	 cos(angle),	0),
                    vec4(0 , 			0,			  0, 	1)
                    );
        }
        `
    }

    public static get rotationY(): string {
        return `
        fn rotationY( angle:f32 )->mat4x4<f32> {
            return mat4x4<f32>(
                    vec4( cos(angle),   0   ,	sin(angle) ,	0),
                    vec4(   0       ,	1.0 ,   	 0     ,	0),
                    vec4(-sin(angle),	0   ,	cos(angle) ,	0),
                    vec4(   0       , 	0   ,	 	 0     ,	1)
                );
        }
        `
    }

    public static get rotationZ(): string {
        return `
        fn rotationZ( angle:f32 )->mat4x4<f32> {
            return mat4x4<f32>(
                    vec4(cos(angle) , -sin(angle) ,	0  ,  0 ),
                    vec4(sin(angle) , cos(angle)  ,	0  ,  0 ),
                    vec4(    0      ,     0       ,	1  ,  0 ),
                    vec4(    0      ,	  0       ,	0  ,  1)
                );
        }
        `
    }

}