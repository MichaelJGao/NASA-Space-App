
let scene, camera, renderer, earth, ocean;
let buttonAtlantic, buttonCalifornia;
let autoRotate = true;
let isDragging = false;
let previousMousePosition = { x: 0, y: 0 };

// When the DOM content is loaded, call the init() function and start the animation
document.addEventListener('DOMContentLoaded', (event) => {
    init();
    animate();
});

//scene, camera, and other elements
function init() {
    sceneSetup();
    earthSetup();
    oceanSetup();
    buttonsSetup();
    eventSetup();
    earth.scale.set(1.2, 1.2, 1.2);
}

// Three.js
function sceneSetup() {
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 5;
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);
}

// Earth sphere
function earthSetup() {
    const geometry = new THREE.SphereGeometry(1, 128, 128);
    const texture = new THREE.TextureLoader().load('/static/images/earth.png');
    const material = new THREE.MeshBasicMaterial({ map: texture, transparent: true });
    earth = new THREE.Mesh(geometry, material);
    scene.add(earth);
}

// ocean plane
function oceanSetup() {
    const oceanGeometry = new THREE.PlaneGeometry(50, 50, 50, 50);
    const oceanMaterial = new THREE.MeshBasicMaterial({ color: 0x1E90FF, side: THREE.DoubleSide });
    ocean = new THREE.Mesh(oceanGeometry, oceanMaterial);
    ocean.rotation.x = -Math.PI / 2;
    ocean.position.y = -2;
    ocean.visible = false;
    scene.add(ocean);
}

// buttons on the Earth
function buttonsSetup() {
    const buttonGeometry = new THREE.SphereGeometry(0.05, 32, 32);
    const buttonMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });
    buttonAtlantic = new THREE.Mesh(buttonGeometry, buttonMaterial);
    buttonCalifornia = new THREE.Mesh(buttonGeometry, buttonMaterial);
    setPositionOnEarth(buttonAtlantic, 30, 150);
    setPositionOnEarth(buttonCalifornia, 55, 240);
    earth.add(buttonAtlantic, buttonCalifornia);
}

function eventSetup() {
    window.addEventListener('resize', onWindowResize);
    document.addEventListener('click', onDocumentClick);
    document.addEventListener('mousedown', onMouseDown);
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
    document.addEventListener('wheel', onWheelScroll, { passive: false });
}

// object position
function setPositionOnEarth(object, lat, lon) {
    const radius = 1.01;
    const phi = (90 - lat) * (Math.PI / 180);
    const theta = (lon + 180) * (Math.PI / 180);
    object.position.setFromSphericalCoords(radius, phi, theta);
}

function onDocumentClick(event) {
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2(
        (event.clientX / window.innerWidth) * 2 - 1,
        -(event.clientY / window.innerHeight) * 2 + 1
    );
    raycaster.setFromCamera(mouse, camera);
    if (raycaster.intersectObjects([buttonAtlantic, buttonCalifornia]).length) {
        fadeScreenAndZoomToButton();
    }
}

// Animation
function animate() {
    if (autoRotate) earth.rotation.y += 0.005;
    renderer.render(scene, camera);
    TWEEN.update();
    requestAnimationFrame(animate);
}

// window resize
function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

// mouse wheel scroll
let scrollTimeout;
let isScrolling = false;
function onWheelScroll(event) {
    const scaleFactor = event.deltaY > 0 ? 1.01 : 0.99;
    earth.scale.multiplyScalar(scaleFactor);
    autoRotate = earth.scale.x <= 1.5;
    document.querySelector('.urban-text').style.opacity = '0';
    document.querySelector('.oceans-text').style.opacity = '0';
}

// mouse down
function onMouseDown(e) {
    isDragging = true;
    previousMousePosition = { x: e.clientX, y: e.clientY };
}

// mouse move
function onMouseMove(e) {
    if (!isDragging || autoRotate) return;
    const deltaX = e.clientX - previousMousePosition.x;
    const deltaY = e.clientY - previousMousePosition.y;
    earth.rotation.y += deltaX * 0.01;
    earth.rotation.x += deltaY * 0.01;
    previousMousePosition = { x: e.clientX, y: e.clientY };
}

// mouse up
function onMouseUp() {
    isDragging = false;
}

// zoom into button
function fadeScreenAndZoomToButton() {
    const targetPosition = buttonAtlantic.position.clone();
    const initialPosition = camera.position.clone();
    new TWEEN.Tween({ opacity: 0, zoom: 0 })
        .to({ opacity: 1, zoom: 1 }, 1500)
        .easing(TWEEN.Easing.Quadratic.InOut)
        .onUpdate(({ opacity, zoom }) => {
            document.getElementById('fadeOverlay').style.opacity = opacity;
            camera.position.lerpVectors(initialPosition, targetPosition, zoom);
            camera.lookAt(earth.position);
        })
        .onComplete(() => window.location.href = 'ocean')
        .start();
}
