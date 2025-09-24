
document.addEventListener('DOMContentLoaded', function() {
    initScrollAnimations();
    initNavbar();
    initCounterAnimations();
    initTypingSubtitles();
    initCampaignBuilder();
    initContactForm();
    initIndustryInteractions();
    initPerformanceLoop();
});

function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    function handleReveal(target) {
        if (!target) return;
        if (!target.classList.contains('revealed')) {
            target.classList.add('revealed');
        }
        if (target.classList.contains('hero-stats') || target.classList.contains('hero-stats-inline')) {
            animateCounters(target);
        }
        if (target.classList.contains('section-subtitle')) {
            startTypingSubtitle(target);
        }
        if (target.classList.contains('metric-bars')) {
            target.querySelectorAll('.bar').forEach(bar => {
                const value = parseInt(bar.getAttribute('data-value') || '0', 10);
                const fill = bar.querySelector('.bar-fill');
                if (fill) {
                    requestAnimationFrame(() => {
                        fill.style.width = Math.max(0, Math.min(100, value)) + '%';
                    });
                }
            });
        }
    }

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                handleReveal(entry.target);
            }
        });
    }, observerOptions);

    const revealSelectors = '.reveal-up, .reveal-left, .reveal-right, .reveal-slide-left, .reveal-slide-right, .reveal-fade, .section-subtitle, .hero-stats-inline, .hero-stats, .metric-bars';
    const revealables = document.querySelectorAll(revealSelectors);
    revealables.forEach(el => observer.observe(el));

    // Immediately reveal anything already in viewport on load to avoid initial overflow/shift
    requestAnimationFrame(() => {
        const vw = window.innerWidth;
        const vh = window.innerHeight;
        revealables.forEach(el => {
            const r = el.getBoundingClientRect();
            const inView = r.bottom >= 0 && r.right >= 0 && r.top <= vh && r.left <= vw;
            if (inView) handleReveal(el);
        });
    });
}

function initNavbar() {
    const navbar = document.getElementById('mainNav');
    let lastScrollY = window.pageYOffset || document.documentElement.scrollTop;

    const handleScroll = () => {
        const currentY = window.pageYOffset || document.documentElement.scrollTop;

        if (currentY > 100) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        const isDesktop = window.innerWidth >= 992;
        if (isDesktop) {
            if (currentY > lastScrollY && currentY > 150) {
                navbar.classList.add('navbar-hidden');
            } else {
                navbar.classList.remove('navbar-hidden');
            }
        } else {
            navbar.classList.remove('navbar-hidden');
        }

        lastScrollY = currentY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', () => {
        if (window.innerWidth < 992) {
            navbar.classList.remove('navbar-hidden');
        }
    });
}

function initCounterAnimations() {
    window.animateCounters = function(rootEl) {
        const scope = rootEl || document;
        const counters = scope.querySelectorAll ? scope.querySelectorAll('.stat-number') : document.querySelectorAll('.stat-number');
        counters.forEach(counter => {
            const targetAttr = counter.getAttribute('data-target');
            if (!targetAttr) return;
            const target = parseFloat(targetAttr);
            const decimals = parseInt(counter.getAttribute('data-decimals') || (target % 1 !== 0 ? '1' : '0'), 10);
            const prefix = counter.getAttribute('data-prefix') || '';
            const suffix = counter.getAttribute('data-suffix') || '';
            if (counter.dataset.counting === 'true') return;
            counter.dataset.counting = 'true';
            let current = 0;
            const steps = 100;
            const increment = target / steps;
            
            const updateCounter = () => {
                if (current < target) {
                    current += increment;
                    if (current > target) current = target;
                    const value = decimals > 0 ? current.toFixed(decimals) : Math.floor(current).toString();
                    counter.textContent = `${prefix}${value}${suffix}`;
                    
                    requestAnimationFrame(updateCounter);
                } else {
                    const value = decimals > 0 ? target.toFixed(decimals) : Math.round(target).toString();
                    counter.textContent = `${prefix}${value}${suffix}`;
                }
            };
            
            updateCounter();
        });
    };
}

