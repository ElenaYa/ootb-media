// OOTB Media - Interactive JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all components
    initScrollAnimations();
    initNavbar();
    initCounterAnimations();
    initCampaignBuilder();
    initContactForm();
    initIndustryInteractions();
});

// Scroll-triggered animations using Intersection Observer
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                
                // Trigger counter animations when stats section comes into view
                if (entry.target.classList.contains('hero-stats')) {
                    animateCounters();
                }
            }
        });
    }, observerOptions);

    // Observe all elements with reveal animations
    document.querySelectorAll('.reveal-up').forEach(el => {
        observer.observe(el);
    });
}

// Navbar scroll effects
function initNavbar() {
    const navbar = document.getElementById('mainNav');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 100) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
}

// Animated counter for statistics
function initCounterAnimations() {
    let countersAnimated = false;
    
    window.animateCounters = function() {
        if (countersAnimated) return;
        countersAnimated = true;
        
        const counters = document.querySelectorAll('.stat-number');
        counters.forEach(counter => {
            const target = parseFloat(counter.getAttribute('data-target'));
            const isDecimal = target % 1 !== 0;
            let current = 0;
            const increment = target / 100;
            
            const updateCounter = () => {
                if (current < target) {
                    current += increment;
                    if (current > target) current = target;
                    
                    if (isDecimal) {
                        counter.textContent = current.toFixed(1);
                    } else {
                        counter.textContent = Math.floor(current);
                    }
                    
                    requestAnimationFrame(updateCounter);
                } else {
                    if (isDecimal) {
                        counter.textContent = target.toFixed(1);
                    } else {
                        counter.textContent = target;
                    }
                }
            };
            
            updateCounter();
        });
    };
}

// Campaign Builder Interactive Preview
function initCampaignBuilder() {
    const goalButtons = document.querySelectorAll('.goal-btn');
    const industrySelect = document.getElementById('industry-select');
    
    // KPI data based on goal and industry
    const kpiData = {
        awareness: {
            gaming: { roas: '1.8x', ctr: '2.4%', cpa: '$18', conversion: '3.2%' },
            finance: { roas: '2.1x', ctr: '3.1%', cpa: '$42', conversion: '4.1%' },
            crypto: { roas: '2.3x', ctr: '2.8%', cpa: '$28', conversion: '3.8%' },
            realestate: { roas: '1.9x', ctr: '2.2%', cpa: '$38', conversion: '2.9%' }
        },
        conversion: {
            gaming: { roas: '2.4x', ctr: '3.2%', cpa: '$24', conversion: '4.7%' },
            finance: { roas: '2.8x', ctr: '3.8%', cpa: '$52', conversion: '5.2%' },
            crypto: { roas: '2.6x', ctr: '3.4%', cpa: '$34', conversion: '4.9%' },
            realestate: { roas: '2.2x', ctr: '2.8%', cpa: '$45', conversion: '3.8%' }
        },
        traffic: {
            gaming: { roas: '1.6x', ctr: '4.2%', cpa: '$16', conversion: '2.8%' },
            finance: { roas: '1.8x', ctr: '3.9%', cpa: '$28', conversion: '3.1%' },
            crypto: { roas: '1.7x', ctr: '4.1%', cpa: '$22', conversion: '2.9%' },
            realestate: { roas: '1.5x', ctr: '3.6%', cpa: '$26', conversion: '2.5%' }
        },
        leads: {
            gaming: { roas: '2.1x', ctr: '3.6%', cpa: '$28', conversion: '4.2%' },
            finance: { roas: '2.5x', ctr: '4.1%', cpa: '$48', conversion: '4.8%' },
            crypto: { roas: '2.3x', ctr: '3.8%', cpa: '$32', conversion: '4.4%' },
            realestate: { roas: '2.0x', ctr: '3.2%', cpa: '$42', conversion: '3.6%' }
        }
    };

    function updateKPIs() {
        const activeGoal = document.querySelector('.goal-btn.active');
        const selectedIndustry = industrySelect ? industrySelect.value : 'gaming';
        
        if (!activeGoal) return;
        
        const goal = activeGoal.getAttribute('data-goal');
        const data = kpiData[goal] && kpiData[goal][selectedIndustry] 
            ? kpiData[goal][selectedIndustry] 
            : kpiData.conversion.gaming;
        
        // Animate KPI updates
        animateKPIUpdate('kpi-roas', data.roas);
        animateKPIUpdate('kpi-ctr', data.ctr);
        animateKPIUpdate('kpi-cpa', data.cpa);
        animateKPIUpdate('kpi-conversion', data.conversion);
    }

    function animateKPIUpdate(elementId, newValue) {
        const element = document.getElementById(elementId);
        if (!element) return;
        
        element.style.transform = 'scale(1.1)';
        element.style.color = 'var(--accent-green)';
        
        setTimeout(() => {
            element.textContent = newValue;
            element.style.transform = 'scale(1)';
            element.style.color = 'var(--text-primary)';
        }, 150);
    }

    // Goal button interactions
    goalButtons.forEach(button => {
        button.addEventListener('click', () => {
            goalButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            updateKPIs();
        });
    });

    // Industry select change
    if (industrySelect) {
        industrySelect.addEventListener('change', updateKPIs);
    }

    // Initialize with default values
    setTimeout(updateKPIs, 500);
}

