let scene, camera, renderer, raycaster = new THREE.Raycaster(), mouse = new THREE.Vector2(), clickableObjects = [];

init();
animate();

function init() {
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x87CEFA);
    camera = new THREE.PerspectiveCamera(55, window.innerWidth / window.innerHeight, 1, 20000);
    camera.position.set(0, 50, 100);
    camera.lookAt(0, -15, 0);

    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    document.body.appendChild(renderer.domElement);

    const controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.minAzimuthAngle = -Math.PI / 8;
    controls.maxAzimuthAngle = Math.PI / 8;
    controls.minPolarAngle = Math.PI / 4;
    controls.maxPolarAngle = 2 * Math.PI / 4;
    controls.minDistance = 50;
    controls.maxDistance = 200;
    controls.enablePan = false;

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.2);
    scene.add(ambientLight);

    const sunLight = new THREE.DirectionalLight(0xffffff, 1.2);
    sunLight.position.set(50, 100, 50);
    sunLight.castShadow = true;
    sunLight.shadow.mapSize.width = 512;
    sunLight.shadow.mapSize.height = 512;
    sunLight.shadow.camera.near = 0.5;
    sunLight.shadow.camera.far = 500;
    scene.add(sunLight);

    const textureLoader = new THREE.TextureLoader();
    const grassTexture = textureLoader.load('static/images/grass.jpg');
    const mansionTexture = textureLoader.load('static/images/mansion.png');

    createGround(grassTexture);
    createCity();
    createPark();
    createMansions(mansionTexture);
    addQuestionMarks();

    renderer.domElement.addEventListener('click', onClick, false);
    window.addEventListener('resize', onWindowResize, false);
}

function createGround(texture, yLevel = -11) {
    const groundGeometry = new THREE.PlaneGeometry(5000, 5000);
    const groundMaterial = new THREE.MeshLambertMaterial({ map: texture });
    const ground = new THREE.Mesh(groundGeometry, groundMaterial);
    
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = yLevel;
    ground.receiveShadow = true;
    scene.add(ground);
}

function createCity() {
    const buildingMaterial = new THREE.MeshLambertMaterial({ color: 0x888888 });
    const windowMaterial = new THREE.MeshLambertMaterial({ color: 0xccddff });
    const supermarketMaterial = new THREE.MeshLambertMaterial({ color: 0xDAA520 }); // Golden color for supermarket

    const cityZOffset = -20;  // Adjust this value to move the city more or less in the Z direction
    const cityXOffset = 30;  // Adjust this value to move the city more or less in the X direction

    for (let i = -40; i <= -10; i += 5) {
        for (let j = -10; j <= 10; j += 5) {
            const height = Math.random() * 30 + 10;
            const building = new THREE.Mesh(new THREE.BoxGeometry(4, height, 4), buildingMaterial);
            building.position.set(i + cityXOffset, height / 2 - 10, j + cityZOffset);
            scene.add(building);

            const windowGeometry = new THREE.BoxGeometry(1, 1, 0.05);
            for (let w = -1; w <= 1; w += 2) {
                for (let h = 5; h < height; h += 3) {
                    const windowMesh = new THREE.Mesh(windowGeometry, windowMaterial);
                    windowMesh.position.set(i + w + cityXOffset, h - 10, j + 2 + cityZOffset);
                    scene.add(windowMesh);

                    const windowMeshOpposite = windowMesh.clone();
                    windowMeshOpposite.position.z = j - 2 + cityZOffset;
                    scene.add(windowMeshOpposite);
                }
            }
        }
    }

    // Supermarket
    const supermarketGeom = new THREE.BoxGeometry(20, 10, 20);
    const supermarket = new THREE.Mesh(supermarketGeom, supermarketMaterial);
    supermarket.position.set(-70 + cityXOffset, -5, cityZOffset);  // Positioned behind the apartment buildings
    scene.add(supermarket);

    // Supermarket label
    new THREE.FontLoader().load('https://threejs.org/examples/fonts/helvetiker_regular.typeface.json', function (font) {
        const labelGeometry = new THREE.TextGeometry('SUPERMARKET', { font: font, size: 2, height: 0.1 });
        const labelMesh = new THREE.Mesh(labelGeometry, new THREE.MeshLambertMaterial({ color: 0xffffff })); // White color for the text
        labelMesh.position.set(supermarket.position.x - 10, supermarket.position.y + 6, supermarket.position.z + 10); // Adjust the position as needed
        scene.add(labelMesh);
    });
}



