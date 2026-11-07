const carouselPreview = () => {
    const page = document.body;
    const track = document.querySelector('.projects-showcase');
    if (!track) return;

    const introReplay = document.querySelector('.intro-replay');
    if (introReplay) {
        introReplay.addEventListener('click', () => window.location.reload());
    }

    const slides = [...track.querySelectorAll('.solution-card')];
    const variants = [
        ['editorial', 'Editorial'],
        ['coverflow', 'Coverflow'],
        ['commercial', 'Comercial']
    ];
    const selectedVariant = new URLSearchParams(window.location.search).get('variant') || page.dataset.defaultVariant || 'editorial';
    const currentVariant = variants.some(([key]) => key === selectedVariant) ? selectedVariant : 'editorial';

    page.classList.add(`variant-${currentVariant}`);

    const controls = document.createElement('div');
    controls.className = 'carousel-control-bar';
    controls.innerHTML = `
        <div class="carousel-buttons" aria-label="Navegação dos projetos">
            <button type="button" data-carousel-prev aria-label="Projeto anterior">←</button>
            <div class="carousel-dots" aria-label="Selecionar projeto"></div>
            <button type="button" data-carousel-next aria-label="Próximo projeto">→</button>
        </div>
        <div class="carousel-variants" aria-label="Variantes da prévia"></div>
    `;
    track.parentElement.insertBefore(controls, track);

    const dots = controls.querySelector('.carousel-dots');
    const variantsBar = controls.querySelector('.carousel-variants');

    slides.forEach((slide, index) => {
        slide.dataset.slide = index;
        const dot = document.createElement('button');
        dot.className = 'carousel-dot';
        dot.type = 'button';
        dot.setAttribute('aria-label', `Mostrar projeto ${index + 1}`);
        dot.addEventListener('click', () => slide.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' }));
        dots.append(dot);
    });

    variants.forEach(([key, label]) => {
        const button = document.createElement('button');
        button.type = 'button';
        button.textContent = label;
        button.classList.toggle('is-active', key === currentVariant);
        button.addEventListener('click', () => {
            window.location.search = `?variant=${key}`;
        });
        variantsBar.append(button);
    });

    const setCurrent = (index) => {
        slides.forEach((slide, slideIndex) => slide.classList.toggle('is-current', slideIndex === index));
        [...dots.children].forEach((dot, dotIndex) => dot.classList.toggle('is-active', dotIndex === index));
    };

    const showSlide = (direction) => {
        const current = slides.findIndex((slide) => slide.classList.contains('is-current'));
        const next = (current + direction + slides.length) % slides.length;
        slides[next].scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
    };

    controls.querySelector('[data-carousel-prev]').addEventListener('click', () => showSlide(-1));
    controls.querySelector('[data-carousel-next]').addEventListener('click', () => showSlide(1));

    const observer = new IntersectionObserver((entries) => {
        const visible = entries.filter((entry) => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) setCurrent(Number(visible.target.dataset.slide));
    }, { root: track, threshold: [0.55, 0.8] });

    slides.forEach((slide) => observer.observe(slide));
    setCurrent(0);

    const typingName = document.querySelector('.typing-name');
    if (typingName) {
        const typingText = typingName.querySelector('.typing-name-text');
        const text = typingName.dataset.typingText || typingText.textContent.trim();
        const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        let hasTyped = false;

        const typeName = () => {
            if (hasTyped) return;
            hasTyped = true;

            if (reducedMotion) {
                typingText.textContent = text;
                return;
            }

            typingText.textContent = '';
            const typingDuration = 3500;
            const characterDelay = typingDuration / text.length;
            [...text].forEach((character, index) => {
                window.setTimeout(() => {
                    typingText.textContent += character;
                }, characterDelay * index);
            });
        };

        if (reducedMotion || !('IntersectionObserver' in window)) {
            typeName();
        } else {
            const typingObserver = new IntersectionObserver((entries) => {
                if (entries.some((entry) => entry.isIntersecting)) {
                    typeName();
                    typingObserver.disconnect();
                }
            }, { threshold: 0.65 });

            typingObserver.observe(typingName);
        }
    }

    const introName = document.querySelector('.intro-name-text');
    if (introName) {
        const text = 'Juliana Rainen';
        const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        const introDuration = 3500;
        const characterDelay = introDuration / text.length;

        if (reducedMotion) {
            introName.textContent = text;
        } else {
            introName.textContent = '';
            [...text].forEach((character, index) => {
                window.setTimeout(() => {
                    introName.textContent += character;
                }, characterDelay * index + 350);
            });
        }
    }
};

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', carouselPreview);
} else {
    carouselPreview();
}