// Contact form handling
function initContactForm() {
    const contactForm = document.getElementById('contactForm');
    if (!contactForm) return;

    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        if (validateForm()) {
            showSubmissionModal();
        }
    });

    function validateForm() {
        const form = contactForm;
        let isValid = true;
        
        // Clear previous validation states
        form.querySelectorAll('.form-control, .form-select').forEach(input => {
            input.classList.remove('is-invalid', 'is-valid');
        });

        // Validate required fields
        const requiredFields = [
            'firstName', 'lastName', 'email', 'industry', 'message'
        ];

        requiredFields.forEach(fieldName => {
            const field = form.querySelector(`[name="${fieldName}"]`);
            if (field && !field.value.trim()) {
                field.classList.add('is-invalid');
                isValid = false;
            } else if (field) {
                field.classList.add('is-valid');
            }
        });

        // Validate email format
        const emailField = form.querySelector('[name="email"]');
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (emailField && emailField.value && !emailRegex.test(emailField.value)) {
            emailField.classList.add('is-invalid');
            emailField.classList.remove('is-valid');
            isValid = false;
        }

        // Validate services checkboxes
        const serviceCheckboxes = form.querySelectorAll('[name="services"]:checked');
        const servicesFeedback = document.getElementById('services-feedback');
        if (serviceCheckboxes.length === 0) {
            servicesFeedback.style.display = 'block';
            isValid = false;
        } else {
            servicesFeedback.style.display = 'none';
        }

        // Validate privacy checkbox
        const privacyCheckbox = form.querySelector('[name="privacy"]');
        if (privacyCheckbox && !privacyCheckbox.checked) {
            privacyCheckbox.classList.add('is-invalid');
            isValid = false;
        } else if (privacyCheckbox) {
            privacyCheckbox.classList.remove('is-invalid');
        }

        return isValid;
    }

    function showSubmissionModal() {
        const formData = new FormData(contactForm);
        const services = Array.from(contactForm.querySelectorAll('[name="services"]:checked'))
            .map(cb => cb.value);
        
        // Create email payload
        const emailContent = createEmailPayload(formData, services);
        
        // Show modal
        const modal = new bootstrap.Modal(document.getElementById('successModal'));
        document.getElementById('emailPayload').textContent = emailContent;
        
        // Setup email client button
        const emailButton = document.getElementById('openEmailClient');
        emailButton.onclick = () => {
            const subject = encodeURIComponent(`Campaign Inquiry from ${formData.get('firstName')} ${formData.get('lastName')}`);
            const body = encodeURIComponent(emailContent);
            window.location.href = `mailto:ootbmedia0@gmail.com?subject=${subject}&body=${body}`;
        };
        
        modal.show();
        
        // Reset form
        contactForm.reset();
        contactForm.querySelectorAll('.form-control, .form-select').forEach(input => {
            input.classList.remove('is-invalid', 'is-valid');
        });
    }

    function createEmailPayload(formData, services) {
        return `New Campaign Inquiry - OOTB Media

Contact Information:
Name: ${formData.get('firstName')} ${formData.get('lastName')}
Email: ${formData.get('email')}
Company: ${formData.get('company') || 'Not specified'}

Project Details:
Industry: ${formData.get('industry')}
Monthly Budget: ${formData.get('budget') || 'Not specified'}
Services Interested In: ${services.join(', ')}

Message:
${formData.get('message')}

---
This inquiry was submitted through the OOTB Media website contact form.
Timestamp: ${new Date().toLocaleString()}`;
    }
}

