if ( WEBGL.isWebGLAvailable() === false ) {
    
    document.body.appendChild( WEBGL.getWebGLErrorMessage() );
    
}

var radius = 6371;

var MARGIN = 0;
var SCREEN_HEIGHT = window.innerHeight - MARGIN * 2;
var SCREEN_WIDTH = window.innerWidth;

var camera, controls, scene, renderer;

var geometry, material, circle, spaceShip;
var circleObj = new THREE.Object3D();

var dirLight;

var composer;

var textureLoader = new THREE.TextureLoader();

var d, dStation = new THREE.Vector3();
var camPosition = new THREE.Vector3();
var shipPosition = new THREE.Vector3();

var clock = new THREE.Clock();

var leftB = document.getElementById('left-border');
var rightB = document.getElementById('right-border');

var topB = document.getElementById('top-border');
var botB = document.getElementById('bot-border');


function init() {
    
    camera = new THREE.PerspectiveCamera( 25, SCREEN_WIDTH / SCREEN_HEIGHT, 50, 1e7 );
    camera.position.z = radius * 5;
    
    scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2( 0x000000, 0.00000025 );
    
    dirLight = new THREE.DirectionalLight( 0xffffff );
    dirLight.position.set( - 1, 0, 1 ).normalize();
    scene.add( dirLight );
    
    // space station
    
    geometry = new THREE.SphereGeometry( 6371, 100, 50 );
    material = new THREE.MeshBasicMaterial( { color: 0xe5dabd } );
    circle = new THREE.Mesh( geometry, material );
    //scene.add( circle );
    
    spaceShip = Models.spaceShip();
    spaceShip.scale.set(100,100,100);
    scene.add(spaceShip);
    
    // Space station tracking
    
    circleObj.position = geometry.vertices[0].clone();
    
    //stars
    
    var i, r = radius, starsGeometry = [ new THREE.BufferGeometry(), new THREE.BufferGeometry() ];
    
    var vertices1 = [];
    var vertices2 = [];
    
    var vertex = new THREE.Vector3();
    
    for ( i = 0; i < 250; i ++ ) {
        
        vertex.x = Math.random() * 2 - 1;
        vertex.y = Math.random() * 2 - 1;
        vertex.z = Math.random() * 2 - 1;
        vertex.multiplyScalar( r );
        
        vertices1.push( vertex.x, vertex.y, vertex.z );
        
    }
    
    for ( i = 0; i < 1500; i ++ ) {
        
        vertex.x = Math.random() * 2 - 1;
        vertex.y = Math.random() * 2 - 1;
        vertex.z = Math.random() * 2 - 1;
        vertex.multiplyScalar( r );
        
        vertices2.push( vertex.x, vertex.y, vertex.z );
        
    }
    
    starsGeometry[ 0 ].addAttribute( 'position', new THREE.Float32BufferAttribute( vertices1, 3 ) );
    starsGeometry[ 1 ].addAttribute( 'position', new THREE.Float32BufferAttribute( vertices2, 3 ) );
    
    var stars;
    var starsMaterials = [
                          new THREE.PointsMaterial( { color: 0x555555, size: 2, sizeAttenuation: false } ),
                          new THREE.PointsMaterial( { color: 0x555555, size: 1, sizeAttenuation: false } ),
                          new THREE.PointsMaterial( { color: 0x333333, size: 2, sizeAttenuation: false } ),
                          new THREE.PointsMaterial( { color: 0x3a3a3a, size: 1, sizeAttenuation: false } ),
                          new THREE.PointsMaterial( { color: 0x1a1a1a, size: 2, sizeAttenuation: false } ),
                          new THREE.PointsMaterial( { color: 0x1a1a1a, size: 1, sizeAttenuation: false } )
                          ];
    
    for ( i = 10; i < 30; i ++ ) {
        
        stars = new THREE.Points( starsGeometry[ i % 2 ], starsMaterials[ i % 6 ] );
        
        stars.rotation.x = Math.random() * 6;
        stars.rotation.y = Math.random() * 6;
        stars.rotation.z = Math.random() * 6;
        stars.scale.setScalar( i * 10 );
        
        stars.matrixAutoUpdate = false;
        stars.updateMatrix();
        
        scene.add( stars );
        
    }
    
    renderer = new THREE.WebGLRenderer( { antialias: true } );
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( SCREEN_WIDTH, SCREEN_HEIGHT );
    document.body.appendChild( renderer.domElement );
    
    //
    
    controls = new THREE.FlyControls( camera );
    
    controls.movementSpeed = 1000;
    controls.domElement = renderer.domElement;
    controls.rollSpeed = Math.PI / 24;
    controls.autoForward = false;
    controls.dragToLook = false;
    
    window.addEventListener( 'resize', onWindowResize, false );
    
    // postprocessing
    
    var renderModel = new THREE.RenderPass( scene, camera );
    var effectFilm = new THREE.FilmPass( 0.35, 0.75, 2048, false );
    
    effectFilm.renderToScreen = true;
    
    composer = new THREE.EffectComposer( renderer );
    
    composer.addPass( renderModel );
    composer.addPass( effectFilm );
    
}

