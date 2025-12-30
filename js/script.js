// Script principale del sito
document.addEventListener('DOMContentLoaded', function() {
    console.log('Sito caricato correttamente');
    
    // Toggle header rectangle expansion
    const headerRectangle = document.querySelector('.header-rectangle');
    const header = document.querySelector('header');
    
    if (headerRectangle) {
        headerRectangle.addEventListener('click', function() {
            this.classList.toggle('expanded');
        });
    }
    
    // Header visibility on scroll
    let headerVisible = false;
    window.addEventListener('scroll', function() {
        if (!headerVisible && window.pageYOffset > 10) {
            header.classList.add('visible');
            headerVisible = true;
        } else if (headerVisible && window.pageYOffset <= 10) {
            header.classList.remove('visible');
            headerVisible = false;
        }
    });
    
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

// Funzione parallasse
function initParallax() {
    const logoOverlay = document.getElementById('logo-overlay');
    
    if (!logoOverlay) return;
    
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const rate = scrolled * 0.5;
        
        // Calcola sfocatura basata sullo scroll (massimo 10px)
        const blurAmount = Math.min(scrolled * 0.02, 10);
        
        // Calcola ingrandimento basato sullo scroll (massimo 2x)
        const scaleAmount = 1 + (scrolled * 0.001);
        
        // Logo si muove verso il basso, si sfoca e si ingrandisce quando si scrolla giù
        logoOverlay.style.transform = `translateY(${rate}px) scale(${scaleAmount})`;
        logoOverlay.style.filter = `blur(${blurAmount}px)`;
        
        // Chiodo rimane completamente fisso (nessuna trasformazione)
    });
}

// Funzione animazione UNISCITI
function initUniscitiAnimation() {
    const uniscitiText = document.getElementById('unisciti-text');
    const heroSection = document.getElementById('hero');
    
    if (!uniscitiText || !heroSection) return;
    
    let lastScrollY = window.pageYOffset;
    let animationProgress = 0;
    
    window.addEventListener('scroll', () => {
        const currentScrollY = window.pageYOffset;
        const scrollDelta = currentScrollY - lastScrollY;
        
        // Calcola l'altezza della sezione hero
        const heroHeight = heroSection.offsetHeight;
        
        // Calcola il progresso dello scroll (0 = top, 1 = bottom of hero)
        const scrollProgress = Math.min(Math.max(currentScrollY / heroHeight, 0), 1);
        
        // Determina la direzione dello scroll
        const scrollingDown = scrollDelta > 0;
        
        // Aggiorna il progresso dell'animazione
        if (scrollingDown) {
            // Scroll down: aumenta il progresso (0 -> 1)
            animationProgress = Math.min(animationProgress + Math.abs(scrollDelta) * 0.004, 1);
        } else {
            // Scroll up: diminuisci il progresso (1 -> 0)
            animationProgress = Math.max(animationProgress - Math.abs(scrollDelta) * 0.004, 0);
        }
        
        // Applica l'animazione
        // Calcola la posizione bottom basata sul progresso
        // Quando animationProgress = 0, bottom = -20vh (fuori viewport)
        // Quando animationProgress = 1, bottom = 5vh (posizione finale più in basso)
        const bottomValue = -20 + (25 * animationProgress);
        
        // Calcola la scala basata sul progresso
        // Quando animationProgress = 0, scale = 0.8 (più grande di prima ma non più grande della fine)
        // Quando animationProgress = 1, scale = 1 (dimensione normale)
        const scale = 0.8 + (0.2 * animationProgress);
        
        // Applica le trasformazioni in modo continuo
        uniscitiText.style.bottom = `${bottomValue}vh`;
        uniscitiText.style.transform = `translateX(-50%) scale(${scale})`;
        
        lastScrollY = currentScrollY;
    });
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