// Industry card interactions
function initIndustryInteractions() {
    const industryCards = document.querySelectorAll('.industry-card');
    
    industryCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            const industry = card.getAttribute('data-industry');
            
            // Add glow effect
            card.style.boxShadow = 'var(--shadow-xl), 0 0 30px rgba(74, 222, 128, 0.3)';
            
            // Subtle scale animation
            card.style.transform = 'translateY(-10px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.boxShadow = '';
            card.style.transform = '';
        });
    });

    // Social link hover effects
    const socialLinks = document.querySelectorAll('.social-link');
    socialLinks.forEach(link => {
        link.addEventListener('mouseenter', () => {
            link.style.transform = 'translateY(-8px) rotateY(5deg)';
        });
        
        link.addEventListener('mouseleave', () => {
            link.style.transform = '';
        });
    });
}

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Add loading states and micro-interactions
function addMicroInteractions() {
    // Button hover effects with ripple
    document.querySelectorAll('.btn').forEach(btn => {
        btn.addEventListener('click', function(e) {
            const ripple = document.createElement('span');
            const rect = btn.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.width = ripple.style.height = size + 'px';
            ripple.style.left = x + 'px';
            ripple.style.top = y + 'px';
            ripple.classList.add('ripple');
            
            btn.appendChild(ripple);
            
            setTimeout(() => ripple.remove(), 600);
        });
    });

    // Card tilt effect on mouse move
    document.querySelectorAll('.service-card, .case-card, .industry-detail-card').forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = (y - centerY) / 10;
            const rotateY = (centerX - x) / 10;
            
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(10px)`;
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = '';
        });
    });
}

// Initialize micro-interactions after DOM is loaded
setTimeout(addMicroInteractions, 100);

// Add CSS for ripple effect
const rippleCSS = `
.ripple {
    position: absolute;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.6);
    transform: scale(0);
    animation: ripple-animation 0.6s linear;
    pointer-events: none;
}

@keyframes ripple-animation {
    to {
        transform: scale(4);
        opacity: 0;
    }
}
`;

const style = document.createElement('style');
style.textContent = rippleCSS;
document.head.appendChild(style);

// Performance optimization - lazy load background images
function lazyLoadBackgrounds() {
    const backgrounds = document.querySelectorAll('[data-bg]');
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const bg = entry.target;
                bg.style.backgroundImage = `url(${bg.dataset.bg})`;
                bg.removeAttribute('data-bg');
                imageObserver.unobserve(bg);
            }
        });
    });

    backgrounds.forEach(bg => imageObserver.observe(bg));
}

// Initialize lazy loading
lazyLoadBackgrounds();

// Add scroll-to-top functionality
function addScrollToTop() {
    const scrollBtn = document.createElement('button');
    scrollBtn.innerHTML = '<i class="fas fa-arrow-up"></i>';
    scrollBtn.className = 'scroll-to-top';
    scrollBtn.style.cssText = `
        position: fixed;
        bottom: 2rem;
        left: 2rem;
        width: 50px;
        height: 50px;
        background: var(--accent-green);
        color: white;
        border: none;
        border-radius: 50%;
        cursor: pointer;
        opacity: 0;
        visibility: hidden;
        transition: all 0.3s ease;
        z-index: 999;
        box-shadow: var(--shadow-lg);
    `;
    
    document.body.appendChild(scrollBtn);
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 500) {
            scrollBtn.style.opacity = '1';
            scrollBtn.style.visibility = 'visible';
        } else {
            scrollBtn.style.opacity = '0';
            scrollBtn.style.visibility = 'hidden';
        }
    });
    
    scrollBtn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

// Add scroll to top button
addScrollToTop();

// Console welcome message
console.log(`
🚀 OOTB Media Website Loaded Successfully!
    
✨ Features Active:
   • Scroll-triggered animations
   • Interactive campaign builder
   • Form validation & email generation
   • Micro-interactions & hover effects
   • Performance optimizations
    
📧 Contact: ootbmedia0@gmail.com
📱 Telegram: @ootb25
    
Built with ❤️ for premium SEM & PPC campaigns
`);

// Error handling and fallbacks
window.addEventListener('error', (e) => {
    console.warn('OOTB Media: Non-critical error caught:', e.message);
});

// Ensure all interactive elements are accessible
document.querySelectorAll('button, .btn, .nav-link').forEach(el => {
    if (!el.getAttribute('aria-label') && !el.textContent.trim()) {
        el.setAttribute('aria-label', 'Interactive element');
    }
});

// Add keyboard navigation support
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        // Close any open modals
        const openModal = document.querySelector('.modal.show');
        if (openModal) {
            bootstrap.Modal.getInstance(openModal).hide();
        }
    }
});

// Initialize theme preference (future enhancement)
const prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
if (prefersDarkMode) {
    document.body.classList.add('theme-preference-dark');
}