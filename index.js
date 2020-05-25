// Ensure ThreeJS is in global scope for the 'examples/'
global.THREE = require("three");

// Include any additional ThreeJS examples below
require("three/examples/js/controls/OrbitControls");

require("three/examples/js/loaders/GLTFLoader");

let computer, breakfast;

function loadModel(path, scene) {
    let loader = new THREE.GLTFLoader();
    let ret;
    loader.load(path,
        // called when the resource is loaded
        function ( gltf ) {
            ret = gltf;
            gltf.scene.scale.multiplyScalar(2);
            scene.add( gltf.scene );
        },
        // called while loading is progressing
        function ( xhr ) { console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' ); },
        // called when loading has errors
        function ( error ) { console.log( 'An error happened' );
        }
    );
    return ret;
}

const canvasSketch = require("canvas-sketch");

const settings = {
    // Make the loop animated
    animate: true,
    // Get a WebGL canvas rather than 2D
    context: "webgl"
};

const sketch = ({ context }) => {
    // Create a renderer
    const renderer = new THREE.WebGLRenderer({
        canvas: context.canvas
    });

    // WebGL background color
    renderer.setClearColor("#000", 1);
    renderer.setClearColor("#2EAFAC", 1);

    // Setup a camera
    const camera = new THREE.PerspectiveCamera(50, 1, 0.01, 100);
    camera.position.set(0, 0, -10);
    camera.lookAt(new THREE.Vector3());

    // Setup camera controller
    const controls = new THREE.OrbitControls(camera, context.canvas);

    // Setup your scene
    const scene = new THREE.Scene();

    computer = loadModel('models/computer.glb', scene);
    breakfast = loadModel('models/breakfast.glb', scene);

    // Setup a geometry
    const geometry = new THREE.SphereGeometry(1, 32, 16);

    // Setup a material
    const material = new THREE.MeshBasicMaterial({
        color: "red",
        wireframe: true
    });

    // Setup a mesh with geometry + material
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    // draw each frame
    return {
        // Handle resize events here
        resize({ pixelRatio, viewportWidth, viewportHeight }) {
            renderer.setPixelRatio(pixelRatio);
            renderer.setSize(viewportWidth, viewportHeight, false);
            camera.aspect = viewportWidth / viewportHeight;
            camera.updateProjectionMatrix();
        },
        // Update & render your scene here
        render({ time }) {
            scene.rotation.y -= 0.01;
            scene.rotation.z += 0.016;
            controls.update();
            renderer.render(scene, camera);
        },
        // Dispose of events & renderer for cleaner hot-reloading
        unload() {
            controls.dispose();
            renderer.dispose();
        }
    };
};

document.body.addEventListener('click', () => {
    console.log(computer, breakfast)
})

let text = document.createElement('div')
text.innerHTML = `
<p>
Computer Breakfast Club, a better way to disconnect from technology & still be "Extremely Online", coming soon(-ish?)
</p>

3D models: <a href="https://poly.google.com/view/adp5MvenMQm">Breakfast from Ashley Alicea</a> - <a href="https://poly.google.com/view/eCQBPXzmq1C">Computer from Google</a>
`
text.style = `
text-align: center; max-width: 80%; position: absolute; bottom: 4rem; background-color: rgba(255, 255, 255, 50%); border-radius: 4px; font-size: 3rem; font-family: sans-serif;
`

// document.body.appendChild(text)

canvasSketch(sketch, settings);
