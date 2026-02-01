import * as THREE from 'three';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * Creates a Three.js-based sticker animation with a peeling/curling effect.
 * This bypasses CSS 3D transforms for better cross-browser compatibility.
 */
export function initStickerThree(containerId, wrapperId, imagePath) {
    const container = document.getElementById(containerId);
    const wrapper = document.getElementById(wrapperId);

    if (!container || !wrapper) {
        console.warn(`Sticker container or wrapper not found: ${containerId}, ${wrapperId}`);
        return;
    }

    // Get dimensions from CSS
    const styles = window.getComputedStyle(wrapper);
    const width = parseInt(styles.width) || 250;
    const height = parseInt(styles.height) || 450;

    // Scene setup
    const scene = new THREE.Scene();

    // Orthographic camera for 2D-like rendering
    const aspect = width / height;
    const frustumSize = height;
    const camera = new THREE.OrthographicCamera(
        -frustumSize * aspect / 2,
        frustumSize * aspect / 2,
        frustumSize / 2,
        -frustumSize / 2,
        0.1,
        1000
    );
    camera.position.z = 500;

    // Renderer with transparency
    const renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: true,
        powerPreference: 'high-performance'
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.domElement.style.opacity = '0'; // Start hidden, will fade in
    container.appendChild(renderer.domElement);

    // Load texture
    const textureLoader = new THREE.TextureLoader();
    const texture = textureLoader.load(imagePath, () => {
        // Render once texture is loaded
        renderer.render(scene, camera);
    });
    texture.colorSpace = THREE.SRGBColorSpace;

    // Create plane geometry with many segments for smooth deformation
    const segments = 30;
    const geometry = new THREE.PlaneGeometry(width, height, 1, segments);

    // Custom shader material for the peeling effect
    const material = new THREE.ShaderMaterial({
        uniforms: {
            uTexture: { value: texture },
            uProgress: { value: 0.0 }
        },
        vertexShader: `
            uniform float uProgress;
            varying vec2 vUv;
            
            void main() {
                vUv = uv;
                vec3 pos = position;
                
                // Simple curl: rotate around X axis based on Y position
                // uv.y goes from 0 (bottom) to 1 (top)
                float curlAmount = (1.0 - uProgress) * 1.8; // Max ~103 degrees in radians
                
                // Only curl the top portion
                float curlFactor = smoothstep(0.0, 1.0, uv.y);
                float angle = curlFactor * curlAmount;
                
                // Rotate around X axis (curl backward)
                float cosA = cos(angle);
                float sinA = sin(angle);
                
                // Apply rotation offset from the top edge
                float distFromTop = (1.0 - uv.y) * ${height}.0;
                pos.y = ${height / 2}.0 - distFromTop * cosA;
                pos.z = distFromTop * sinA;
                
                // Scale effect
                float scale = 1.3 - 0.3 * uProgress;
                pos.xy *= scale;
                
                gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
            }
        `,
        fragmentShader: `
            uniform sampler2D uTexture;
            varying vec2 vUv;
            
            void main() {
                gl_FragColor = texture2D(uTexture, vUv);
            }
        `,
        transparent: true,
        side: THREE.DoubleSide
    });

    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    // Animation state
    const animState = { progress: 0, opacity: 0 };

    function animate() {
        material.uniforms.uProgress.value = animState.progress;
        renderer.domElement.style.opacity = animState.opacity;
        renderer.render(scene, camera);
    }

    // ScrollTrigger for peeling animation
    gsap.to(animState, {
        progress: 1,
        ease: 'power1.out',
        scrollTrigger: {
            trigger: `#${wrapperId}`,
            start: 'top 75%',
            end: 'top 25%',
            scrub: 1,
        },
        onUpdate: animate
    });

    // Fade in animation
    gsap.to(animState, {
        opacity: 1,
        duration: 0.4,
        ease: 'power2.out',
        scrollTrigger: {
            trigger: `#${wrapperId}`,
            start: 'top 85%',
            toggleActions: 'play none none reverse'
        },
        onUpdate: animate
    });

    // Initial render
    animate();

    // Handle resize
    const handleResize = () => {
        const newWidth = parseInt(window.getComputedStyle(wrapper).width) || width;
        const newHeight = parseInt(window.getComputedStyle(wrapper).height) || height;
        renderer.setSize(newWidth, newHeight);
        renderer.render(scene, camera);
    };

    window.addEventListener('resize', handleResize);

    // Cleanup function
    return () => {
        window.removeEventListener('resize', handleResize);
        geometry.dispose();
        material.dispose();
        texture.dispose();
        renderer.dispose();
        container.removeChild(renderer.domElement);
    };
}