function onWindowResize() {
    
    SCREEN_HEIGHT = window.innerHeight;
    SCREEN_WIDTH = window.innerWidth;
    
    renderer.setSize( SCREEN_WIDTH, SCREEN_HEIGHT );
    
    camera.aspect = SCREEN_WIDTH / SCREEN_HEIGHT;
    camera.updateProjectionMatrix();
    
    composer.reset();
    
}

function animate() {
    
    requestAnimationFrame( animate );
    
    renderer.clear();
    spaceShip.rotation.y += .01;
    renderer.render( scene, camera );
    coordinates();
    render();
}

function screenPos() {
    
    var vector = new THREE.Vector3();
    
    var widthHalf = 0.5*SCREEN_WIDTH;
    var heightHalf = 0.5*SCREEN_HEIGHT;
    
    circleObj.updateMatrixWorld();
    vector.setFromMatrixPosition(circleObj.matrixWorld);
    vector.project(camera);
    
    vector.x = ( vector.x * widthHalf ) + widthHalf;
    vector.y = - ( vector.y * heightHalf ) + heightHalf;
    
    document.getElementById('left-border').style.backgroundColor = "black";
    document.getElementById('right-border').style.backgroundColor = "black";
    document.getElementById('top-border').style.backgroundColor = "black";
    document.getElementById('bot-border').style.backgroundColor = "black";
    
    if (vector.x < 0) {
        document.getElementById('left-border').style.backgroundColor = "red";
    } else if (vector.x > SCREEN_WIDTH) {
        document.getElementById('right-border').style.backgroundColor = "red";
    }
    
    if (vector.y < 0) {
        document.getElementById('top-border').style.backgroundColor = "red";
    } else if (vector.y > SCREEN_HEIGHT) {
        document.getElementById('bot-border').style.backgroundColor = "red";
    }
}

function render() {
    
    var delta = clock.getDelta();
    
    dStation = camera.position.length();
    d = (dStation - radius * 1.01);
    
    controls.movementSpeed = 0.33 * d;
    
    controls.update( delta );
    composer.render( delta );
    
    screenPos();
}

function coordinates() {
    //Retrieves ships coordinates relative to the camera
    shipPosition.setFromMatrixPosition( circleObj.matrixWorld );
    shipPosition.project(camera);
    
    //                console.log("Ship: "+Math.ceil(shipPosition.x*100)+", "+Math.ceil(shipPosition.y*100)+", "+Math.floor(shipPosition.z));
    document.getElementById('coordinate-info').innerHTML = "x: " + Math.ceil(shipPosition.x*100)+ "<br>y: " + Math.ceil(shipPosition.y*100) + "<br>z: " + Math.floor(shipPosition.z);
}
