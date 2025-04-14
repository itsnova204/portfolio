// src/islands/SpinningModel.tsx
import { Component } from "preact";
import * as THREE from "three";
import { GLTFLoader, GLTF } from "three/addons/loaders/GLTFLoader.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

class SpinningModel extends Component {
  private mountPoint: HTMLDivElement | null = null;
  private renderer: THREE.WebGLRenderer | null = null;
  private camera: THREE.PerspectiveCamera | null = null;
  private scene: THREE.Scene | null = null; // Keep scene reference for cleanup
  private controls: OrbitControls | null = null;
  private animationFrameId: number | null = null;
  private model: THREE.Object3D | undefined; // Keep model reference for cleanup

  private mobileBreakpoint = 768;

  private handleResize = () => {
    if (!this.mountPoint || !this.renderer || !this.camera || !this.controls) {
      return;
    }

    // Use parent's dimensions for reliability, fallback to window
    const parent = this.mountPoint.parentElement;
    const width = parent ? parent.clientWidth : window.innerWidth;
    // Ensure a minimum height or use aspect ratio if width is available
    const desiredWidth = Math.min(width * 0.8, 400); // Example: Limit max width
    const height = desiredWidth; // Maintain aspect ratio 1:1


    // Check if mountPoint itself has dimensions, otherwise size might be 0
    if (this.mountPoint.clientWidth > 0 && this.mountPoint.clientHeight > 0) {
        this.renderer.setSize(this.mountPoint.clientWidth, this.mountPoint.clientHeight);
        this.camera.aspect = this.mountPoint.clientWidth / this.mountPoint.clientHeight;
    } else {
         // Fallback or initial sizing if mountPoint isn't laid out yet
         // This might need adjustment based on your layout
         this.renderer.setSize(desiredWidth, height);
         this.camera.aspect = desiredWidth / height;
    }


    this.camera.updateProjectionMatrix();

    const isMobile = window.innerWidth < this.mobileBreakpoint;
    this.controls.enabled = !isMobile; // Disable manual interaction on mobile

    // Optional: Adjust autoRotateSpeed on mobile if desired
    // if (isMobile) {
    //   this.controls.autoRotateSpeed = 1.0;
    // } else {
    //   this.controls.autoRotateSpeed = 2.0;
    // }
  };

