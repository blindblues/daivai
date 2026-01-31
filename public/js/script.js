// Script principale del sito
document.addEventListener('DOMContentLoaded', function () {
    console.log('Sito caricato correttamente');

    // Toggle header rectangle expansion
    // Rimosso - header eliminato

    // Header visibility on scroll
    // Rimosso - header eliminato

    // Esempio di funzione per navigazione mobile
    const toggleMobileMenu = () => {
        const nav = document.querySelector('nav ul');
        nav.classList.toggle('mobile-active');
    };

    // Aggiungi event listeners se necessario
    const mobileMenuButton = document.querySelector('.mobile-menu-toggle');
    if (mobileMenuButton) {
        mobileMenuButton.addEventListener('click', toggleMobileMenu);
    }

    // Effetto parallasse
    initParallax();
    initUniscitiAnimation();
});

// Funzione parallasse ottimizzata per mobile
function initParallax() {
    const logoOverlay = document.getElementById('logo-overlay');

    if (!logoOverlay) return;

    let ticking = false;
    let lastScrollY = 0;
    let scrollTimeout;
    let rafId = null;

    // Detect mobile device
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

    function updateParallax() {
        const scrolled = window.pageYOffset;

        // Aggiorna solo se lo scroll è cambiato significativamente
        if (Math.abs(scrolled - lastScrollY) > (isMobile ? 2 : 1)) {
            const rate = scrolled * (isMobile ? 0.4 : 0.3); // Aumentato movimento su mobile

            // Calcola sfocatura basata sullo scroll (massimo 6px su mobile, 8px su desktop)
            const blurAmount = Math.min(scrolled * (isMobile ? 0.01 : 0.015), isMobile ? 6 : 8);

            // Usa transform3d per hardware acceleration
            logoOverlay.style.transform = `translate3d(0, ${rate}px, 0)`;
            logoOverlay.style.filter = `blur(${blurAmount}px)`;

            lastScrollY = scrolled;
        }

        ticking = false;
        rafId = null;
    }

    function requestTick() {
        if (!ticking) {
            rafId = requestAnimationFrame(updateParallax);
            ticking = true;
        }
    }

    // Debounce più aggressivo su mobile
    function debouncedScroll() {
        clearTimeout(scrollTimeout);
        requestTick();

        // Resetta il ticking dopo un timeout per evitare blocchi
        scrollTimeout = setTimeout(() => {
            ticking = false;
            if (rafId) {
                cancelAnimationFrame(rafId);
                rafId = null;
            }
        }, isMobile ? 150 : 100);
    }

    // Usa passive listeners per migliore performance su mobile
    window.addEventListener('scroll', debouncedScroll, { passive: true });
    window.addEventListener('resize', requestTick, { passive: true });

    // Ottimizzazioni CSS per mobile
    if (isMobile) {
        logoOverlay.style.willChange = 'transform, filter';
        logoOverlay.style.backfaceVisibility = 'hidden';
        logoOverlay.style.perspective = '1000px';
    }
}

// Funzione animazione UNISCITI ottimizzata per mobile
function initUniscitiAnimation() {
    const uniscitiText = document.getElementById('unisciti-text');
    const heroSection = document.getElementById('hero');

    if (!uniscitiText || !heroSection) return;

    let lastScrollY = window.pageYOffset;
    let animationProgress = 0;
    let ticking = false;
    let rafId = null;

    // Detect mobile device
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

    function updateUniscitiAnimation() {
        const currentScrollY = window.pageYOffset;
        const scrollDelta = currentScrollY - lastScrollY;

        // Calcola l'altezza della sezione hero
        const heroHeight = heroSection.offsetHeight;

        // Calcola il progresso dello scroll (0 = top, 1 = bottom of hero)
        const scrollProgress = Math.min(Math.max(currentScrollY / heroHeight, 0), 1);

        // Determina la direzione dello scroll
        const scrollingDown = scrollDelta > 0;

        // Aggiorna il progresso dell'animazione con velocità aumentata su mobile
        const animationSpeed = isMobile ? 0.006 : 0.004;
        if (scrollingDown) {
            animationProgress = Math.min(animationProgress + Math.abs(scrollDelta) * animationSpeed, 1);
        } else {
            animationProgress = Math.max(animationProgress - Math.abs(scrollDelta) * animationSpeed, 0);
        }

        // Applica l'animazione - range: da -30vh a -5vh
        const bottomValue = -30 + (25 * animationProgress);
        const scale = 0.8 + (0.2 * animationProgress);

        // Applica le trasformazioni in modo continuo
        uniscitiText.style.bottom = `${bottomValue}vh`;
        uniscitiText.style.transform = `translateX(-50%) scale(${scale})`;

        lastScrollY = currentScrollY;
        ticking = false;
        rafId = null;
    }

    function requestTick() {
        if (!ticking) {
            rafId = requestAnimationFrame(updateUniscitiAnimation);
            ticking = true;
        }
    }

    // Debounce più aggressivo su mobile
    let scrollTimeout;
    function debouncedScroll() {
        clearTimeout(scrollTimeout);
        requestTick();

        scrollTimeout = setTimeout(() => {
            ticking = false;
            if (rafId) {
                cancelAnimationFrame(rafId);
                rafId = null;
            }
        }, isMobile ? 150 : 100);
    }

    window.addEventListener('scroll', debouncedScroll, { passive: true });
    window.addEventListener('resize', requestTick, { passive: true });

    // Ottimizzazioni CSS per mobile
    if (isMobile) {
        uniscitiText.style.willChange = 'transform, bottom';
        uniscitiText.style.backfaceVisibility = 'hidden';
        uniscitiText.style.perspective = '1000px';
    }
}

