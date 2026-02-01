import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// ==========================================
// INITIALIZATION
// ==========================================
export function initAnimations() {
    console.log("Initializing GSAP animations...");

    initParallax();
    initUniscitiAnimation();
    initStickerAnimation();
    resizeCondensoText();
    initReflectionFix();

    // Event listeners
    window.addEventListener("resize", () => {
        resizeCondensoText();
        // Refresh ScrollTrigger on resize to ensure correct calculations
        ScrollTrigger.refresh();
    });

    // Handle font loading
    if (document.fonts) {
        document.fonts.ready.then(() => {
            console.log("Fonts loaded, resizing...");
            resizeCondensoText();
            // Re-run reflection fix and refresh ScrollTrigger
            setTimeout(() => {
                initReflectionFix();
                ScrollTrigger.refresh();
            }, 100);
        });
    }
}

// ==========================================
// PARALLAX EFFECT
// ==========================================
function initParallax() {
    const logoOverlay = document.getElementById('logo-overlay');

    if (!logoOverlay) return;

    // Detect mobile device for tuning
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

    // Using quickSetter for better performance on frequent updates
    const setY = gsap.quickSetter(logoOverlay, "y", "px");

    ScrollTrigger.create({
        trigger: "body",
        start: "top top",
        end: "bottom bottom",
        onUpdate: (self) => {
            const scrolled = self.scroll();

            // Calculate values based on scroll
            const rate = scrolled * (isMobile ? 0.4 : 0.3);
            const blurAmount = Math.min(scrolled * (isMobile ? 0.01 : 0.015), isMobile ? 6 : 8);

            // Apply values
            setY(rate);
            gsap.set(logoOverlay, {
                filter: `blur(${blurAmount}px)`,
                force3D: true, // Force hardware acceleration
                overwrite: "auto" // Prevent conflicts
            });
        }
    });
}

// ==========================================
// UNISCITI ANIMATION
// ==========================================
function initUniscitiAnimation() {
    const uniscitiText = document.getElementById('unisciti-text');
    const heroSection = document.getElementById('hero');

    if (!uniscitiText || !heroSection) return;

    // Detect mobile
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

    gsap.timeline({
        scrollTrigger: {
            trigger: "#hero",
            start: "top top",
            end: "80% top",
            scrub: 0.1, // Faster response
        }
    })
        .to(uniscitiText, {
            bottom: "-5vh", // From -30vh to -5vh
            scale: 1, // From 0.8 (set in CSS or initial) to 1
            xPercent: -50, // Maintain centering
            left: "50%",
            ease: "none" // Linear mapping to scroll
        });

    // Ensure initial state match (if not set in CSS correctly)
    gsap.set(uniscitiText, {
        bottom: "-30vh",
        scale: 0.8,
        xPercent: -50,
        left: "50%"
    });
}


// ==========================================
// UTILITIES (KEPT FROM ORIGINAL)
// ==========================================

// RESIZE CONDENSO TEXT
function resizeCondensoText() {
    const elements = document.querySelectorAll(".condenso-text");

    if (elements.length === 0) return;

    const viewportWidth = document.documentElement.clientWidth;
    const isMobile = viewportWidth < 768;
    const targetPercentage = 0.9;
    const targetWidth = viewportWidth * targetPercentage;

    elements.forEach((el) => {
        if (!(el instanceof HTMLElement)) return;

        const originalWhiteSpace = el.style.whiteSpace;
        const originalTransform = el.style.transform;
        // const originalDisplay = el.style.display;

        el.style.whiteSpace = "nowrap";
        el.style.width = "auto";
        el.style.display = "inline-block";
        el.style.transform = "none";
        el.style.fontSize = "100px";

        const currentWidth = el.getBoundingClientRect().width;

        if (currentWidth > 0) {
            const ratio = targetWidth / currentWidth;
            const newFontSize = 100 * ratio;

            el.style.fontSize = `${newFontSize}px`;

            el.style.whiteSpace = originalWhiteSpace;
            el.style.width = "";
            el.style.display = ""; // Reset to whatever it was (or css)
            el.style.transform = originalTransform;
        }
    });
}

// MOBILE REFLECTION FIX
function needsReflectionFix() {
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) ||
        (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
    const isFirefoxAndroid = /Firefox/.test(navigator.userAgent) && /Android/.test(navigator.userAgent);
    return isIOS || isFirefoxAndroid;
}

function initReflectionFix() {
    if (needsReflectionFix()) {
        document.documentElement.classList.add("is-ios");

        const reflectiveElements = [
            ...document.querySelectorAll(".condenso-text"),
            ...document.querySelectorAll(".info-paragraph"),
            ...document.querySelectorAll(".arrow-fill-mask"),
        ];

        if (reflectiveElements.length === 0) return;

        function updateElementTops() {
            reflectiveElements.forEach((el) => {
                if (el instanceof HTMLElement) {
                    const rect = el.getBoundingClientRect();
                    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
                    const elementTop = rect.top + scrollTop;
                    el.style.setProperty("--element-top", elementTop.toString());
                }
            });
        }

        function updateScrollY() {
            const scrollY = window.pageYOffset || document.documentElement.scrollTop;
            document.documentElement.style.setProperty("--scroll-y", scrollY.toString());
        }

        updateElementTops();
        updateScrollY();

        window.addEventListener("scroll", () => {
            requestAnimationFrame(updateScrollY);
        }, { passive: true });

        window.addEventListener("resize", updateElementTops);
    }
}