function createPark() {
    const treeColors = [0x228B22, 0x32CD32, 0x008000];
    const trunkMaterial = new THREE.MeshLambertMaterial({ color: 0x8B4513 });
    const benchMaterial = new THREE.MeshLambertMaterial({ color: 0x654321 });

    for (let i = -35; i <= 60; i += Math.random() * 5 + 5) {
        for (let j = 15 + Math.random() * 5; j <= 35; j += Math.random() * 5 + 5) {
            const trunkPos = new THREE.Vector3(i + (Math.random() * 10 - 5), -8, j + (Math.random() * 10 - 5));

            const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.5, 5), trunkMaterial);
            trunk.position.copy(trunkPos);
            scene.add(trunk);

            const leaves = new THREE.Mesh(new THREE.SphereGeometry(4), new THREE.MeshLambertMaterial({ color: treeColors[Math.floor(Math.random() * treeColors.length)] }));
            leaves.position.set(trunkPos.x, trunkPos.y + 6, trunkPos.z);
            scene.add(leaves);
        }
    }

    for (let i = -20; i <= 50; i += 35) {
        for (let j = 20; j <= 30; j += 10) {
            const benchBase = new THREE.Mesh(new THREE.BoxGeometry(10, 0.5, 2), benchMaterial);
            benchBase.position.set(i, -10.25, j);
            benchBase.rotation.y = Math.PI; // Rotate to face the camera
            scene.add(benchBase);

            const benchBack = new THREE.Mesh(new THREE.BoxGeometry(10, 2, 0.5), benchMaterial);
            benchBack.position.set(i, -9.25, j - 1);
            benchBack.rotation.y = Math.PI; // Rotate to face the camera
            scene.add(benchBack);
        }
    }

}


function createMansions() {
    const mansionMaterial = new THREE.MeshLambertMaterial({ color: 0x8B4513 });
    const windowMaterial = new THREE.MeshLambertMaterial({ color: 0xccddff });
    const roofMaterial = new THREE.MeshLambertMaterial({ color: 0x8B0000 });
    const doorMaterial = new THREE.MeshLambertMaterial({ color: 0x654321 });

    const mansionPosition = { x: 50, y: 0, z: -20 };

    // Main Body of Mansion (Brown Box)
    const mansion = new THREE.Mesh(new THREE.BoxGeometry(20, 20, 20), mansionMaterial);
    mansion.position.set(mansionPosition.x, mansionPosition.y, mansionPosition.z);
    scene.add(mansion);

    // Windows
    const windowGeom = new THREE.BoxGeometry(5, 5, 1);  // Window dimensions

    const leftWindow = new THREE.Mesh(windowGeom, windowMaterial);
    leftWindow.position.set(mansionPosition.x - 5, mansionPosition.y + 5, mansionPosition.z + 10);
    scene.add(leftWindow);

    const rightWindow = new THREE.Mesh(windowGeom, windowMaterial);
    rightWindow.position.set(mansionPosition.x + 5, mansionPosition.y + 5, mansionPosition.z + 10);
    scene.add(rightWindow);


    // Door
    const doorGeom = new THREE.BoxGeometry(6, 10, 1);
    const doorMesh = new THREE.Mesh(doorGeom, doorMaterial);
    doorMesh.position.set(mansionPosition.x, mansionPosition.y - 5, mansionPosition.z + 10); // Positioned at the front of the mansion and slightly below center
    scene.add(doorMesh);

    // Mansion Roof (Pyramid)
    const mansionRoofGeom = new THREE.ConeGeometry(20, 10, 4, 1, false);
    const mansionRoof = new THREE.Mesh(mansionRoofGeom, roofMaterial);
    mansionRoof.rotation.y = Math.PI / 4;  // Rotate the pyramid by 45 degrees around the Y-axis
    mansionRoof.position.set(mansionPosition.x, mansionPosition.y + 15, mansionPosition.z); 
    scene.add(mansionRoof);
}








function addQuestionMarks() {
    const questionMarkPositions = [
        { x: -43, y: 5, z: -20 },
        { x: -25, y: 5, z: 25 },
        { x: 3, y: 30, z: -15 },
        { x: 47, y: 60, z: -50 },
        { x: 47, y: 24, z: -20 }
    ];
    new THREE.FontLoader().load('https://threejs.org/examples/fonts/helvetiker_regular.typeface.json', function (font) {
        const textGeometry = new THREE.TextGeometry('?', { font: font, size: 10, height: 2, curveSegments: 12, bevelEnabled: true, bevelThickness: 0.5, bevelSize: 0.25, bevelSegments: 5 });
        const materials = [new THREE.MeshPhongMaterial({ color: 0xff0000 }), new THREE.MeshPhongMaterial({ color: 0x00ff00 }), new THREE.MeshPhongMaterial({ color: 0x0000ff }), new THREE.MeshPhongMaterial({ color: 0xffff00 }), new THREE.MeshPhongMaterial({ color: 0x800080 })]; // Added purple color

        materials.forEach((material, i) => {
            const textMesh = new THREE.Mesh(textGeometry, material);
            textMesh.position.set(questionMarkPositions[i].x, questionMarkPositions[i].y, questionMarkPositions[i].z);
            scene.add(textMesh);
            clickableObjects.push(textMesh);
        });

    });
}

function animate() {
    requestAnimationFrame(animate);
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

    if (intersects.length > 0) openModal(`modal${clickableObjects.indexOf(intersects[0].object) + 1}`);
}

function openModal(modalId) {
    const modal = document.getElementById(modalId);
    modal.style.display = "block";
    modal.addEventListener('click', (event) => {
        if (event.target.className === "close" || event.target === modal) modal.style.display = "none";
    });
}
