/**
 * @author alteredq / http://alteredqualia.com/
 *
 * Blend two textures
 */

THREE.BlendDepth = {

	uniforms: {

		"tDiffuse1": { value: null },
		"tDiffuse2": { value: null },
		"tDepth1": 	 { value: null },
		"tDepth2":   { value: null },
		"cameraNear":{ value: 0 },
		"cameraFar": { value: 0 }
	},

	vertexShader: [

		"varying vec2 vUv;",

		"void main() {",

			"vUv = uv;",
			"gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );",

		"}"

	].join( "\n" ),

	fragmentShader: [

		"#include <packing>",

		"uniform sampler2D tDiffuse1;",
		"uniform sampler2D tDiffuse2;",
		"uniform sampler2D tDepth1;",
		"uniform sampler2D tDepth2;",
		
		
		"uniform float cameraNear;",
		"uniform float cameraFar;",
		
		"varying vec2 vUv;",
		
		"float readDepth (sampler2D depthSampler, vec2 coord) {",
	//	"	float fragCoordZ = texture2D(depthSampler, coord).x  ;",
	//	"	float viewZ = perspectiveDepthToViewZ( fragCoordZ, cameraNear, cameraFar );",
	//	"	return viewZToOrthographicDepth( viewZ, cameraNear, cameraFar );",
		"	float fragCoordZ = unpackRGBAToDepth(texture2D(depthSampler, coord));",
		"	return fragCoordZ;",
		"}",
	  
		"void main() {",

			"float z1 = readDepth(tDepth1, vUv);",
			"float z2 = readDepth(tDepth2, vUv);",
			"vec4 diffuse1 = texture2D(tDiffuse1, vUv);",
			"vec4 diffuse2 = texture2D(tDiffuse2, vUv);",
			"gl_FragColor.rgb = z1 - z2> .0 ? vec3(1.0,0.0,0.0) : vec3(0.0,1.0,0.0);","gl_FragColor.a = 1.0;",
			"vec4 _color = vec4(0.0);",
			"if(z1 == 0.0){_color = diffuse2;}else if(z2 == 0.0){_color = diffuse1;}else {_color = z1 < z2 ? diffuse1: diffuse2;}",
			"gl_FragColor = _color;",

		"}"

	].join( "\n" )

};
//"gl_FragColor.rgb = z1 == 1.0 ? vec3(1.0,0.0,0.0) : vec3(0.0,1.0,0.0);","gl_FragColor.a = 1.0;",z1 < z2 ? diffuse1 : diffuse2;