function initTypingSubtitles() {
    const subtitles = document.querySelectorAll('.section-subtitle');
    subtitles.forEach((subtitle) => {
        const fullText = (subtitle.textContent || '').trim();
        if (!fullText || subtitle.dataset.typingPrepared === 'true') return;
        subtitle.dataset.typingPrepared = 'true';
        subtitle.dataset.fulltext = fullText;
        subtitle.setAttribute('aria-label', fullText);
        subtitle.textContent = '';
    });
}

function startTypingSubtitle(el) {
    if (!el || el.dataset.typed === 'true') return;
    const text = el.dataset.fulltext || '';
    if (!text) return;
    if (el.dataset.typingStarted === 'true') return;
    el.dataset.typingStarted = 'true';
    el.classList.add('typing');

    const typeSpeedMs = 20;
    let i = 1;
    const typeStep = () => {
        if (i > text.length) {
            el.classList.remove('typing');
            el.dataset.typed = 'true';
            return;
        }
        el.textContent = text.slice(0, i);
        i += 1;
        setTimeout(typeStep, typeSpeedMs);
    };
    typeStep();
}

function initCampaignBuilder() {
    const goalButtons = document.querySelectorAll('.goal-btn');
    const industrySelect = document.getElementById('industry-select');
    
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

    goalButtons.forEach(button => {
        button.addEventListener('click', () => {
            goalButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            updateKPIs();
        });
    });

    if (industrySelect) {
        industrySelect.addEventListener('change', updateKPIs);
    }

    setTimeout(updateKPIs, 500);
}

function initContactForm() {
    const contactForm = document.getElementById('contactForm');
    if (!contactForm) return;

    contactForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        if (!validateForm()) return;
        
        const submitBtn = contactForm.querySelector('button[type="submit"]');
        const textEl = submitBtn?.querySelector('.submit-text');
        const spinnerEl = submitBtn?.querySelector('.submit-spinner');
        function setLoading(loading) {
            if (!submitBtn) return;
            submitBtn.disabled = loading;
            if (textEl && spinnerEl) {
                if (loading) { spinnerEl.classList.remove('d-none'); textEl.classList.add('d-none'); }
                else { spinnerEl.classList.add('d-none'); textEl.classList.remove('d-none'); }
            }
        }
        
        const formData = new FormData(contactForm);
        setLoading(true);
        try {
            const resp = await fetch('send_mail.php', {
                method: 'POST',
                body: formData,
                headers: { 'X-Requested-With': 'XMLHttpRequest' }
            });
            const isJSON = (resp.headers.get('content-type') || '').includes('application/json');
            if (!resp.ok) {
                if (isJSON) {
                    const data = await resp.json();
                    alert(data.error || (data.errors && data.errors.join('\n')) || 'Failed to send.');
                } else {
                    const txt = await resp.text();
                    alert('Failed to send.');
                    console.warn('send_mail.php response:', txt);
                }
                setLoading(false);
                return;
            }
            const data = isJSON ? await resp.json() : { success: true, preview: '' };
            const emailContent = data.preview && typeof data.preview === 'string' ? data.preview : createEmailPayload(formData, Array.from(contactForm.querySelectorAll('[name="services"]:checked')).map(cb => cb.value));
            const modal = new bootstrap.Modal(document.getElementById('successModal'));
            document.getElementById('emailPayload').textContent = emailContent;
            modal.show();
            contactForm.reset();
            contactForm.querySelectorAll('.form-control, .form-select').forEach(input => {
                input.classList.remove('is-invalid', 'is-valid');
            });
        } catch (err) {
            console.warn('Network or server error while sending form:', err);
            setLoading(false);
            contactForm.submit();
            return;
        }
        setLoading(false);
    });

    function validateForm() {
        const form = contactForm;
        let isValid = true;
        
        form.querySelectorAll('.form-control, .form-select').forEach(input => {
            input.classList.remove('is-invalid', 'is-valid');
        });

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

        const emailField = form.querySelector('[name="email"]');
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (emailField && emailField.value && !emailRegex.test(emailField.value)) {
            emailField.classList.add('is-invalid');
            emailField.classList.remove('is-valid');
            isValid = false;
        }

        const serviceCheckboxes = form.querySelectorAll('[name="services"]:checked');
        const servicesFeedback = document.getElementById('services-feedback');
        if (serviceCheckboxes.length === 0) {
            servicesFeedback.style.display = 'block';
            isValid = false;
        } else {
            servicesFeedback.style.display = 'none';
        }

        const privacyCheckbox = form.querySelector('[name="privacy"]');
        if (privacyCheckbox && !privacyCheckbox.checked) {
            privacyCheckbox.classList.add('is-invalid');
            isValid = false;
        } else if (privacyCheckbox) {
            privacyCheckbox.classList.remove('is-invalid');
        }

        return isValid;
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

function initIndustryInteractions() {
    const industryCards = document.querySelectorAll('.industry-card');
    
    industryCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            const industry = card.getAttribute('data-industry');
            
            card.style.boxShadow = 'var(--shadow-xl), 0 0 30px rgba(74, 222, 128, 0.3)';
            
            card.style.transform = 'translateY(-10px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.boxShadow = '';
            card.style.transform = '';
        });
    });

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

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = (this.getAttribute('href') || '').trim();
        if (!href || href === '#') {
            return; 
        }
        e.preventDefault();
        let target;
        try {
            target = document.querySelector(href);
        } catch (_) {
            return;
        }
        if (target) {
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
});