// Funzioni utility
function scrollToElement(elementId) {
    const element = document.getElementById(elementId);
    if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
    }
}

// Validazione form di contatto
function validateContactForm() {
    const form = document.getElementById('contact-form');
    if (!form) return true;

    const name = form.querySelector('#name').value.trim();
    const email = form.querySelector('#email').value.trim();
    const message = form.querySelector('#message').value.trim();

    if (!name || !email || !message) {
        alert('Per favore compila tutti i campi');
        return false;
    }

    // Validazione email semplice
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        alert('Per favore inserisci un\'email valida');
        return false;
    }

    return true;
}

// ==========================================
// RESIZE CONDENSO TEXT
// ==========================================
// Auto-resize Condenso text to 75% viewport width
// ==========================================
// RESIZE CONDENSO TEXT
// ==========================================
// Auto-resize Condenso text to viewport width percentage
function resizeCondensoText() {
    const elements = document.querySelectorAll(".condenso-text");

    // Check if elements exist to avoid errors
    if (elements.length === 0) return;

    // Use document.documentElement.clientWidth for viewport width excluding scrollbar
    const viewportWidth = document.documentElement.clientWidth;
    // On mobile (less than 768px), take up more space (90%), otherwise 75%
    const isMobile = viewportWidth < 768;
    const targetPercentage = isMobile ? 0.9 : 0.75;
    const targetWidth = viewportWidth * targetPercentage;

    elements.forEach((el) => {
        if (!(el instanceof HTMLElement)) return;

        // Save original styles to restore later if needed
        const originalWhiteSpace = el.style.whiteSpace;

        // Force single line for measurement
        el.style.whiteSpace = "nowrap";
        el.style.width = "auto";
        el.style.display = "inline-block";
        el.style.fontSize = "100px"; // Baseline for calculation

        const currentWidth = el.getBoundingClientRect().width;

        if (currentWidth > 0) {
            const ratio = targetWidth / currentWidth;
            const newFontSize = 100 * ratio; // 100 * (Target / Current at 100px)

            el.style.fontSize = `${newFontSize}px`;

            // Clean up temporary measurement styles
            el.style.whiteSpace = originalWhiteSpace;
            el.style.width = "";
            el.style.display = "";
        }
    });
}

// ==========================================
// MOBILE REFLECTION FIX (iOS & Firefox Android)
// ==========================================
// Detect mobile browsers that don't support background-attachment: fixed with background-clip: text
function needsReflectionFix() {
    // iOS detection
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) ||
        (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);

    // Firefox Android detection
    const isFirefoxAndroid = /Firefox/.test(navigator.userAgent) && /Android/.test(navigator.userAgent);

    return isIOS || isFirefoxAndroid;
}

function initReflectionFix() {
    if (needsReflectionFix()) {
        document.documentElement.classList.add("is-ios");

        // Get all elements that need the fix
        const reflectiveElements = [
            ...document.querySelectorAll(".condenso-text"),
            ...document.querySelectorAll(".info-paragraph"),
            ...document.querySelectorAll(".arrow-fill-mask"),
        ];

        if (reflectiveElements.length === 0) return;

        // Function to update element tops
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

        // Function to update scroll position
        function updateScrollY() {
            const scrollY = window.pageYOffset || document.documentElement.scrollTop;
            document.documentElement.style.setProperty("--scroll-y", scrollY.toString());
        }

        // Initial setup
        updateElementTops();
        updateScrollY();

        // Update on scroll (throttled for performance)
        let ticking = false;
        window.addEventListener("scroll", () => {
            if (!ticking) {
                requestAnimationFrame(() => {
                    updateScrollY();
                    ticking = false;
                });
                ticking = true;
            }
        }, { passive: true });

        // Update element positions on resize
        window.addEventListener("resize", updateElementTops);

        // Update after fonts load
        if (document.fonts) {
            document.fonts.ready.then(() => {
                setTimeout(updateElementTops, 100);
            });
        }
    }
}

// Initialize new functions
function initScripts() {
    console.log("Initializing scripts...");

    // Initial run
    resizeCondensoText();
    initReflectionFix();

    // Resize events
    window.addEventListener("resize", () => {
        resizeCondensoText();
    });

    // Font loading
    if (document.fonts) {
        document.fonts.ready.then(() => {
            console.log("Fonts loaded, resizing...");
            resizeCondensoText();
            // Re-run reflection fix as positions might change
            setTimeout(initReflectionFix, 100);
        });
    }
}

if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initScripts);
} else {
    initScripts();
}
