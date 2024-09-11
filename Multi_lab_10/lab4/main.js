function init(){
    var scene = new THREE.Scene();
    var gui = new dat.GUI();
    
    var sphereMaterial = getMaterial('rgb(255, 245, 245)');
    var sphere = getSphere(sphereMaterial, 1 ,24);
    
    var sphereGrid = getSphereGrid(sphereMaterial, 10, 3);
    var planeMaterial = getMaterial('rgb(255, 255, 255)');
    var plane = getPlane(planeMaterial, 30);
    
    var lightLeft = getSpotLight(1, 'rgb(255, 220, 180)');
    
    sphere.position.y = sphere.geometry.parameters.radius;
    plane.rotation.x = Math.PI/2;
    
    lightLeft.position.x = -5;
    lightLeft.position.y = 4;
    lightLeft.position.z = -4;
    
    var loader = new THREE.TextureLoader();
    sphereMaterial.map = loader.load('assets/textures/concrete.jpg');
    planeMaterial.map = loader.load('assets/textures/checkerboard.jpg');
    
    var folder1 = gui.addFolder('light-1');
    folder1.add(lightLeft, 'intensity', 0, 10);
    folder1.add(lightLeft.position, 'x', -5, 30);
    folder1.add(lightLeft.position, 'y', -5, 30);
    folder1.add(lightLeft.position, 'z', -5, 30);

    var folder2 = gui.addFolder('materials');
    folder2.add(sphereMaterial, 'roughness', 0, 1);
    folder2.add(planeMaterial, 'roughness', 0, 1);
    folder2.add(sphereMaterial, 'metalness', 0, 1);
    folder2.add(planeMaterial, 'metalness', 0, 1);

    folder2.open();

    // scene.add(sphere);
    scene.add(plane);
    scene.add(lightLeft);
    scene.add(sphereGrid);

    var camera = new THREE.PerspectiveCamera(
        45, window.innerWidth / window.innerHeight, 1, 1000
    );

    camera.position.z = 7;
    camera.position.x = -2;
    camera.position.y = 7;
    camera.lookAt(new THREE.Vector3(0, 0, 0));

    var renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;
    document.getElementById('webgl').appendChild(renderer.domElement);

    var controls = new THREE.OrbitControls(camera, renderer.domElement);

    update(renderer, scene, camera, controls);
}

function getSphere(material, size, segments){
    var geometry = new THREE.SphereGeometry(size, segments, segments);
    var obj = new THREE.Mesh(geometry, material);
    obj.castShadow = true;

    return obj;
}

function getMaterial(color){
    var selectedMaterial;
    var materialOption = {
        color: color === undefined ? 'rgb(255, 255, 255)' : color,
    };

    selectedMaterial = new THREE.MeshStandardMaterial(materialOption);

    return selectedMaterial;
}

function getSpotLight(intensity, color){
    color = color === undefined ? 'rgb(255, 255, 255)' : color;
    var light = new THREE.SpotLight(color, intensity);
    light.castShadow = true;
    light.penumbra = 0.5;

    light.shadow.mapSize.width = 2048;
    light.shadow.mapSize.height = 2048;
    light.shadow.bias = 0.001;

    return light;
}

function getPlane(material, size){
    var geometry = new THREE.PlaneGeometry(size, size);
    material.side = THREE.DoubleSide;
    var obj = new THREE.Mesh(geometry, material);
    obj.receiveShadow = true;

    return obj;
}

function getSphereGrid(sphereMaterial, amount, separationMultiplier) {
    var group = new THREE.Group();

    for (var i=0; i<amount; i++){
        var obj = getSphere(sphereMaterial, 1, 24);
        obj.position.x = i * separationMultiplier;
        obj.position.y = obj.geometry.parameters.radius;
        group.add(obj);
        for (var j=1; j<amount; j++){
            var obj = getSphere(sphereMaterial, 1, 24);
            obj.position.x = i * separationMultiplier;
            obj.position.y = obj.geometry.parameters.radius;
            obj.position.z = j * separationMultiplier;
            group.add(obj);
        }
    }

    group.position.x = -(separationMultiplier * (amount-1)) / 2;
    group.position.z = -(separationMultiplier * (amount-1)) / 2;

    return group;
}

function update(renderer, scene, camera, controls){
    controls.update();
    renderer.render(scene, camera);
    requestAnimationFrame(function() {
        update(renderer, scene, camera, controls);
    });
}

init();