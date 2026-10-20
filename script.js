(() => {
    const progress = document.querySelector('.scroll-progress');
    let scrollQueued = false;

    const updateProgress = () => {
        const scrollableHeight = document.documentElement.scrollHeight - window.innerHeight;
        const value = scrollableHeight > 0 ? window.scrollY / scrollableHeight : 0;
        progress.style.transform = `scaleX(${Math.min(1, Math.max(0, value))})`;
        scrollQueued = false;
    };

    window.addEventListener('scroll', () => {
        if (!scrollQueued) {
            scrollQueued = true;
            window.requestAnimationFrame(updateProgress);
        }
    }, { passive: true });
    window.addEventListener('resize', updateProgress);
    updateProgress();

    if (!('IntersectionObserver' in window) || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        return;
    }

    const targets = document.querySelectorAll([
        'main > section .section-heading',
        '#about > p',
        '#skills .skill-group',
        '#soft-skills .skills-grid',
        '#projects .projects-showcase',
        '.services-section .stats-grid',
        '.services-section .services-grid',
        '.about-extra > p',
        '.about-extra > ul'
    ].join(', '));

    const countBySection = new Map();
    targets.forEach((target) => {
        const section = target.closest('section');
        const count = countBySection.get(section) || 0;
        target.style.setProperty('--reveal-delay', `${Math.min(count * 65, 195)}ms`);
        countBySection.set(section, count + 1);
        target.classList.add('reveal-target');

        const bounds = target.getBoundingClientRect();
        if (bounds.top < window.innerHeight * 0.9 && bounds.bottom > 0) {
            target.classList.add('is-visible');
        }
    });

    document.documentElement.classList.add('motion-ready');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target);
            }
        });
    }, { rootMargin: '0px 0px -32px 0px', threshold: 0.05 });

    targets.forEach((target) => {
        if (!target.classList.contains('is-visible')) {
            observer.observe(target);
        }
    });
})();
