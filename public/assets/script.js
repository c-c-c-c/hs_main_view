"use strict";

var WIDTH = 800;
var HEIGHT = 600;
var c_radian = 0;
var r_radian = 0;
var light = void 0;
var ambient = void 0;
var hsGeoGruoup;

// レンダラー
var renderer = new THREE.WebGLRenderer({
  preserveDrawingBuffer: true
});
renderer.setSize(WIDTH, HEIGHT);
renderer.setClearColor(0xffffff);
renderer.autoClearColor = false;
document.body.appendChild(renderer.domElement);

// メイン描画用のシーンとカメラ
var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(70, WIDTH / HEIGHT, 1, 100);

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

var loader = new THREE.JSONLoader();
var modelPath = '../src/data/hs300k.json';
// modelPath = "https://s3-us-west-2.amazonaws.com/s.cdpn.io/1538236/hs300k.json";
var model_hs = void 0;
var model_pn = void 0;
var mesh;

loader.load(modelPath, function (geo, mat) {
  var geometry = geo;
  var material = mat;
  var scale_hs = 1;
  //let BasicMat = new THREE.MeshBasicMaterial(mat);
  var BasicMat = new THREE.MeshBasicMaterial(mat);
  var PhongMat = new THREE.MeshPhongMaterial(mat);
  BasicMat.color = new THREE.Color("#ffffff");
  BasicMat.wireframe = true;

  model_hs = new THREE.Mesh(geo, BasicMat);
  model_pn = new THREE.Mesh(geo, PhongMat);

  model_hs.scale.set(scale_hs, scale_hs, scale_hs);
  model_pn.scale.set(scale_hs * 1.05, scale_hs * 1.05, scale_hs * 1.05);
  model_pn.material.color = new THREE.Color("#cccccc");
  model_hs.material.opacity = 0.01;
  model_hs.material.transparent = true;

  var p_geometry = new THREE.PlaneGeometry(0.3, 0.1, 1);
  var p_material = new THREE.MeshBasicMaterial({ color: 0xff0000, side: THREE.DoubleSide });
  var plane = new THREE.Mesh(p_geometry, p_material);
  plane.rotation.x = 1.6;
  plane.position.y = 0.6;
  plane.position.z = 2;
  // plane.position.x =2;

  hsGeoGruoup = new THREE.Group();
  // 先ほどのboxをグループに追加
  hsGeoGruoup.add(plane);
  //hsGeoGruoup.add(model_pn);
  hsGeoGruoup.add(model_hs);
  scene.add(hsGeoGruoup);

  //scene.add(model_hs);　　
  //scene.add(model_pn);　　


  // var box = new THREE.BoxGeometry(2, 2, 2);
  // var mat = new THREE.MeshBasicMaterial({
  //   color: 0xffffff,
  //   wireframe: true
  // });
  // mesh = new THREE.Mesh(box, mat);
  // scene.add(mesh);


  // 背景オブジェクト用のシーンとメッシュ


  var bg_geometry = new THREE.PlaneGeometry(WIDTH, HEIGHT, 10, 10);
  var bg_material = new THREE.MeshBasicMaterial({
    color: 0x000000,
    transparent: true,
    opacity: 0.01
  });

  var bg = new THREE.Mesh(bg_geometry, bg_material);
  bg.position.x = WIDTH / 2;
  bg.position.y = HEIGHT / 2;
  scene_bg.add(bg);

  //線の描画
  var maxpoints = 30;

  main();
});

function main() {

  r_radian += 0.01;

  //cameraの位置を設定
  camera.position.set(0, 7, 0);
  camera.lookAt({ x: 0, y: 0, z: 0 });
  // model_hs.rotation.y +=.06;
  hsGeoGruoup.rotation.y += 5.9 * (2 * 3.14 / 40);
  // model_hs.position.y += (Math.sin(r_radian) - Math.sin(r_radian-0.01))*8;
  // model_pn.position.y += (Math.sin(r_radian) - Math.sin(r_radian-0.01))*8;

  renderer.render(scene_bg, camera_bg);
  renderer.render(scene, camera);

  requestAnimationFrame(main);
}
//# sourceMappingURL=script.js.map