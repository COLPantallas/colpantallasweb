/* Modulo principal de interactividad */

(function () {
    'use strict';

    /* Referencias del DOM */
    const botonMenu = document.getElementById('botonMenu');
    const menuMovil = document.getElementById('menuMovil');
    const listaPreguntas = document.getElementById('listaPreguntas');

    /* Menu movil: alternar apertura */
    function alternarMenu() {
        const estaAbierto = menuMovil.classList.toggle('abierto');
        botonMenu.setAttribute('aria-expanded', estaAbierto);
        document.body.style.overflow = estaAbierto ? 'hidden' : '';
    }

    /* Cierra el menu al hacer clic en un enlace */
    function cerrarMenuAlNavegar() {
        menuMovil.classList.remove('abierto');
        botonMenu.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
    }

    /* Inicializar el menu movil */
    function iniciarMenuMovil() {
        if (!botonMenu || !menuMovil) return;
        botonMenu.addEventListener('click', alternarMenu);
        menuMovil.querySelectorAll('a').forEach(function (enlace) {
            enlace.addEventListener('click', cerrarMenuAlNavegar);
        });
    }

    /* Acordeon de preguntas frecuentes */
    function alternarPregunta(elementoItem) {
        const respuesta = elementoItem.querySelector('.pregunta-respuesta');
        const botonTitulo = elementoItem.querySelector('.pregunta-titulo');
        const estaActiva = elementoItem.classList.contains('activa');

        /* Cierra todas las preguntas abiertas */
        listaPreguntas.querySelectorAll('.pregunta-item.activa').forEach(function (itemAbierto) {
            if (itemAbierto !== elementoItem) {
                itemAbierto.classList.remove('activa');
                itemAbierto.querySelector('.pregunta-respuesta').hidden = true;
                itemAbierto.querySelector('.pregunta-titulo').setAttribute('aria-expanded', 'false');
            }
        });

        /* Alterna el estado de la pregunta actual */
        if (estaActiva) {
            elementoItem.classList.remove('activa');
            respuesta.hidden = true;
            botonTitulo.setAttribute('aria-expanded', 'false');
        } else {
            elementoItem.classList.add('activa');
            respuesta.hidden = false;
            botonTitulo.setAttribute('aria-expanded', 'true');
        }
    }

    /* Inicializar el acordeon */
    function iniciarAcordeon() {
        if (!listaPreguntas) return;
        listaPreguntas.querySelectorAll('.pregunta-item').forEach(function (elementoItem) {
            const botonTitulo = elementoItem.querySelector('.pregunta-titulo');
            if (botonTitulo) {
                botonTitulo.addEventListener('click', function () {
                    alternarPregunta(elementoItem);
                });
            }
        });
    }

    /* Reveal de elementos al hacer scroll */
    function iniciarRevealScroll() {
        const elementosRevelar = document.querySelectorAll('.revelar');
        if (!elementosRevelar.length) return;

        const observadorOpciones = {
            threshold: 0.08,
            rootMargin: '0px 0px -40px 0px',
        };

        const observador = new IntersectionObserver(function (entradas) {
            entradas.forEach(function (entrada) {
                if (entrada.isIntersecting) {
                    entrada.target.classList.add('visible');
                    observador.unobserve(entrada.target);
                }
            });
        }, observadorOpciones);

        elementosRevelar.forEach(function (elemento) {
            observador.observe(elemento);
        });
    }

    /* Ejecutar al cargar el DOM */
    document.addEventListener('DOMContentLoaded', function () {
        iniciarMenuMovil();
        iniciarAcordeon();
        iniciarRevealScroll();
    });
})();
