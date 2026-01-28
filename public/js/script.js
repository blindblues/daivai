// Script principale del sito
document.addEventListener('DOMContentLoaded', function() {
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
        
        // Applica l'animazione
        const bottomValue = -20 + (20 * animationProgress);
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
