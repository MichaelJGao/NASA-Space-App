document.addEventListener('DOMContentLoaded', (event) => {
    

let scene, camera, renderer, water;

    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    //Ray Casting
    const clickableObjects = [];
    //Scene setup
    init();
    animate();
    //Three.js scene
    function init() {
        //camera setup
        scene = new THREE.Scene();
        camera = new THREE.PerspectiveCamera(55, window.innerWidth / window.innerHeight, 1, 20000);
        camera.position.set(30, 30, 100);
        //render setup
        renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setSize(window.innerWidth, window.innerHeight);
        document.body.appendChild(renderer.domElement);

        // disable camera movement
        const controls = new THREE.OrbitControls(camera, renderer.domElement);
        controls.enabled = false;
        // Create a water surface and add sunlight to the scene
        const waterGeometry = new THREE.PlaneBufferGeometry(5000, 5000);
        water = new THREE.Water(waterGeometry, {
            textureWidth: 512,
            textureHeight: 512,
            waterNormals: new THREE.TextureLoader().load('https://threejs.org/examples/textures/waternormals.jpg', function (texture) {
                texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
            }),
            alpha: 1.0,
            sunDirection: new THREE.Vector3(),
            sunColor: 0xffffff,
            waterColor: 0x001e0f,
            distortionScale: 5.0,
            fog: scene.fog !== undefined
        });
        water.rotation.x = -Math.PI / 2;
        scene.add(water);

        const sun = new THREE.DirectionalLight(0xffffff, 0.8);
        sun.position.set(100, 100, 100);
        scene.add(sun);

        // fog to the scene
        scene.fog = new THREE.FogExp2(0xC6E2FF, 0.0005);

        // Gradient Sky
        createGradientSky();

        // 3D QuestionMark
        addQuestionMarks();

        // Event listener
        renderer.domElement.addEventListener('click', onClick, false);

        window.addEventListener('resize', onWindowResize, false);
    }

    function createGradientSky() {
        const skyColorTop = new THREE.Color(0x0077FF);
        const skyColorBottom = new THREE.Color(0xC6E2FF);

        const uniforms = {
            topColor: { value: skyColorTop },
            bottomColor: { value: skyColorBottom },
            offset: { value: 33 },
            exponent: { value: 0.6 }
        };

        scene.fog.color.copy(skyColorBottom);

        const skyGeo = new THREE.SphereBufferGeometry(4000, 32, 15);
        const skyMat = new THREE.ShaderMaterial({
            uniforms: uniforms,
            vertexShader: document.getElementById('vertexShader').textContent,
            fragmentShader: document.getElementById('fragmentShader').textContent,
            side: THREE.BackSide
        });

        const sky = new THREE.Mesh(skyGeo, skyMat);
        scene.add(sky);
    }

    function addQuestionMarks() {
        // font
        const loader = new THREE.FontLoader();
        loader.load('https://threejs.org/examples/fonts/helvetiker_regular.typeface.json', function (font) {
            const textGeometry = new THREE.TextGeometry('?', {
                font: font,
                size: 10,
                height: 2,
                curveSegments: 12,
                bevelEnabled: true,
                bevelThickness: 0.5,
                bevelSize: 0.25,
                bevelOffset: 0,
                bevelSegments: 5
            });

            const materials = [
                new THREE.MeshPhongMaterial({ color: 0xff0000 }), // Red
                new THREE.MeshPhongMaterial({ color: 0x00ff00 }), // Green
                new THREE.MeshPhongMaterial({ color: 0x0000ff }), // Blue
                new THREE.MeshPhongMaterial({ color: 0xffff00 })  // Yellow
            ];

            for (let i = 0; i < 4; i++) {
                const textMesh = new THREE.Mesh(textGeometry, materials[i]);
                textMesh.position.set(-20 + i * 15, 10, 0);
                scene.add(textMesh);
                clickableObjects.push(textMesh);
            }
        });
    }

    function animate() {
        requestAnimationFrame(animate);
        water.material.uniforms['time'].value += 0.1 / 60.0;
        renderer.render(scene, camera);
    }

    function onWindowResize() {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    }

    function onClick(event) {
        event.preventDefault();

        mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

        raycaster.setFromCamera(mouse, camera);
        const intersects = raycaster.intersectObjects(clickableObjects);

        if (intersects.length > 0) {
            const clickedObject = intersects[0].object;
            const index = clickableObjects.indexOf(clickedObject);

            // Open the corresponding modal
            openModal(`modal${index + 1}`);
        }
    }

    function openModal(modalId) {
        const modal = document.getElementById(modalId);
        modal.style.display = "block";
        modal.addEventListener('click', (event) => {
            if (event.target.className === "close" || event.target === modal) {
                modal.style.display = "none";
            }
        });
    }
});