function addMicroInteractions() {
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

}

setTimeout(addMicroInteractions, 100);

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

lazyLoadBackgrounds();

function initPerformanceLoop() {
    const svg = document.querySelector('.ellipse-svg');
    const path = document.getElementById('loopPath');
    const runner = document.getElementById('loopRunner');
    const runnerGlow = document.getElementById('loopRunnerGlow');
    const markersGroup = document.getElementById('loopMarkers');
    const tooltip = document.getElementById('ellipseTooltip');
    if (!svg || !path || !runner || !runnerGlow || !markersGroup || !tooltip) return;

    const phases = [
        { key: 'research', t: 0.02, title: 'Research', text: 'Market sizing, intent mapping, competitors, clustering.' },
        { key: 'launch',   t: 0.26, title: 'Launch',   text: 'Initial structures, fast keyword/creative iteration.' },
        { key: 'optimize', t: 0.52, title: 'Optimize', text: 'Bids, audiences, speed, CRO. Raise CVR, lower CPA.' },
        { key: 'scale',    t: 0.78, title: 'Scale',    text: 'Budget ramp with ROAS guardrails, LTV-based growth.' }
    ];

    const total = path.getTotalLength();
    function pointAt(t) {
        const p = path.getPointAtLength(Math.max(0, Math.min(1, t)) * total);
        return { x: p.x, y: p.y };
    }

    phases.forEach((phase) => {
        const pos = pointAt(phase.t);
        const c = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        c.setAttribute('cx', pos.x);
        c.setAttribute('cy', pos.y);
        c.setAttribute('r', '8');
        c.setAttribute('class', `loop-marker ${phase.key}`);
        c.setAttribute('tabindex', '0');
        c.setAttribute('role', 'img');
        c.setAttribute('aria-label', `${phase.title}: ${phase.text}`);
        markersGroup.appendChild(c);
    });

    function showTooltip(x, y, title, text, colorVar) {
        tooltip.innerHTML = `<strong style="color:${colorVar}">${title}</strong><div>${text}</div>`;
        tooltip.style.left = `${x}px`;
        tooltip.style.top = `${y}px`;
        tooltip.setAttribute('aria-hidden', 'false');
    }
    function hideTooltip() { tooltip.setAttribute('aria-hidden', 'true'); }

    const colorByKey = {
        research: getComputedStyle(document.documentElement).getPropertyValue('--accent-green') || '#10b981',
        launch: getComputedStyle(document.documentElement).getPropertyValue('--accent-blue') || '#3b82f6',
        optimize: getComputedStyle(document.documentElement).getPropertyValue('--accent-warm') || '#f59e0b',
        scale: '#8b5cf6'
    };

    markersGroup.addEventListener('pointerover', (e) => {
        const target = e.target.closest('.loop-marker');
        if (!target) return;
        const key = [...target.classList].find(c => ['research','launch','optimize','scale'].includes(c));
        const phase = phases.find(p => p.key === key);
        if (!phase) return;
        const rect = svg.getBoundingClientRect();
        const x = parseFloat(target.getAttribute('cx')) + rect.left;
        const y = parseFloat(target.getAttribute('cy')) + rect.top;
        showTooltip(x, y, phase.title, phase.text, colorByKey[key]);
    });
    markersGroup.addEventListener('pointerout', hideTooltip);
    markersGroup.addEventListener('click', (e) => {
        const target = e.target.closest('.loop-marker');
        if (!target) return;
        const key = [...target.classList].find(c => ['research','launch','optimize','scale'].includes(c));
        const phase = phases.find(p => p.key === key);
        if (!phase) return;
        target.focus();
        const rect = svg.getBoundingClientRect();
        const x = parseFloat(target.getAttribute('cx')) + rect.left;
        const y = parseFloat(target.getAttribute('cy')) + rect.top;
        showTooltip(x, y, phase.title, phase.text, colorByKey[key]);
        setTimeout(hideTooltip, 2000);
    });

    function animateRunner() {
        let t = 0;
        const speed = 0.0022;
        function tick() {
            t += speed;
            if (t > 1) t = 0;
            const pos = pointAt(t);
            runner.setAttribute('cx', pos.x);
            runner.setAttribute('cy', pos.y);
            runnerGlow.setAttribute('cx', pos.x);
            runnerGlow.setAttribute('cy', pos.y);
            runnerGlow.style.transform = `translateZ(0)`;
            requestAnimationFrame(tick);
        }
        requestAnimationFrame(tick);
    }

    const section = document.getElementById('performance-loop');
    if (!section) return;
    const io = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateRunner();
                io.disconnect();
            }
        });
    }, { threshold: 0.2 });
    io.observe(section);
}

