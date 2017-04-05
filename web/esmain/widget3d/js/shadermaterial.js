/**
 * Created by htso on 2017/3/3.
 * 存放些shader的效果供调用
 */

/**
 * 荧光shader
 * @param color
 * @param options
 * @returns {THREE.ShaderMaterial}
 */
var getFluorescenceShader = function(options) {
	var color = options.color;
	var position = options.position;
	/**
	 *
	 <script id="vertexShader" type="x-shader/x-vertex">
	 uniform vec3 viewVector;
	 uniform float c;
	 uniform float p;
	 varying float intensity;
	 void main()
	 {
		 vec3 vNormal = normalize( normalMatrix * normal );
		 vec3 vNormel = normalize( normalMatrix * viewVector );
		 intensity = pow( c - dot(vNormal, vNormel), p );

		 gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
	 }
	 </script>

	 <script id="fragmentShader" type="x-shader/x-vertex">
	 uniform vec3 glowColor;
	 varying float intensity;
	 void main()
	 {
		 vec3 glow = glowColor * intensity;
		 gl_FragColor = vec4( glow, 1.0 );
	 }
	 </script>
	 */
	var vertexShader = "uniform vec3 viewVector;" +
		"uniform float c;" +
		"uniform float p;" +
		"varying float intensity;" +
		"void main() " +
		"{" +
		"   vec3 vNormal = normalize( normalMatrix * normal );" +
		"	vec3 vNormel = normalize( normalMatrix * viewVector );" +
		"	intensity = pow( c - dot(vNormal, vNormel), p );" +
		"    gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );" +
		"}";

	var fragmentShader = "uniform vec3 glowColor;" +
		"varying float intensity;" +
		"void main() " +
		"{" +
		"   vec3 glow = glowColor * intensity;" +
		"	gl_FragColor = vec4( glow, 1.0 );" +
		"}";

	// create custom material from the shader code above
	//   that is within specially labeled script tags
	return new THREE.ShaderMaterial(
		{
			uniforms: {
				"c": {type: "f", value: 1.4},
				"p": {type: "f", value: 1.4},
				glowColor: {type: "c", value: new THREE.Color(color)},
				viewVector: {type: "v3", value: position}
			},
			vertexShader: vertexShader,
			fragmentShader: fragmentShader,
			side: THREE.FrontSide,
			blending: THREE.AdditiveBlending,
			transparent: true
		});
};

var getFlowShader = function(options) {
	this.uniforms = {
		time: options.time
		//,resolution: {value: new THREE.Vector2()}
	};

	var color = new THREE.Color(options.color);
	return new THREE.ShaderMaterial({
		uniforms: this.uniforms,
		vertexShader: 'varying vec2 vUv;void main(){vUv = uv;gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );}',
		fragmentShader: 'uniform float time;'
		//+ 'uniform vec2 resolution;'
		+ 'varying vec2 vUv;'
		+ 'void main( void ) {'
		+ 'vec2 position = -1.0 + 2.0 * vUv;'
		+ 'float r = sin(position.x * position.y + time) * 3.0 / 8.0 + ' + Number(color.r).toFixed(2) + ' - 1.0;'
		+ 'float g = sin(position.x * position.y + time) * 3.0 / 8.0 + ' + Number(color.g).toFixed(2) + ' - 1.0;'
		+ 'float b = sin(position.x * position.y + time) * 3.0 / 8.0 + ' + Number(color.b).toFixed(2) + ' - 1.0;'
		+ 'gl_FragColor = vec4( r, g, b, 1 );'
		+ '}',
		blending: options.blending || THREE.AdditiveBlending,
		side: options || THREE.FrontSide,
		//depthTest: false,
		transparent: options.transparent || true
	});
};