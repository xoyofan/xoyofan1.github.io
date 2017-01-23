    var camera, scene, renderer;
	var controls,directionalLight;

	var GLWIDTH = 800,GLHEIGHT = 800;
	var Node = new Array(new Array(3),new Array(3));
	var curPartsIndex = [0,0,0]; 

	var price = new Array(new Array(6),new Array(2),new Array(2),new Array(2));
	price[0] = [200,250,300,350,400,450,500];
	price[1] = [400,450];
	price[2] = [220,250];
	price[3] = [50,70];
	var curImgIndex = [0,0,0,0];
	var totalPrice = 1000;
	$(function () {
		
		for(var i=0;i<3;i++){
			Node[0][i] = [];
			Node[1][i] = [];
		}


		$(".Texture img").click(function(){
   			$(".Texture img").each(function(){
   				$(this).removeClass("selected");
   			});
   			$(this).addClass("selected"); 

			var texture = new THREE.Texture();
			var loaderTex = new THREE.ImageLoader(  );
			loaderTex.load( $(this).attr("src"), function ( image ) {
				texture.image = image;
				texture.needsUpdate = true;
			} );
			var curPart = Node[curPartsIndex[0]][0];
			for(var i =0; i< curPart.length;i++){
				curPart[i].material.map = texture;
			} 

		});


		$(".Model img").click(function(){
			var str = $(this).attr("src");
			//var substr =str.match( /(img/=?)(\S*)(?=.jpg)/ );
			var name = str.substring(str.indexOf("/")+1,str.indexOf(".jpg"));

            var index = $(this).index();
            if(name.indexOf("body")!= -1){
            	changePart(index,0);
            }else if(name.indexOf("neck")!= -1){
            	changePart(index,1);
            }else if(name.indexOf("button")!= -1){
            	changePart(index,2);
            }
 			
		});

		$("#menu img").click(function(){
			var str = $(this).attr("src");
			var name = str.substring(str.indexOf("/")+1,str.indexOf(".jpg"));

            var index = $(this).index();
            if(name.indexOf("body")!= -1){
            	changePrice("body",1,index);
            }else if(name.indexOf("neck")!= -1){
            	changePrice("neck",2,index);
            }else if(name.indexOf("button")!= -1){
            	changePrice("button",3,index);
            }else if(name.indexOf("texture")!= -1) {
            	changePrice("bodyTexture",0,index);
            }
 			
		})	


	});
	

	init();
	animate();

	function changePrice(idName,id,index){

		var preIndex = curImgIndex[id];
		if(preIndex ==index) return;
    	$("#"+idName+" .price").html("+ " +price[id][index]+ " euro&nbsp;");

    	totalPrice +=price[id][index] - price[id][preIndex];
    	$("#toalPrice").html("Total Price:" +totalPrice+ " euro&nbsp;");
    	curImgIndex[id] = index;
	}

	function changePart(curIndex,partIndex){

		var preIndex = curPartsIndex[partIndex];
		if(curIndex==preIndex) return;//clicked is the showing model
    	var prePart = Node[preIndex][partIndex]; 
    	var curPart = Node[curIndex][partIndex]; 
    	for(var i = 0 ; i < prePart.length;i++){
    		prePart[i].visible = false;
    	}
    	for(var i = 0 ; i < curPart.length;i++){
    		curPart[i].visible = true;
    	}
    	curPartsIndex[partIndex] = curIndex;
	}

	function init() {
		
		GLWIDTH = $("#cvgl").width();
		GLHEIGHT = $("#cvgl").height();

		camera = new THREE.PerspectiveCamera( 45, GLWIDTH /GLHEIGHT, 1, 20000 );
		camera.position.z = 1250;

		controls = new THREE.TrackballControls( camera );

		// controls.rotateSpeed = 0.2;
		// controls.zoomSpeed = 1.2;
		// controls.panSpeed = 0.8;

		// scene

		scene = new THREE.Scene();

		var ambient = new THREE.AmbientLight( 0x444444 );
		scene.add( ambient );

		directionalLight = new THREE.DirectionalLight( 0xffffff );
		directionalLight.position.set( 0, 0, 1 ).normalize();
		scene.add( directionalLight );

		// model

		//load model and pick out its parts.
		loadMainModel('obj/','jita'); 
		loadPartsModel('obj/','body-1',1,0);
		loadPartsModel('obj/','neck-1',1,1);
		loadPartsModel('obj/','button-1',1,2);


		var canvasgl = document.getElementById('cvgl');
		renderer = new THREE.WebGLRenderer({canvas:canvasgl, antialias: true});
		//renderer.setPixelRatio( GLWIDTH /GLHEIGHT );
		renderer.setSize(GLWIDTH ,GLHEIGHT );
		renderer.setClearColor(new THREE.Color(0x888888));


		//

		window.addEventListener( 'resize', onWindowResize, false );

	}

	function onWindowResize() {

		GLWIDTH = window.innerWidth ;
		GLHEIGHT = window.innerHeight* 0.7;

		camera.aspect = GLWIDTH / GLHEIGHT;
		camera.updateProjectionMatrix();

		renderer.setSize(GLWIDTH, GLHEIGHT );

	}


	function animate() {

		requestAnimationFrame( animate );
		render();
		controls.update();

	}

	function render() {

		directionalLight.position.copy(camera.position);
		directionalLight.rotation.copy(camera.rotation);

		renderer.render( scene, camera );
		
	}

	function loadPartsModel(path,name,i,j){
		var mtlLoader = new THREE.MTLLoader();
		mtlLoader.setPath( path );
		mtlLoader.load( name + '.mtl', function( materials ) {
			materials.preload();
			var objLoader = new THREE.OBJLoader();
			objLoader.setPath( path );
			objLoader.setMaterials( materials );
			objLoader.load( name + '.obj', function ( object ) {
				object.traverse( function ( child ) {
					if ( child instanceof THREE.Mesh ) {
						child.visible = false;
					     Node[i][j].push(child);
					}
				} );
				object.rotateX(Math.PI*0.5);
				object.name = name;
				scene.add( object );
			});
		});
	}

	function loadMainModel(path,name){
		var mtlLoader = new THREE.MTLLoader();
		mtlLoader.setPath( path );
		mtlLoader.load( name + '.mtl', function( materials ) {
			materials.preload();
			var objLoader = new THREE.OBJLoader();
			objLoader.setPath( path );
			objLoader.setMaterials( materials );
			objLoader.load( name + '.obj', function ( object ) {
				object.traverse( function ( child ) {
					if ( child instanceof THREE.Mesh ) {
						if(child.material.name =="body"){
						    Node[0][0].push(child);
						}else if (child.material.name =="neck"){
						    Node[0][1].push(child);
						}else if (child.material.name =="button"){
						    Node[0][2].push(child);
						}
					}
				} );
				object.rotateX(Math.PI*0.5);
				object.name = name;
				scene.add( object );
			} ,function(xhr){
				var percentComplete = xhr.loaded / xhr.total * 100;
				var str = "main model has "+ Math.round(percentComplete, 2) + '% loaded' ;
				$("#loading").html(str);
				if(percentComplete==100){
				    //$("#loading").attr("display","none");
				    $("#loading").hide();
				}
			
			} );


		});
	}