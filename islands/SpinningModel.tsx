import { Component } from "preact";
import * as THREE from "three";
import { GLTFLoader, GLTF } from "three/addons/loaders/GLTFLoader.js"; // Correct GLTF import
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

class SpinningModel extends Component {
  // Store references as class properties
  private mountPoint: HTMLDivElement | null = null;
  private renderer: THREE.WebGLRenderer | null = null;
  private camera: THREE.PerspectiveCamera | null = null;
  private controls: OrbitControls | null = null;
  private animationFrameId: number | null = null; // To cancel animation frame

  // Define your mobile breakpoint
  private mobileBreakpoint = 768;

  // Handler function for resize events (use arrow function for correct 'this')
  private handleResize = () => {
    if (!this.mountPoint || !this.renderer || !this.camera || !this.controls) {
      return;
    }

    const width = this.mountPoint.clientWidth;
    const height = this.mountPoint.clientHeight;

    // Update renderer and camera
    this.renderer.setSize(width, height);
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();

    // Check screen width and disable/enable controls
    const isMobile = window.innerWidth < this.mobileBreakpoint;
    this.controls.enabled = !isMobile; // Disable on mobile, enable otherwise

    // Optional: You might want to adjust autoRotateSpeed or dampingFactor on mobile
    // if (isMobile) {
    //   this.controls.autoRotateSpeed = 1.0; // Slower rotation maybe?
    // } else {
    //   this.controls.autoRotateSpeed = 2.0; // Default or faster
    // }
  };

  componentDidMount() {
    this.mountPoint = document.getElementById("model-container") as HTMLDivElement;
    if (!this.mountPoint) {
      console.error("Mount point 'model-container' not found.");
      return;
    }

    const loadingManager = new THREE.LoadingManager();
    loadingManager.onLoad = () => {
      document.getElementById("loading-overlay")?.remove();
    };

    const dimensions = {
      x: this.mountPoint.clientWidth || 0,
      y: this.mountPoint.clientHeight || 0,
    };

    const scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera( // Assign to class property
      75,
      dimensions.x / dimensions.y,
      0.1,
      1000,
    );
    this.renderer = new THREE.WebGLRenderer({ alpha: true }); // Assign to class property
    this.controls = new OrbitControls(this.camera, this.renderer.domElement); // Assign to class property

    this.controls.enableDamping = true;
    this.controls.autoRotate = true;
    // Optional: Adjust rotation speed if needed
    // this.controls.autoRotateSpeed = 2.0;

    this.renderer.setSize(dimensions.x, dimensions.y);
    this.renderer.setPixelRatio(window.devicePixelRatio); // Improve sharpness on high DPI screens
    this.mountPoint.appendChild(this.renderer.domElement);

    const loader = new GLTFLoader(loadingManager);
    let model: THREE.Object3D | undefined;

    loader.load(
      "../scene.gltf", // replace with the path to your model
      (gltf: GLTF) => { // Use imported GLTF type
        model = gltf.scene;
        scene.add(model);

        // --- Model positioning (keep as is) ---
        model.rotation.y = -1.5;
        model.rotation.x = 0.25;
        const box = new THREE.Box3().setFromObject(model);
        const center = new THREE.Vector3();
        box.getCenter(center);
        model.position.sub(center);
        const scale = 1.3;
        model.scale.set(scale, scale, scale);
        // --- End Model positioning ---

        const animate = () => {
          this.animationFrameId = requestAnimationFrame(animate); // Store frame ID

          if (this.controls && this.renderer && this.camera) { // Check if instances exist
            this.controls.update();
            this.renderer.render(scene, this.camera);
          }
        };

        // Start animation only after model is loaded
        animate();
      },
      undefined, // Progress callback (optional)
      (error: ErrorEvent) => { // Error type might be ErrorEvent or just Error
        console.error("An error occurred loading the GLTF model:", error);
      },
    );

    const light = new THREE.AmbientLight(0xffffff, 3); // Adjusted intensity (was 75 - seems high)
    scene.add(light);
    const directionalLight = new THREE.DirectionalLight(0xffffff, 2); // Add directional light for better shading
    directionalLight.position.set(5, 10, 7.5);
    scene.add(directionalLight);


    this.camera.position.z = 0.65;
    this.controls.update();

    // Initial check for mobile and add resize listener
    this.handleResize(); // Call once initially to set controls and size
    window.addEventListener('resize', this.handleResize);
  }

  componentWillUnmount() {
    // Clean up: Remove listener, cancel animation, dispose resources
    window.removeEventListener('resize', this.handleResize);

    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
    }

    this.controls?.dispose(); // Dispose controls
    this.renderer?.dispose(); // Dispose renderer
    // Consider disposing scene, geometry, materials if necessary to free up GPU memory

    // Remove canvas from DOM
    if (this.mountPoint && this.renderer) {
        this.mountPoint.removeChild(this.renderer.domElement);
    }
  }

  
  render() {
    // Define the style based on whether controls are potentially disabled
    // Although, applying pan-y generally won't hurt desktop either.
    const containerStyle = {
      touchAction: 'auto', // Allow vertical scrolling initiated on this element
      // Or use 'auto' if you need default browser handling for pinch-zoom too
      // touchAction: 'auto',
    };
    return (
      <div class="relative w-[400px] aspect-square">
        <div
          id="loading-overlay"
          class="absolute inset-0 bg-[rgba(0,0,0,0.3)] backdrop-blur-sm animate-pulse rounded-lg flex justify-center items-center z-10 text-white"
        >
          <span>Loading 3D Model...</span>
        </div>
        <div
          id="model-container"
          class="w-full h-full"
          // Apply the style here
          style={containerStyle}
          ref={(el) => { if(el) this.mountPoint = el; }}
        />
      </div>
    );
  }
}

export default SpinningModel;