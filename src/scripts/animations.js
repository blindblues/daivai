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
    initColorTransition();
    initEventsSlider();
    initFooterAnimation();
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

        // Target all elements that have the reflection class
        const reflectiveElements = document.querySelectorAll(".shine-reflection");

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

        // Initial calculation
        updateElementTops();
        updateScrollY();

        // Update loop
        window.addEventListener("scroll", () => {
            requestAnimationFrame(updateScrollY);
        }, { passive: true });

        // Recalculate positions on resize (address bar show/hide) and orientation change
        window.addEventListener("resize", () => {
            updateElementTops();
            // Force scroll update too
            updateScrollY();
        });
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
            const slice = slices[i];

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

            // Calculate shading based on angle - slices facing away get darker
            // Normalize angle to 0-1 range where 0 = flat, 1 = fully tilted
            const normalizedAngle = Math.min(Math.abs(cumulativeAngle) / 90, 1);
            // Brightness: 1 = normal, lower = darker. More angled = darker
            const brightness = 1 - (normalizedAngle * 0.4);
            slice.style.filter = `brightness(${brightness})`;

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

// ==========================================
// COLOR TRANSITION ON SCROLL
// ==========================================
function initColorTransition() {
    const trigger = document.getElementById('ultimi-eventi-title');
    const body = document.body;

    if (!trigger) return;

    // Color values (yellow -> red for text gradient)
    // Yellow: rgb(245, 229, 144) - #F5E590
    // Red: rgb(251, 96, 104) - #FB6068
    const yellowRGB = { r: 245, g: 229, b: 144 };
    const redRGB = { r: 251, g: 96, b: 104 };

    // State object for GSAP animation
    const colorState = { progress: 0 };

    // Get all text elements with shine-reflection
    const textElements = document.querySelectorAll('.condenso-text.shine-reflection, .info-paragraph.shine-reflection');

    // Function to interpolate between two RGB values
    function lerpColor(from, to, t) {
        return {
            r: Math.round(from.r + (to.r - from.r) * t),
            g: Math.round(from.g + (to.g - from.g) * t),
            b: Math.round(from.b + (to.b - from.b) * t)
        };
    }

    // Update function called on each scroll frame
    function updateColors() {
        const progress = colorState.progress;

        // Background: red (#FB6068) -> yellow (#F5E590)
        const bgColor = lerpColor(redRGB, yellowRGB, progress);
        body.style.backgroundColor = `rgb(${bgColor.r}, ${bgColor.g}, ${bgColor.b})`;

        // Text gradient: yellow -> red (inverse of background)
        const textColor = lerpColor(yellowRGB, redRGB, progress);
        const gradientValue = `linear-gradient(to bottom,
            rgba(${textColor.r}, ${textColor.g}, ${textColor.b}, 0) 20%,
            rgba(${textColor.r}, ${textColor.g}, ${textColor.b}, 1) 40%,
            rgba(${textColor.r}, ${textColor.g}, ${textColor.b}, 1) 80%,
            rgba(${textColor.r}, ${textColor.g}, ${textColor.b}, 0) 100%)`;

        textElements.forEach(el => {
            // Only update the gradient image, preserve other properties
            el.style.backgroundImage = gradientValue;

            // Only enforce fixed attachment on desktop/non-mobile
            if (!needsReflectionFix()) {
                el.style.setProperty('background-attachment', 'fixed', 'important');
                el.style.setProperty('background-position', 'center', 'important');
                el.style.setProperty('background-size', '100% 100vh', 'important');
                el.style.setProperty('background-repeat', 'no-repeat', 'important');
            }

            el.style.setProperty('-webkit-background-clip', 'text', 'important');
            el.style.setProperty('background-clip', 'text', 'important');
            el.style.setProperty('color', 'transparent', 'important');
            // Stroke color: yellow -> red
            el.style.setProperty('-webkit-text-stroke-color', `rgb(${textColor.r}, ${textColor.g}, ${textColor.b})`, 'important');
        });

        // Update arrow icons stroke
        const arrowIcons = document.querySelectorAll('.arrow-icon, .arrow-icon *');
        arrowIcons.forEach(el => {
            el.style.setProperty('stroke', `rgb(${textColor.r}, ${textColor.g}, ${textColor.b})`, 'important');
        });
    }

    // ScrollTrigger with scrub for smooth scroll-linked animation
    gsap.to(colorState, {
        progress: 1,
        ease: "none",
        scrollTrigger: {
            trigger: trigger,
            start: "top 80%",      // Start transition earlier
            end: "top center",     // Complete when title reaches center
            scrub: 2               // Smooth scrub with 2 second lag
        },
        onUpdate: updateColors
    });

    // Initial state
    updateColors();
}