function addScrollToTop() {
    const scrollBtn = document.createElement('button');
    scrollBtn.innerHTML = '<i class="fas fa-arrow-up"></i>';
    scrollBtn.className = 'scroll-to-top';
    scrollBtn.style.cssText = `
        position: fixed;
        bottom: 4rem;
        right: 1rem;
        width: 40px;
        height: 40px;
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

addScrollToTop();


window.addEventListener('error', (e) => {
    console.warn('OOTB Media: Non-critical error caught:', e.message);
});

document.querySelectorAll('button, .btn, .nav-link').forEach(el => {
    if (!el.getAttribute('aria-label') && !el.textContent.trim()) {
        el.setAttribute('aria-label', 'Interactive element');
    }
});

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        const openModal = document.querySelector('.modal.show');
        if (openModal) {
            bootstrap.Modal.getInstance(openModal).hide();
        }
    }
});

const prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
if (prefersDarkMode) {
    document.body.classList.add('theme-preference-dark');
}

(function initNativeSwiper() {
    function $(sel, ctx=document) { return ctx.querySelector(sel); }
    function $all(sel, ctx=document) { return Array.from(ctx.querySelectorAll(sel)); }
  
    function findContainer() {
      return document.querySelector('.industries-snap') 
          || document.querySelector('.industries-carousel')
          || document.querySelector('#industries .industries-snap')
          || document.querySelector('#industries .industries-carousel');
    }
  
    function findButtons(container) {
      return {
        prev: container.querySelector('.swipe-prev') || document.querySelector('.swipe-prev') || document.querySelector('.swiper-button-prev') || document.querySelector('.swipe-prev-btn'),
        next: container.querySelector('.swipe-next') || document.querySelector('.swipe-next') || document.querySelector('.swiper-button-next') || document.querySelector('.swipe-next-btn')
      };
    }
  
    function getSlides(container) {
     const children = Array.from(container.children).filter(n => n.nodeType === 1);
      return children.filter(ch => !ch.classList.contains('swipe-controls') && !ch.classList.contains('swiper-pagination') && !ch.classList.contains('swiper-button-next') && !ch.classList.contains('swiper-button-prev'));
    }
  
    function scrollToCenter(container, el, behavior = 'smooth') {
      const containerRect = container.getBoundingClientRect();
      const elRect = el.getBoundingClientRect();
      const elCenter = elRect.left + elRect.width/2;
      const containerCenter = containerRect.left + container.clientWidth/2;
      const delta = elCenter - containerCenter;
      const target = Math.max(0, container.scrollLeft + delta);
      container.scrollTo({ left: Math.round(target), behavior });
    }
  
    function findClosestIndex(container, slides) {
      const containerRect = container.getBoundingClientRect();
      const center = containerRect.left + container.clientWidth/2;
      let best = { idx: 0, dist: Infinity };
      slides.forEach((s, i) => {
        const r = s.getBoundingClientRect();
        const c = r.left + r.width/2;
        const d = Math.abs(c - center);
        if (d < best.dist) { best = { idx: i, dist: d }; }
      });
      return best.idx;
    }
  
    function setActiveClass(container, slides) {
      const idx = findClosestIndex(container, slides);
      slides.forEach((s,i) => {
        if (i === idx) s.classList.add('active-slide'); else s.classList.remove('active-slide');
      });
      return idx;
    }
  
    function clamp(v, a, b) { return Math.max(a, Math.min(b, v)); }
  
    const container = findContainer();
    if (!container) return;
  
    if (!container.hasAttribute('tabindex')) container.setAttribute('tabindex', '0');
  
    const slides = getSlides(container);
    if (!slides.length) return;
  
    const btns = findButtons(container);
  
    const goToIndex = (i) => {
      const idx = clamp(i, 0, slides.length - 1);
      scrollToCenter(container, slides[idx]);
    };
  
    if (btns.prev) {
      btns.prev.addEventListener('click', (e) => {
        e.preventDefault();
        const cur = findClosestIndex(container, slides);
        goToIndex(cur - 1);
      });
    }
    if (btns.next) {
      btns.next.addEventListener('click', (e) => {
        e.preventDefault();
        const cur = findClosestIndex(container, slides);
        goToIndex(cur + 1);
      });
    }
  
    // keyboard navigation when focused
    container.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        const cur = findClosestIndex(container, slides);
        goToIndex(cur - 1);
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        const cur = findClosestIndex(container, slides);
        goToIndex(cur + 1);
      }
    });
  
    let rafId = null;
    container.addEventListener('scroll', () => {
      if (rafId) cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        setActiveClass(container, slides);
        rafId = null;
      });
    }, { passive: true });
  
    setTimeout(() => {
      setActiveClass(container, slides);
    }, 60);
  
    (function enableDrag() {
      let isDown = false, startX = 0, startScroll = 0, pointerId = null;
      container.addEventListener('pointerdown', (e) => {
        if (e.button && e.button !== 0) return;
        isDown = true;
        pointerId = e.pointerId;
        container.setPointerCapture(pointerId);
        startX = e.clientX;
        startScroll = container.scrollLeft;
        container.classList.add('dragging');
      });
      container.addEventListener('pointermove', (e) => {
        if (!isDown) return;
        const dx = e.clientX - startX;
        container.scrollLeft = startScroll - dx;
      });
      const release = (e) => {
        if (!isDown) return;
        isDown = false;
        try { container.releasePointerCapture(pointerId); } catch(_) {}
        container.classList.remove('dragging');
        setTimeout(() => setActiveClass(container, slides) && scrollToCenter(container, slides[findClosestIndex(container, slides)], 'smooth'), 80);
      };
      container.addEventListener('pointerup', release);
      container.addEventListener('pointercancel', release);
      container.addEventListener('pointerleave', release);
    })();
  
    function toggleButtonsVisibility() {
      const totalWidth = slides.reduce((sum, s) => sum + s.getBoundingClientRect().width, 0);
      if (btns.prev) btns.prev.style.display = totalWidth <= container.clientWidth ? 'none' : '';
      if (btns.next) btns.next.style.display = totalWidth <= container.clientWidth ? 'none' : '';
    }
    window.addEventListener('resize', () => {
      toggleButtonsVisibility();
      const cur = findClosestIndex(container, slides);
      scrollToCenter(container, slides[cur], 'auto');
    });
    toggleButtonsVisibility();
  
    window.OOTB_nativeSwipe = { container, slides, goToIndex: (i) => goToIndex(i) };
  
  })();
  