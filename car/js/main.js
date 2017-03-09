var container, stats;
var camera, scene, renderer, finalcomposer;
var controls;
var pointLight;
var chekuGroup, meshBkg;
var cars = [];
var current_carId = 0;
var mat_rim, mat_body, mat_glass, mat_bumper;
var materialBkg;
var lines = [],
	lineGp, meshplane;
var raycaster;
var mouse;
var objects = [];
var Hwindow = 1,
	effectFXAA,
effect;
$(document).ready(function() {
	var _0x12FA2 = 1;
	$("#menu").click(function() {
		$(".topRight ul").toggle();
		_0x12FA2 *= -1;
		$(this).css("transform", "rotateZ(" + _0x12FA2 * 180 + "deg)");
		$(this).css("-webkit-transform", "rotateZ(" + _0x12FA2 * 180 + "deg)");
		$(this).css("-moz-transform", "rotateZ(" + _0x12FA2 * 180 + "deg)")
	});
	$("#parameter" + current_carId).toggle();
	$("#showParameter").click(function() {
		$("#parameter" + current_carId).toggle()
	});
	$("#carbody").minicolors({
		control: "wheel",
		inline: true,
		change: function(_0x12FF4) {
			$("#bodycolor").css("background-color", _0x12FF4);
			mat_body.color = new THREE.Color().set(_0x12FF4)
		}
	});
	$("#carrim").minicolors({
		control: "wheel",
		inline: true,
		change: function(_0x12FF4) {
			$("#rimcolor").css("background-color", _0x12FF4);
			mat_rim.color = new THREE.Color().set(_0x12FF4);
			d
		}
	});
	$(" ul li").click(function() {
		$(".color .minicolors-inline .minicolors-panel").css("display", "none");
		if ($(this).attr("class", "color")) {
			var _0x13046 = "#" + $(this).attr("id") + " .minicolors-inline .minicolors-panel";
			if ($(_0x13046).css("display") == "none") {
				$(_0x13046).css("display", "block")
			}
		}
	});
	$("#autoRotate").click(function() {
		controls.autoRotate = controls.autoRotate == true ? false : true
	});
	$(".carName li").click(function() {
		cars[current_carId].visible = false;
		$("#parameter" + current_carId).css("display", "none");
		current_carId = parseInt($(this).attr("id"));
		cars[current_carId].visible = true;
		$("#parameter" + current_carId).css("display", "block");
		lineGp.children = [];
		lines = [];
		objects = cars[current_carId]
	});
	$(".Bkg li").click(function() {
		var _0x13098 = $(this).attr("id");
		console.log(_0x13098);
		if (_0x13098 == "garage") {
			meshBkg.visible = false;
			var _0x130EA = loadEnvironment("cube/" + _0x13098 + "/", ".jpg");
			chekuGroup.traverse(function(_0x1313C) {
				_0x1313C.visible = true
			});
			mat_body.reflectivity = 0.6;
			mat_body.combine = THREE.MixOperation;
			mat_body.envMap = _0x130EA;
			mat_rim.envMap = _0x130EA;
			mat_glass.envMap = _0x130EA;
			mat_bumper.envMap = _0x130EA
		} else {
			var _0x130EA = loadEnvironment("cube/" + _0x13098 + "/", ".jpg");
			chekuGroup.traverse(function(_0x1313C) {
				_0x1313C.visible = false
			});
			meshBkg.visible = true;
			mat_body.reflectivity = 0.4;
			mat_body.combine = THREE.AddOperation;
			mat_body.envMap = _0x130EA;
			mat_rim.envMap = _0x130EA;
			mat_glass.envMap = _0x130EA;
			mat_bumper.envMap = _0x130EA;
			materialBkg.uniform["tCube"].value = _0x130EA
		}
	})
});
init();
animate();