// ==========================================
// EVENTS INFINITE SLIDER
// ==========================================
function initEventsSlider() {
    const wrapper = document.querySelector('.events-slider-wrapper');
    const slider = document.getElementById('events-slider');

    if (!wrapper || !slider) return;

    const cards = slider.querySelectorAll('.event-card');
    if (cards.length === 0) return;

    // Clone cards at the beginning and end for infinite effect
    const cardsArray = Array.from(cards);

    // Clone all cards and append to end
    cardsArray.forEach(card => {
        const clone = card.cloneNode(true);
        slider.appendChild(clone);
    });

    // Clone all cards and prepend to beginning
    cardsArray.reverse().forEach(card => {
        const clone = card.cloneNode(true);
        slider.insertBefore(clone, slider.firstChild);
    });

    // Calculate dimensions
    const cardWidth = cards[0].offsetWidth;
    const gap = 16; // 1rem
    const originalSetWidth = (cardWidth + gap) * cards.length;

    // Set initial scroll position to the middle (original cards)
    wrapper.scrollLeft = originalSetWidth;

    let isScrolling = false;

    wrapper.addEventListener('scroll', () => {
        if (isScrolling) return;

        const scrollLeft = wrapper.scrollLeft;
        const maxScroll = slider.scrollWidth - wrapper.clientWidth;

        // If scrolled to the cloned section at the end, jump back
        if (scrollLeft >= originalSetWidth * 2 - cardWidth) {
            isScrolling = true;
            wrapper.scrollLeft = originalSetWidth + (scrollLeft - originalSetWidth * 2 + cardWidth);
            requestAnimationFrame(() => { isScrolling = false; });
        }

        // If scrolled to the cloned section at the beginning, jump forward
        if (scrollLeft <= cardWidth) {
            isScrolling = true;
            wrapper.scrollLeft = originalSetWidth + scrollLeft;
            requestAnimationFrame(() => { isScrolling = false; });
        }
    });
}

// ==========================================
// FOOTER ANIMATION
// ==========================================
function initFooterAnimation() {
    const footer = document.querySelector('.site-footer');
    const path = document.querySelector('#bouncy-path');

    if (!footer || !path) return;

    // Entry animation (fadeIn)
    // Entry animation (fadeIn) - REMOVED as per user request
    // Footer is now visible immediately

    // Initial control point Y
    const defaultY = 156;
    const proxy = { y: defaultY };

    // Function to update the path 'd' attribute
    const updatePath = () => {
        path.setAttribute('d', `M0-0.3C0-0.3,464,${proxy.y},1139,${proxy.y}S2278-0.3,2278-0.3V683H0V-0.3z`);
    };

    let resetTimer;

    ScrollTrigger.create({
        trigger: document.body,
        start: "top top",
        end: "bottom bottom",
        onUpdate: (self) => {
            const velocity = self.getVelocity();
            // Distortion map: velocity -> Y offset
            const distortion = Math.min(Math.max(velocity / 30, -100), 100);

            gsap.to(proxy, {
                y: defaultY + distortion,
                duration: 0.1,
                ease: "none",
                overwrite: "auto",
                onUpdate: updatePath
            });

            // Elastic snap-back when scroll stops/slows
            clearTimeout(resetTimer);
            resetTimer = setTimeout(() => {
                gsap.to(proxy, {
                    y: defaultY,
                    duration: 1.5,
                    ease: "elastic.out(1, 0.3)",
                    overwrite: "auto",
                    onUpdate: updatePath
                });
            }, 50);
        }
    });
}
