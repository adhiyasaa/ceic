// Mobile Menu
function toggleMenu() {
    const menu = document.getElementById('mobileMenu');
    menu.classList.toggle('active');
}

// Navbar Scroll Effect
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
    if (window.scrollY > 30) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// Animation Observer
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, { threshold: 0.1 });

document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));

// Add grid pattern to hero section
document.addEventListener('DOMContentLoaded', function () {
    const heroSection = document.querySelector('.hero-section');

    // Add subtle parallax effect to hero
    window.addEventListener('scroll', function () {
        const scrolled = window.pageYOffset;
        const hero = document.querySelector('.hero-section');
        const logo = document.querySelector('.floating-logo');

        if (hero) {
            hero.style.backgroundPosition = `center ${scrolled * 0.5}px`;
        }

        if (logo) {
            logo.style.transform = `translate(-50%, -50%) rotate(${scrolled * 0.1}deg)`;
        }
    });
});

// Core Values Data
const coreValues = [
    {
        id: 'digital',
        icon: 'cpu',
        title: 'Digital Transformation',
        subtitle: 'CEIC Season XIV',
        description: `
            <p>Integration of digital technologies using advanced AI, Internet of Things (IoT), and Building Information Modeling (BIM).</p>
            <ul class="cv-bullets">
                <li><strong>Real-time Data:</strong> Enabling smarter, faster, and more sustainable infrastructure development.</li>
                <li><strong>Predictive Maintenance:</strong> Automation and enhanced collaboration among stakeholders.</li>
                <li><strong>Enhanced Collaboration:</strong> Improving communication between all project participants.</li>
            </ul>
        `
    },
    {
        id: 'netzero',
        icon: 'leaf',
        title: 'Net Zero Emission',
        subtitle: 'Target 2060',
        description: `
            <p>Indonesia has set a target to achieve Net Zero Emission by 2060 as part of its commitment to combat climate change.</p>
            <ul class="cv-bullets">
                <li><strong>Low-carbon Materials:</strong> Using sustainable construction practices and materials.</li>
                <li><strong>Energy Optimization:</strong> Optimizing energy use in buildings and transportation systems.</li>
                <li><strong>Renewable Energy:</strong> Integration of renewable energy sources into infrastructure.</li>
            </ul>
        `
    },
    {
        id: 'community',
        icon: 'users',
        title: 'Community Impact',
        subtitle: 'Sustainable Development',
        description: `
            <p>Sustainable infrastructure should improve access to essential services and enhance public safety.</p>
            <ul class="cv-bullets">
                <li><strong>Essential Access:</strong> Improving access to transportation, water, and electricity.</li>
                <li><strong>Disaster Resilience:</strong> Enhancing public safety and resilience to disasters.</li>
                <li><strong>Social Equity:</strong> Engaging community in planning and promoting local economic benefits.</li>
            </ul>
        `
    }
];

let currentIndex = 0;

function renderValue(index) {
    const contentDiv = document.getElementById('cv-content-inner');
    if (!contentDiv) return;

    const value = coreValues[index];

    // Animate Text Change
    contentDiv.style.opacity = '0';
    contentDiv.style.transform = 'translateX(20px)';

    setTimeout(() => {
        contentDiv.innerHTML = `
            <div class="cv-title">
                <div class="cv-title-icon"><i data-lucide="${value.icon}"></i></div>
                <span>${value.title}</span>
            </div>
            <div class="cv-subtitle">${value.subtitle}</div>
            <div class="cv-description">${value.description}</div>
        `;

        // Re-initialize lucide icons for newly added elements
        if (window.lucide) {
            lucide.createIcons();
        }

        // Reset Animation
        contentDiv.style.opacity = '1';
        contentDiv.style.transform = 'translateX(0)';
    }, 200);

    // Update Active Tab
    document.querySelectorAll('.cv-tab').forEach((tab, idx) => {
        if (idx === index) tab.classList.add('active');
        else tab.classList.remove('active');
    });
}

function switchValue(index) {
    currentIndex = index;
    renderValue(currentIndex);

    // Smooth scroll to the detail panel
    const detailPanel = document.querySelector('.cv-detail');
    if (detailPanel) {
        const offset = 100; // Offset for navbar
        const elementPosition = detailPanel.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - offset;

        window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
        });
    }
}

function nextValue() {
    currentIndex = (currentIndex + 1) % coreValues.length;
    renderValue(currentIndex);
}

function prevValue() {
    currentIndex = (currentIndex - 1 + coreValues.length) % coreValues.length;
    renderValue(currentIndex);
}

// Initialize on Load
document.addEventListener('DOMContentLoaded', () => {
    // Init Core Values
    if (document.getElementById('cv-content-inner')) {
        renderValue(0);
    }

    // Init Events Slider
    initEventsSlider();
});

// =========================================
// PAST EVENTS SLIDER
// =========================================
let currentSlide = 0;
let slideCount = 0;
let autoSlideInterval = null;

function initEventsSlider() {
    const slider = document.getElementById('eventsSlider');
    if (!slider) return;

    const slides = slider.querySelectorAll('.event-slide');
    slideCount = slides.length;

    // Start auto-slide
    startAutoSlide();

    // Pause on hover
    const container = document.querySelector('.slider-container');
    if (container) {
        container.addEventListener('mouseenter', stopAutoSlide);
        container.addEventListener('mouseleave', startAutoSlide);
    }
}

function changeSlide(direction) {
    currentSlide += direction;
    if (currentSlide >= slideCount) currentSlide = 0;
    if (currentSlide < 0) currentSlide = slideCount - 1;
    updateSlider();
}

function goToSlide(index) {
    currentSlide = index;
    updateSlider();
}

function updateSlider() {
    const slides = document.querySelectorAll('.event-slide');
    slides.forEach((slide, i) => {
        slide.classList.remove('active');
        if (i === currentSlide) slide.classList.add('active');
    });

    const dots = document.querySelectorAll('.slider-dots .dot');
    dots.forEach((dot, i) => {
        dot.classList.remove('active');
        if (i === currentSlide) dot.classList.add('active');
    });
}

function startAutoSlide() {
    stopAutoSlide();
    autoSlideInterval = setInterval(() => changeSlide(1), 5000);
}

function stopAutoSlide() {
    if (autoSlideInterval) {
        clearInterval(autoSlideInterval);
        autoSlideInterval = null;
    }
}

// Expose functions globally for HTML onclick attributes (needed when bundled by Webpack)
window.toggleMenu = toggleMenu;
window.switchValue = switchValue;
window.nextValue = nextValue;
window.prevValue = prevValue;
window.changeSlide = changeSlide;
window.goToSlide = goToSlide;