function init() {
	container = document.createElement("div");
	scene = new THREE.Scene();
	camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 1, 12000);
	camera.position.set(76, 364, 688);
	controls = new THREE.OrbitControls(camera);
	controls.target.set(0, 50, 0);
	controls.minDistance = 350;
	controls.maxDistance = 750;
	controls.autoRotate = true;
	controls.enablePan = false;
	controls.enabledAutoRotatePhi = true;
	controls.autoRotateSpeed = 2.2;
	controls.phiRotationSpeed = 2.2;
	controls.minPolarAngle = THREE.Math.degToRad(70);
	controls.maxPolarAngle = THREE.Math.degToRad(89);
	controls.update();
	


	var _0x13232 = new THREE.DirectionalLight(0xffffff, 1.0);
	_0x13232.position.set(0, 1, 0).normalize();
	scene.add(_0x13232);
	pointLight = new THREE.PointLight(0x666666, 1.0);
	scene.add(pointLight);
	pointLight.decay = 2;
	_0x13232.castShadow = true;
	renderer = new THREE.WebGLRenderer({
		antialias: true,
		alpha: false
	});
	renderer.setClearColor(0x000000, 1);
	renderer.setPixelRatio(window.devicePixelRatio);
	renderer.setSize(window.innerWidth, window.innerHeight);
	renderer.autoClear = false;
	document.body.appendChild(renderer.domElement);
	var _0x13514 = loadEnvironment("cube/road/", ".jpg");
	materialBkg = new THREE.ShaderMaterial({
		uniforms: {
			"tCube": _0x13514
		},
		vertexShader: "varying vec2 outUV;void main(){outUV=uv;vec4 mvPosition = modelViewMatrix*vec4(position,1.0 );gl_Position = projectionMatrix * mvPosition;}",
		fragmentShader: "uniform samplerCube tCube;varying vec2 outUV;vec4 cubeToLatLon(samplerCube cubemap, vec2 inUV){const float PI = 3.141592653589793238462643383;vec3 cubmapTexCoords;cubmapTexCoords.x = -cos(inUV.x * PI * 2.0) * sin(inUV.y * PI);cubmapTexCoords.y = -cos(inUV.y * PI);cubmapTexCoords.z = -sin(inUV.x * PI * 2.0) * sin(inUV.y * PI);return textureCube(cubemap, cubmapTexCoords);}void main( void ){gl_FragColor = cubeToLatLon(tCube, outUV);}"
	});
	var _0x13566 = new THREE.TextureLoader();
	var _0x13328 = new THREE.BinaryLoader();
	_0x13328.load("cube/road/environment.js", function(_0x1360A) {
		meshBkg = new THREE.Mesh(_0x1360A, materialBkg);
		scene.add(meshBkg);
		meshBkg.visible = true
	});
	chekuGroup = new THREE.Group();
	loadCommonMesh();
	scene.add(chekuGroup);
	var _0x1318E = ["lancer", "audi", "mercedes"];
	var _0x131E0 = _0x1318E.length;
	for (var _0x13284 = 0; _0x13284 < _0x131E0; _0x13284++) {
		cars.push(new THREE.Group());
		scene.add(cars[_0x13284]);
		cars[_0x13284].visible = false
	};
	var _0x132D6 = new THREE.JSONLoader();
	var _0x135B8 = [
		[new THREE.Vector3(146.4, 0, 257.0), new THREE.Vector3(-144.5, 0, 257.0), new THREE.Vector3(146.4, 0, -255.5), new THREE.Vector3(-146.4, 0, -255.5)],
		[new THREE.Vector3(137.5, 0, 233.5), new THREE.Vector3(-138.5, 0, 233.5), new THREE.Vector3(137.5, 0, -267.5), new THREE.Vector3(-138.5, 0, -267.5)],
		[new THREE.Vector3(154.5, 0, 268.6), new THREE.Vector3(-155.5, 0, 268.6), new THREE.Vector3(154.5, 0, -261.8), new THREE.Vector3(-155.5, 0, -261.8)]
	];
	var _0x134C2 = _0x13566.load("carVisual/images/wheel.png");
	var _0x13470 = _0x13566.load("cube/normal.jpg");
	_0x134C2.anisotropy = 8;
	var _0x1341E = new THREE.MeshBasicMaterial({
		map: _0x134C2,
		transparent: true
	});
	mat_rim = new THREE.MeshPhongMaterial({
		color: 0xb8b8b8,
		reflectivity: 0.5,
		combine: THREE.MixOperation,
		envMap: _0x13514,
		specular: 0x202020
	});
	mat_body = new THREE.MeshPhongMaterial({
		color: 0xff0000,
		reflectivity: 0.2,
		//combine: THREE.MixOperation,
		envMap: _0x13514,
		shininess: 30
	});
	mat_glass = new THREE.MeshLambertMaterial({
		color: 0xcccccc,
		reflectivity: 1.0,
		opacity: 0.3,
		transparent: true,
		combine: THREE.MixOperation,
		envMap: _0x13514,
		depthWrite: false
	});
	mat_bumper = new THREE.MeshLambertMaterial({
		color: 0x333333,
		reflectivity: 0.5,
		combine: THREE.MixOperation,
		envMap: _0x13514
	});
	for (var _0x13284 = 0; _0x13284 < _0x131E0; _0x13284++) {
		loadTyreRim("carVisual/carvisualizer.wheel.js", _0x1341E, _0x135B8[_0x13284], _0x13284);
		loadTyreRim("carVisual/carvisualizer.rim.js", mat_rim, _0x135B8[_0x13284], _0x13284);
		loadMesh("carVisual/carvisualizer." + _0x1318E[_0x13284] + "_body.js", mat_body, _0x13284);
		loadMesh("carVisual/carvisualizer." + _0x1318E[_0x13284] + "_bumper.js", mat_bumper, _0x13284);
		loadMesh("carVisual/carvisualizer." + _0x1318E[_0x13284] + "_glass.js", mat_glass, _0x13284);
		var _0x134C2 = _0x13566.load("carVisual/images/i_" + _0x1318E[_0x13284] + ".jpg");
		_0x134C2.anisotropy = 8;
		var _0x133CC = new THREE.MeshBasicMaterial();
		_0x133CC.map = _0x134C2;
		loadMesh("carVisual/carvisualizer." + _0x1318E[_0x13284] + "_interior.js", _0x133CC, _0x13284);
		var _0x1337A = new THREE.MeshBasicMaterial({
			transparent: true,
			depthWrite: false
		});
		_0x1337A.map = _0x13566.load("carVisual/images/s_" + _0x1318E[_0x13284] + ".png");
		_0x1337A.name = "shadow";
		loadMesh("carVisual/carvisualizer.car_shadow.js", _0x1337A, _0x13284)
	};
	cars[current_carId].visible = true;
	objects = new THREE.Group();
	objects = cars[current_carId];
	window.addEventListener("resize", onWindowResize, false);

}
function onWindowResize() {
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
	renderer.setSize(window.innerWidth, window.innerHeight);
	
}
function render() {
	renderer.render(scene, camera);

	pointLight.position.copy(camera.position)
}
function loadCommonMesh() {
	var _0x13566 = new THREE.TextureLoader();
	var _0x132D6 = new THREE.JSONLoader();
	var _0x134C2 = _0x13566.load("carVisual/images/garage.jpg");
	_0x134C2.anisotropy = 8;
	var _0x13700 = new THREE.MeshBasicMaterial({
		map: _0x134C2
	});
	_0x132D6.load("carVisual/carvisualizer.garage.js", function(_0x1360A) {
		var _0x13752 = new THREE.Mesh(_0x1360A, _0x13700);_0x13752.visible = false;
		chekuGroup.add(_0x13752)
	});
	var _0x134C2 = _0x13566.load("carVisual/images/floor.jpg");
	_0x134C2.anisotropy = 16;
	_0x134C2.wrapS = _0x134C2.wrapT = THREE.RepeatWrapping;
	_0x134C2.repeat.set(10, 10);
	var _0x136AE = new THREE.MeshLambertMaterial({
		map: _0x134C2
	});
	_0x132D6.load("carVisual/carvisualizer.floor.js", function(_0x1360A) {
		var _0x13752 = new THREE.Mesh(_0x1360A, _0x136AE); _0x13752.visible = false;
		chekuGroup.add(_0x13752)
	});
	var _0x134C2 = _0x13566.load("carVisual/images/floorShadow.png");
	var _0x1365C = new THREE.MeshBasicMaterial({
		map: _0x134C2,
		transparent: true,
		depthWrite: false
	});
	_0x132D6.load("carVisual/carvisualizer.floor_shadow.js", function(_0x1360A) {
		var _0x13752 = new THREE.Mesh(_0x1360A, _0x1365C); _0x13752.visible = false;
		chekuGroup.add(_0x13752)
	})
}
function animate() {
	requestAnimationFrame(animate);
	render();
	controls.update()
}
function loadEnvironment(_0x137F6, _0x137A4) {
	var _0x13848 = [_0x137F6 + "px" + _0x137A4, _0x137F6 + "nx" + _0x137A4, _0x137F6 + "py" + _0x137A4, _0x137F6 + "ny" + _0x137A4, _0x137F6 + "pz" + _0x137A4, _0x137F6 + "nz" + _0x137A4];
	var _0x132D6 = new THREE.CubeTextureLoader();
	textureCube = _0x132D6.load(_0x13848);
	textureCube.format = THREE.RGBFormat;
	return textureCube
}
function loadMesh(_0x138EC, _0x1389A, _0x13284) {
	var _0x132D6 = new THREE.JSONLoader();
	_0x132D6.load(_0x138EC, function(_0x1360A) {
		var _0x13752 = new THREE.Mesh(_0x1360A, _0x1389A);
		_0x13752.castShadow = false;
		_0x13752.receiveShadow = true;
		cars[_0x13284].add(_0x13752)
	})
}
function loadTyreRim(_0x138EC, _0x1393E, _0x1389A, _0x13284) {
	var _0x132D6 = new THREE.JSONLoader();
	_0x132D6.load(_0x138EC, function(_0x13AD8) {
		var _0x13990 = new THREE.Mesh(_0x13AD8.clone(), _0x1393E);
		_0x13990.name = "wheel1";
		var _0x139E2 = new THREE.Mesh(_0x13AD8.clone(), _0x1393E);
		_0x139E2.name = "wheel2";
		var _0x13A34 = new THREE.Mesh(_0x13AD8.clone(), _0x1393E);
		_0x13A34.name = "wheel3";
		var _0x13A86 = new THREE.Mesh(_0x13AD8.clone(), _0x1393E);
		_0x13A86.name = "wheel4";
		_0x13990.position.copy(_0x1389A[0]);
		_0x13990.rotation.y = THREE.Math.degToRad(180);
		cars[_0x13284].add(_0x13990);
		_0x139E2.position.copy(_0x1389A[1]);
		_0x139E2.rotation.y = THREE.Math.degToRad(0);
		cars[_0x13284].add(_0x139E2);
		_0x13A34.position.copy(_0x1389A[2]);
		_0x13A34.rotation.y = THREE.Math.degToRad(180);
		cars[_0x13284].add(_0x13A34);
		_0x13A86.position.copy(_0x1389A[3]);
		cars[_0x13284].add(_0x13A86)
	})
}
