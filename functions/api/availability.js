/**
 * COLPantallas – Cloudflare Pages Function
 * Archivo: availability.js
 *
 * Maneja la disponibilidad de plataformas en tiempo real usando Cloudflare KV.
 *
 * Endpoints:
 *   GET  /api/availability  → devuelve JSON con disponibilidad actual
 *   POST /api/availability  → actualiza disponibilidad (requiere contraseña)
 */

// Estado por defecto: todas disponibles
const DEFAULT_AVAILABILITY = {
    netflix_premium: true,
    disney_premium: true,
    disney_standard: true,
    prime: true,
    hbo: true,
    paramount: true,
    vix: true,
};

const CORS_HEADERS = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Cache-Control': 'no-cache, no-store, must-revalidate',
};

//  GET: obtener disponibilidad 
export async function onRequestGet({ env }) {
    try {
        // AVAILABILITY_KV es el binding que debes crear en Cloudflare Pages → Settings → KV
        const raw = await env.AVAILABILITY_KV.get('platforms');
        const data = raw ? { ...DEFAULT_AVAILABILITY, ...JSON.parse(raw) } : DEFAULT_AVAILABILITY;

        return new Response(JSON.stringify(data), { headers: CORS_HEADERS });
    } catch (err) {
        // Si KV no está configurado, devolver defaults (la página funcionará igual)
        return new Response(JSON.stringify(DEFAULT_AVAILABILITY), { headers: CORS_HEADERS });
    }
}

//  POST: actualizar disponibilidad ─
export async function onRequestPost({ request, env }) {
    // Verificar contraseña de administrador
    const adminPassword = env.ADMIN_PASSWORD || 'colpantallas2026';
    const headerPassword = request.headers.get('X-Admin-Password');

    if (headerPassword !== adminPassword) {
        return new Response(JSON.stringify({ error: 'No autorizado' }), { status: 401, headers: CORS_HEADERS });
    }

    try {
        const body = await request.json();

        // Validar que solo contiene claves válidas
        const validKeys = Object.keys(DEFAULT_AVAILABILITY);
        const clean = {};
        for (const key of validKeys) {
            if (typeof body[key] === 'boolean') clean[key] = body[key];
            else clean[key] = DEFAULT_AVAILABILITY[key];
        }

        await env.AVAILABILITY_KV.put('platforms', JSON.stringify(clean));

        return new Response(JSON.stringify({ ok: true, data: clean }), { headers: CORS_HEADERS });
    } catch (err) {
        return new Response(JSON.stringify({ error: 'Error interno: ' + err.message }), { status: 500, headers: CORS_HEADERS });
    }
}

//  OPTIONS: preflight CORS 
export async function onRequestOptions() {
    return new Response(null, {
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, X-Admin-Password',
        },
    });
}