// ==========================================
// STICKER ANIMATION
// ==========================================
// ==========================================
// STICKER ANIMATION
// ==========================================
function initStickerAnimation() {
    // Original sticker (Right) - vertical peel (top to bottom)
    createSticker('sticker-wrapper', 'sticker-container', 'vertical');

    // Second sticker (Left) - horizontal peel (left to right)
    createSticker('sticker-wrapper-left', 'sticker-container-left', 'horizontal');
}

function createSticker(wrapperId, containerId, direction = 'vertical') {
    const wrapper = document.getElementById(wrapperId);
    const container = document.getElementById(containerId);
    const shadow = document.getElementById(`${containerId}-shadow`);

    if (!wrapper || !container) return;

    const isHorizontal = direction === 'horizontal';

    // Use fewer slices for performance
    const numSlices = 20;
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

    // CSS dimensions
    const styles = window.getComputedStyle(wrapper);
    const containerSize = isHorizontal
        ? (parseInt(styles.width) || (isMobile ? 300 : 450))
        : (parseInt(styles.height) || (isMobile ? 300 : 450));
    const sliceSize = containerSize / numSlices;
    const slices = [];

    // Create slices
    for (let i = 0; i < numSlices; i++) {
        const slice = document.createElement('div');
        slice.classList.add('slice');

        if (isHorizontal) {
            // Vertical slices for horizontal peel
            slice.style.width = `${sliceSize + 1}px`;
            slice.style.height = `100%`;
            slice.style.top = `0px`;
            slice.style.left = `0px`;
            slice.style.backgroundPosition = `-${i * sliceSize}px 0px`;
            slice.style.backgroundSize = `${containerSize}px 100%`;
            slice.style.transformOrigin = 'left center';
        } else {
            // Horizontal slices for vertical peel
            slice.style.height = `${sliceSize + 1}px`;
            slice.style.width = `100%`;
            slice.style.top = `0px`;
            slice.style.left = `0px`;
            slice.style.backgroundPosition = `0px -${i * sliceSize}px`;
            slice.style.backgroundSize = `100% ${containerSize}px`;
            slice.style.transformOrigin = 'top center';
        }

        slice.style.zIndex = numSlices + 100 - i;
        container.appendChild(slice);
        slices.push(slice);
    }

    const animState = { progress: 0 };

    // Initialize setters for each slice
    const setters = slices.map(slice => ({
        x: gsap.quickSetter(slice, "x", "px"),
        y: gsap.quickSetter(slice, "y", "px"),
        z: gsap.quickSetter(slice, "z", "px"),
        rotateX: gsap.quickSetter(slice, "rotateX", "deg"),
        rotateY: gsap.quickSetter(slice, "rotateY", "deg")
    }));

    function updateSlices() {
        const progress = animState.progress;

        // Animate shadow
        if (shadow) {
            const shadowOpacity = progress * 0.3;
            const shadowBlur = 30 * (1 - progress);
            const shadowScale = 1.2 - (progress * 0.2);
            gsap.set(shadow, {
                opacity: shadowOpacity,
                filter: `blur(${shadowBlur}px) brightness(0)`,
                scale: shadowScale
            });
        }

        const maxCurl = 30;
        const startAngle = maxCurl * (1 - progress);
        const totalBend = 220 * (1 - progress);
        const anglePerSlice = totalBend / numSlices;

        let currentPos = 0;
        let currentZ = 0;
        let cumulativeAngle = startAngle;

        for (let i = 0; i < numSlices; i++) {
            const s = setters[i];

            if (isHorizontal) {
                // Horizontal peel: rotate on Y axis, move on X
                s.x(currentPos);
                s.y(0);
                s.z(currentZ);
                s.rotateY(-cumulativeAngle); // Negative for left-to-right curl
                s.rotateX(0);
            } else {
                // Vertical peel: rotate on X axis, move on Y
                s.x(0);
                s.y(currentPos);
                s.z(currentZ);
                s.rotateX(cumulativeAngle);
                s.rotateY(0);
            }

            const rad = (cumulativeAngle * Math.PI) / 180;
            currentPos += sliceSize * Math.cos(rad);
            currentZ += sliceSize * Math.sin(rad);
            cumulativeAngle += anglePerSlice;
        }
    }

    // GSAP ScrollTrigger
    gsap.to(animState, {
        progress: 1,
        ease: "power1.out",
        scrollTrigger: {
            trigger: `#${wrapperId}`,
            start: "top bottom",
            end: "top 25%",
            scrub: 1
        },
        onUpdate: updateSlices
    });

    // Initial render
    updateSlices();
}

