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
