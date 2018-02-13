
var WIDTH = 800;
var HEIGHT = 600;
let c_radian = 0;
let r_radian = 0;
let light;
let ambient;
var hsGeoGruoup = new THREE.Group();;

const colorConf = {
	'0': '#ff0000',
	'1': '#f0f000',
	'2': '#00e000',
	'3': '#00ffff',
	'4': '#0000ff',
}

// レンダラー
let renderer = new THREE.WebGLRenderer({
  preserveDrawingBuffer:true
});
renderer.setSize( WIDTH, HEIGHT );
renderer.setClearColor(0xffffff);
renderer.autoClearColor = false;
document.body.appendChild(renderer.domElement);

// メイン描画用のシーンとカメラ
var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera( 70, WIDTH / HEIGHT, 1, 100 );

//light
light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(0, 200, 80);
scene.add(light);
ambient = new THREE.AmbientLight(0x404040);
scene.add(ambient);

//背景の定義
var scene_bg = new THREE.Scene();
var camera_bg = new THREE.OrthographicCamera(0, WIDTH, HEIGHT, 0, 0, 1000);
// メイン描画オブジェクト、とりあえずBox

let loader = new THREE.JSONLoader();　　
let modelPath = '../src/data/hs300k.json'
// modelPath = "https://s3-us-west-2.amazonaws.com/s.cdpn.io/1538236/hs300k.json";
let model_hs;
let model_pn;
var mesh;
var plane = {};


loader.load(modelPath, (geo, mat) => {
	let geometry = geo;
	let material = mat;
	let scale_hs = 1;
  //let BasicMat = new THREE.MeshBasicMaterial(mat);
  let BasicMat = new THREE.MeshBasicMaterial(mat);
  let PhongMat = new THREE.MeshPhongMaterial(mat);
  BasicMat.color = new THREE.Color("#ffffff");
  BasicMat.wireframe = true;

  model_hs = new THREE.Mesh(geo, BasicMat);
  model_pn = new THREE.Mesh(geo, PhongMat);

	model_hs.scale.set(scale_hs, scale_hs, scale_hs);
	model_pn.scale.set(scale_hs*1.05, scale_hs*1.05, scale_hs*1.05);
	model_pn.material.color = new THREE.Color("#cccccc");
	model_hs.material.opacity =0.01;
	model_hs.material.transparent = true;

	let p_geometry = new THREE.PlaneGeometry( 0.15, 0.1);
	// p_geometry.rotation.y = (Math.PI) / 4  ;



	// ハンドスピナーとLEDライト５個をグループに
	// let hsGeoGruoup = new THREE.Group();
	hsGeoGruoup.add(model_hs);

	for (let i=0;i < 5; i++) {
		let p_material = new THREE.MeshBasicMaterial( { side: THREE.DoubleSide} );
		plane[i] = new THREE.Mesh( p_geometry, p_material );
	  plane[i].rotation.x = (Math.PI) / 2  ;

		//平面の位置を少しずつずらす。
		plane[i].position.z =0.14*i + 1.5;
		//画面に対する奥行き方向は変更なしで2
		plane[i].position.y =1.6;

		plane[i].material.color = new THREE.Color(colorConf[i]);

	  // 先ほどのboxをグループに追加
	  hsGeoGruoup.add(plane[i]);
	  //hsGeoGruoup.add(model_pn);
	}

	scene.add( hsGeoGruoup );


  var bg_geometry = new THREE.PlaneGeometry(WIDTH, HEIGHT, 10, 10);
  var bg_material = new THREE.MeshBasicMaterial({
    color: 0x000000,
    transparent: true,
    opacity: 0.01,
  });


  var bg = new THREE.Mesh(bg_geometry, bg_material);
  bg.position.x = WIDTH/2;
  bg.position.y = HEIGHT/2;
  scene_bg.add(bg);


	//線の描画
	var maxpoints = 30;

  main();
});

let count = 0;

function main() {

	//cameraの位置を設定
	camera.position.set(0, 7, 0);
	camera.lookAt({x:0, y:0, z:0 });

  //hsGeoGruoup.rotation.y += 0.23 ;
  hsGeoGruoup.rotation.y += (2*Math.PI /60) ;


	// model_hs.position.y += (Math.sin(r_radian) - Math.sin(r_radian-0.01))*8;
	// model_pn.position.y += (Math.sin(r_radian) - Math.sin(r_radian-0.01))*8;

	// 色変え
	for (let j=0; j<5; j++) {
		if(count % 2 == 0) {
			plane[j].material.color = new THREE.Color(colorConf[j]);
		} else {
			plane[j].material.color = new THREE.Color(colorConf[j+1]);
		}
	}
	count ++;

  renderer.render( scene_bg, camera_bg );
  renderer.render( scene, camera );

  requestAnimationFrame(main);
}

var colorTermData ={};

$(function () {
  $('#exe_btn').click(function() {
    // 分母
		$('.form_container').each(function(index, element){
			let term_id = $(this).attr("id");
			colorTermData[term_id] = {
				'which_led'
					: $('#'+term_id+' .which_led').val(),
				'how_often_bunbo'
					: $('#'+ term_id+' .how_often_bunbo').val(),
				'how_often_bunshi'
					: $('#'+ term_id+' .how_often_bunshi').val(),
				'led_color'
					: $('#'+ term_id+' .led_color').val()
			};


		});

		console.log(colorTermData);
  })
});
