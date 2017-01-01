
if ( WEBVR.isLatestAvailable() === false ) {

    document.body.appendChild( WEBVR.getMessage() );
    $('.browser-warning').show();
}

var camera, scene, renderer;
var effect, controls, shaderMaterial;
var start = Date.now();

init();
animate();

function init() {

    scene = new THREE.Scene();

    var dummy = new THREE.Camera();
    dummy.position.set( 2, 0, 2 );
    dummy.lookAt( scene.position );
    scene.add( dummy );

    camera = new THREE.PerspectiveCamera( 50, window.innerWidth / window.innerHeight, 0.1, 100 );
    dummy.add( camera );

    var geometry = new THREE.TorusKnotGeometry( 0.4, 0.15, 150, 20 );;
    var material = new THREE.MeshStandardMaterial( { roughness: 0.01, metalness: 0.2 } );
    var mesh = new THREE.Mesh( geometry, material );
    mesh.position.y = 0.5;
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    scene.add( mesh );

    // var geometry = new THREE.BoxGeometry( 3, 0.1, 3 );
    // var material = new THREE.MeshStandardMaterial( { roughness: 1.0, metalness: 0.0 } );
    // var mesh = new THREE.Mesh( geometry, material );
    // mesh.position.y = - 0.1;
    // mesh.castShadow = true;
    // mesh.receiveShadow = true;
    // scene.add( mesh );
    var NewColorsShader = THREE.NewColors;
    var AshimaNoise = THREE.AshimaNoise;
    var AshimaNoiseVertexShader = AshimaNoise.vertexShader;
    var NewColorsVertexShader = NewColorsShader.vertexShader;
    var NewColorsFragmentShader = NewColorsShader.fragmentShader;
    shaderMaterial = new THREE.ShaderMaterial( {
            wireframe: true,
            uniforms: { 
                time: { 
                    type: "f", 
                    value: 0.0 
                }		
            },
            vertexShader: AshimaNoiseVertexShader,
            fragmentShader: NewColorsFragmentShader
            
        } );
    var sphereCount = 16;
    for (i = 0; i < sphereCount; i++){
        var geometry = new THREE.IcosahedronGeometry( .2, 5);
        
        var mesh = new THREE.Mesh( geometry, shaderMaterial );  
        mesh.position.x = 5 * Math.cos(2 * Math.PI * i / sphereCount);
        mesh.position.z = 5 * Math.sin(2 * Math.PI * i / sphereCount);
        mesh.rotation.x += Math.floor((Math.random() * 5) + .1);
        mesh.rotation.z += Math.floor((Math.random() * 5) + .1);
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        scene.add( mesh );
    };

    //Points block
    var data = new Float32Array(3993000);
    var colors = new Float32Array(3993000);
    var i = 0;
    for (var x = 0; x <= 100; x++) {
    for (var y = 0; y <= 100; y++) {
        for (var z = 0; z <= 100; z++) {
        data[i * 3] = x - 50;
        data[i * 3 + 1] = y - 50;
        data[i * 3 + 2] = z - 50;
        colors[i * 3] = x / 100;
        colors[i * 3 + 1] = y / 100;
        colors[i * 3 + 2] = z / 100;
        i++;
        }
    }
    }
    var pointgeometry = new THREE.BufferGeometry();
    pointgeometry.addAttribute('position', new THREE.BufferAttribute(data, 3));
    pointgeometry.addAttribute('color', new THREE.BufferAttribute(colors, 3));
    var pointmaterial = new THREE.PointsMaterial( { vertexColors: THREE.VertexColors, size: .001 } );
    particles = new THREE.Points( pointgeometry, pointmaterial );
    scene.add( particles );


    var light = new THREE.DirectionalLight( 0xE692FA );
    light.position.set( - 1, 1.5, 0.5 );
    light.castShadow = true;
    light.shadow.camera.zoom = 4;
    scene.add( light );

    var light = new THREE.DirectionalLight( 0x272B92 );
    light.position.set( 1, 1.5, - 0.5 );
    light.castShadow = true;
    light.shadow.camera.zoom = 4;
    scene.add( light );

    //

    renderer = new THREE.WebGLRenderer( { antialias: true } );
    renderer.setClearColor( 0x101010 );
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( window.innerWidth, window.innerHeight );
    renderer.shadowMap.enabled = true;
    document.getElementById('webvr-container').appendChild( renderer.domElement );

    //

    controls = new THREE.VRControls( camera );
    effect = new THREE.VREffect( renderer );

    if ( WEBVR.isAvailable() === true ) {

        document.body.appendChild( WEBVR.getButton( effect ) );

    }

    //

    window.addEventListener( 'resize', onWindowResize, false );

}

function onWindowResize() {

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    effect.setSize( window.innerWidth, window.innerHeight );

}

function animate() {

    effect.requestAnimationFrame( animate );
    render();

}

function render() {
    var time = performance.now() * 0.0002;
    var mesh = scene.children[ 1 ];
    mesh.rotation.x = time * 2;
    mesh.rotation.y = time * 5;

    controls.update();
    shaderMaterial.uniforms[ 'time' ].value = .0001 * ( Date.now() - start );
    effect.render( scene, camera );

}
