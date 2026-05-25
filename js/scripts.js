/*!
 * Robert Tian — personal site scripts
 * Vanilla JS. Handles mobile nav, scrollspy, reveal-on-scroll, footer year.
 */

(function () {
    'use strict';

    document.addEventListener('DOMContentLoaded', () => {
        setupMobileNav();
        setupScrollSpy();
        setupReveal();
        setupYear();
    });

    /* ---------- Mobile navigation ---------- */
    function setupMobileNav() {
        const toggle = document.getElementById('menuToggle');
        const links = document.getElementById('navLinks');
        if (!toggle || !links) return;

        const close = () => {
            links.classList.remove('open');
            toggle.classList.remove('open');
            toggle.setAttribute('aria-expanded', 'false');
        };
        const open = () => {
            links.classList.add('open');
            toggle.classList.add('open');
            toggle.setAttribute('aria-expanded', 'true');
        };

        toggle.addEventListener('click', () => {
            links.classList.contains('open') ? close() : open();
        });

        links.querySelectorAll('a[href^="#"]').forEach((link) => {
            link.addEventListener('click', () => {
                if (window.matchMedia('(max-width: 820px)').matches) close();
            });
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') close();
        });
    }

    /* ---------- Scroll spy (highlight active nav link) ---------- */
    function setupScrollSpy() {
        const navLinks = Array.from(document.querySelectorAll('#navLinks a[href^="#"]'));
        if (!navLinks.length) return;

        const sections = navLinks
            .map((a) => {
                const id = a.getAttribute('href').slice(1);
                const el = document.getElementById(id);
                return el ? { id, el, link: a } : null;
            })
            .filter(Boolean);
        if (!sections.length) return;

        const setActive = (id) => {
            navLinks.forEach((l) => {
                const match = l.getAttribute('href') === '#' + id;
                l.classList.toggle('active', match);
            });
        };

        const observer = new IntersectionObserver(
            (entries) => {
                const visible = entries
                    .filter((e) => e.isIntersecting)
                    .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
                if (visible.length) setActive(visible[0].target.id);
            },
            {
                rootMargin: '-40% 0px -50% 0px',
                threshold: [0, 0.25, 0.5, 0.75, 1],
            }
        );

        sections.forEach((s) => observer.observe(s.el));
    }

    /* ---------- Reveal on scroll ---------- */
    function setupReveal() {
        const items = document.querySelectorAll('.reveal');
        if (!items.length) return;

        if (!('IntersectionObserver' in window)) {
            items.forEach((el) => el.classList.add('in'));
            return;
        }

        const io = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('in');
                        io.unobserve(entry.target);
                    }
                });
            },
            { rootMargin: '0px 0px -10% 0px', threshold: 0.08 }
        );

        items.forEach((el) => io.observe(el));
    }

    /* ---------- Footer year ---------- */
    function setupYear() {
        const el = document.getElementById('year');
        if (el) el.textContent = new Date().getFullYear();
    }
})();