  componentDidMount() {
    // Use ref callback from render method instead of getElementById
    if (!this.mountPoint) {
      console.error("Mount point ref is not set.");
      return; // Exit if mountPoint isn't available yet
    }

    // --- Initialization ---
    const loadingManager = new THREE.LoadingManager();
    const loadingOverlay = document.getElementById("loading-overlay"); // Get overlay ref
    loadingManager.onLoad = () => {
      loadingOverlay?.remove(); // Remove overlay on load
    };
    loadingManager.onError = (url) => {
        console.error(`Error loading ${url}`);
        if (loadingOverlay) {
            loadingOverlay.textContent = "Error loading model.";
            loadingOverlay.classList.remove("animate-pulse");
        }
    };


    // Use mount point's actual size after layout
    const dimensions = {
       // Wait for layout or use initial estimate
       x: this.mountPoint.clientWidth || 400, // Default width if 0
       y: this.mountPoint.clientHeight || 400, // Default height if 0
    };


    this.scene = new THREE.Scene(); // Assign to class property
    this.camera = new THREE.PerspectiveCamera(
      75,
      dimensions.x / dimensions.y,
      0.1,
      1000,
    );
    this.renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true }); // Enable antialiasing
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(dimensions.x, dimensions.y);
    this.mountPoint.appendChild(this.renderer.domElement); // Append renderer here

    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;
    this.controls.autoRotate = true;
    //this.controls.autoRotateSpeed = 1.0; // Slightly slower rotation?

    // --- Model Loading ---
    const loader = new GLTFLoader(loadingManager);
    loader.load(
      "./scene.gltf", // Assuming scene.gltf is in the public directory
      (gltf: GLTF) => {
        this.model = gltf.scene; // Store model reference
        if (!this.scene || !this.camera || !this.renderer || !this.controls) return; // Type guard

        this.scene.add(this.model);

        // Center and scale model
        const box = new THREE.Box3().setFromObject(this.model);
        const center = new THREE.Vector3();
        box.getCenter(center);
        this.model.position.sub(center); // Center the model origin
        const size = new THREE.Vector3();
        box.getSize(size);
        const maxDim = Math.max(size.x, size.y, size.z);
        const scale = 0.5 / maxDim; // Scale model to fit roughly in a 1-unit box initially
        this.model.scale.set(scale, scale, scale);

        // Adjust camera position based on scaled model size
        this.camera.position.z = maxDim * scale * 1.3; // Position camera further back based on size
         this.controls.update(); // Important after changing camera position

        // Start animation loop
        this.animate();
      },
      undefined,
      (error: ErrorEvent | Error) => { // Handle both error types
         console.error("An error occurred loading the GLTF model:", error);
         if (loadingOverlay) {
             loadingOverlay.textContent = "Error loading model.";
             loadingOverlay.classList.remove("animate-pulse");
         }
      },
    );

    // --- Lighting ---
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.5);
    this.scene.add(ambientLight);
    const directionalLight = new THREE.DirectionalLight(0xffffff, 2);
    directionalLight.position.set(2, 5, 3).normalize();
    this.scene.add(directionalLight);


    // --- Initial Setup & Listeners ---
    this.controls.update();
    this.handleResize(); // Call initially to set size and controls state
    window.addEventListener('resize', this.handleResize);
  }

   animate = () => { // Use arrow function to bind 'this'
      this.animationFrameId = requestAnimationFrame(this.animate);

      // Type guards
      if (this.controls && this.renderer && this.scene && this.camera) {
        this.controls.update(); // Updates controls (damping, auto-rotate)
        this.renderer.render(this.scene, this.camera);
      }
    };


  componentWillUnmount() {
    window.removeEventListener('resize', this.handleResize);

    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
    }

    // Dispose Three.js resources
    this.controls?.dispose();
    this.renderer?.dispose();

    // Dispose materials and geometries in the scene (important for memory)
    this.scene?.traverse((object) => {
         if (object instanceof THREE.Mesh) {
             if (object.geometry) {
                 object.geometry.dispose();
             }
             if (Array.isArray(object.material)) {
                  object.material.forEach(material => material.dispose());
             } else if (object.material) {
                  object.material.dispose();
             }
         }
    });

    // Remove model from scene if it exists
     if(this.model && this.scene) {
         this.scene.remove(this.model);
     }


    // Remove canvas from DOM
    if (this.mountPoint && this.renderer) {
        // Check if the renderer's DOM element is still a child before removing
        if (this.mountPoint.contains(this.renderer.domElement)) {
             this.mountPoint.removeChild(this.renderer.domElement);
        }
    }

    // Clear references
    this.mountPoint = null;
    this.renderer = null;
    this.camera = null;
    this.controls = null;
    this.scene = null;
    this.model = undefined;
  }

  render() {
    // Apply touch-action CSS directly to the container div
    // pan-y allows vertical scrolling initiated on this element.
    // pan-x would allow horizontal scrolling (if the page scrolls horizontally).
    // 'auto' lets the browser decide based on the gesture (might interfere more).
    const containerStyle = {
      touchAction: 'pan-y', // Allow vertical scroll gestures
      width: '100%',        // Make container take available width
      height: '100%',       // Make container take available height
      maxWidth: '400px',    // Max width for the model viewer
      aspectRatio: '1 / 1', // Maintain square aspect ratio
      position: 'relative', // Needed for absolute positioning of overlay
      overflow: 'hidden', // Hide anything spilling out of the container (like canvas resizing issues)
      cursor: 'grab'       // Indicate interactivity (even if disabled on mobile)
    } as const; // Use 'as const' for stricter style typing if using TSX strict mode

    const loadingOverlayStyle = {
         position: 'absolute',
         inset: '0',
         // Example using RGBA for background
         backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent black
         // backdropFilter: 'blur(4px)', // Optional blur effect
         display: 'flex',
         justifyContent: 'center',
         alignItems: 'center',
         zIndex: '10', // Ensure it's above the canvas
         color: 'white',
         borderRadius: '0.5rem', // Match container rounding if any
         // Add animation classes if needed, e.g., from Tailwind
         // className: "animate-pulse" // Handled by class below
     } as const;


    return (
      // Container div controls the size and holds the canvas and overlay
      <div style={containerStyle}>
        {/* Loading Overlay */}
        <div
          id="loading-overlay"
          style={loadingOverlayStyle}
          // Use Tailwind classes alongside style if preferred for some things
          class="animate-pulse"
        >
          <span>Loading 3D Model...</span>
        </div>
        {/* Mount point for the Three.js Canvas */}
        {/* The ref assigns the DOM element to this.mountPoint when rendered */}
        <div
          id="model-container"
          style={{ width: '100%', height: '100%' }} // Ensure inner div fills the styled outer div
          ref={(el) => { if (el) this.mountPoint = el; }}
        />
      </div>
    );
  }
}

export default SpinningModel;