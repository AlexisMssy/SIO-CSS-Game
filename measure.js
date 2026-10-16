// Mesures en navigateur (spec §5.2) : débordement horizontal, cibles tactiles, contraste.
// Usage :
//   node measure.js              toutes les pages, bloquantes sauf celles de measure-exempt.txt (pas encore refaites)
//   node measure.js page.html …  les pages données, toutes bloquantes (pour travailler sur une page)
// Les pages sont servies depuis dist/, c'est-à-dire exactement le paquet déployé.
const fs = require('node:fs');
const http = require('node:http');
const path = require('node:path');
const { execFileSync } = require('node:child_process');

const WIDTHS = [375, 768, 1280];
const MIN_TARGET = 44;
const MIN_CONTRAST = 4.5;
const MIN_CONTRAST_LARGE = 3;
const LARGE_TEXT_PX = 24;
const EXEMPT_LIST = path.join(__dirname, 'measure-exempt.txt');

// Pages pas encore refaites, exemptées temporairement : une par ligne, chemin relatif à la racine du site ; « # » pour un commentaire.
function readExemptPages() {
    return fs.readFileSync(EXEMPT_LIST, 'utf8').split('\n').map(line => line.replace(/#.*/, '').trim()).filter(Boolean);
}

// Toute page bloque par défaut ; une page demandée explicitement bloque toujours.
function isBlocking(pagePath, { exempt, requested = [] }) {
    return requested.length > 0 || !exempt.has(pagePath);
}

// Exécuté dans la page : renvoie la liste des problèmes trouvés.
function auditInPage({ minTarget, minContrast, minContrastLarge, largeTextPx }) {
    const problems = [];
    const describe = el => {
        let name = el.tagName.toLowerCase();
        if (el.id) name += `#${el.id}`;
        else if (el.classList.length) name += `.${[...el.classList].join('.')}`;
        const text = (el.innerText || el.value || el.getAttribute('aria-label') || '').trim().replace(/\s+/g, ' ');
        return text ? `${name} « ${text.slice(0, 40)} »` : name;
    };
    const visible = el => el.checkVisibility({ opacityProperty: true, visibilityProperty: true });

    // 1. Débordement horizontal de la page.
    const root = document.documentElement;
    if (root.scrollWidth > root.clientWidth) {
        const clipped = el => {
            for (let p = el.parentElement; p; p = p.parentElement) {
                if (getComputedStyle(p).overflowX !== 'visible') return true;
            }
            return false;
        };
        const culprits = [...document.body.querySelectorAll('*')]
            .filter(el => visible(el) && el.getBoundingClientRect().right > root.clientWidth + 1 && !clipped(el))
            .filter((el, _, all) => !all.includes(el.parentElement))
            .slice(0, 5)
            .map(describe);
        problems.push({ kind: 'débordement', detail: `page large de ${root.scrollWidth}px pour ${root.clientWidth}px visibles`, elements: culprits });
    }

    // 2. Cibles tactiles.
    const interactive = 'a[href], button, input:not([type="hidden"]), select, textarea, summary, [role="button"], [role="link"], [tabindex]:not([tabindex="-1"])';
    // Comme WCAG 2.5.5, un lien placé dans une phrase n'est pas mesuré.
    const inlineLink = el => el.matches('a') && getComputedStyle(el).display === 'inline'
        && [...el.parentElement.childNodes].some(n => n.nodeType === Node.TEXT_NODE && n.textContent.trim());
    for (const el of document.querySelectorAll(interactive)) {
        if (!visible(el) || inlineLink(el)) continue;
        const { width, height } = el.getBoundingClientRect();
        if (width < minTarget || height < minTarget) {
            problems.push({ kind: 'cible', detail: `${Math.round(width)}×${Math.round(height)}px (minimum ${minTarget}×${minTarget})`, elements: [describe(el)] });
        }
    }

    // 3. Contraste du texte sur son fond réel (fonds des ancêtres superposés).
    const parse = color => {
        const m = color.match(/rgba?\(([^)]+)\)/);
        if (!m) return null;
        const [r, g, b, a = 1] = m[1].split(/[\s,/]+/).filter(Boolean).map(Number);
        return { r, g, b, a };
    };
    const over = (top, bottom) => ({
        r: top.r * top.a + bottom.r * (1 - top.a),
        g: top.g * top.a + bottom.g * (1 - top.a),
        b: top.b * top.a + bottom.b * (1 - top.a),
        a: 1,
    });
    const luminance = ({ r, g, b }) => {
        const lin = c => {
            const s = c / 255;
            return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
        };
        return 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
    };
    const backgroundOf = el => {
        const layers = [];
        for (let p = el; p; p = p.parentElement) {
            const style = getComputedStyle(p);
            if (style.backgroundImage !== 'none') return null;
            const bg = parse(style.backgroundColor);
            if (bg && bg.a > 0) layers.push(bg);
            if (bg && bg.a === 1) break;
        }
        return layers.reverse().reduce((acc, layer) => over(layer, acc), { r: 255, g: 255, b: 255, a: 1 });
    };
    for (const el of document.body.querySelectorAll('*')) {
        const ownText = [...el.childNodes].some(n => n.nodeType === Node.TEXT_NODE && n.textContent.trim());
        const field = el.matches('input:not([type="hidden"]), textarea, select') && (el.value || '').trim();
        if ((!ownText && !field) || !visible(el) || el.disabled) continue;
        const style = getComputedStyle(el);
        const bg = backgroundOf(el);
        const label = describe(el);
        if (!bg) {
            problems.push({ kind: 'contraste non mesurable', detail: 'fond en image ou dégradé : à vérifier à l\'œil', elements: [label], warning: true });
            continue;
        }
        const fg = over(parse(style.color), bg);
        const [light, dark] = [luminance(fg), luminance(bg)].sort((a, b) => b - a);
        const ratio = (light + 0.05) / (dark + 0.05);
        const size = parseFloat(style.fontSize);
        const min = size >= largeTextPx ? minContrastLarge : minContrast;
        if (ratio < min) {
            problems.push({ kind: 'contraste', detail: `${ratio.toFixed(2)}:1 (minimum ${min}:1, texte ${size}px)`, elements: [label] });
        }
    }
    return problems;
}

// Mesure une page Playwright déjà chargée, à chaque largeur.
async function measurePage(page, widths = WIDTHS) {
    const results = [];
    for (const width of widths) {
        await page.setViewportSize({ width, height: 800 });
        await page.evaluate(() => new Promise(requestAnimationFrame));
        const problems = await page.evaluate(auditInPage, {
            minTarget: MIN_TARGET,
            minContrast: MIN_CONTRAST,
            minContrastLarge: MIN_CONTRAST_LARGE,
            largeTextPx: LARGE_TEXT_PX,
        });
        results.push({ width, problems });
    }
    return results;
}

const TYPES = { '.html': 'text/html', '.css': 'text/css', '.js': 'text/javascript', '.ico': 'image/x-icon', '.svg': 'image/svg+xml', '.png': 'image/png', '.woff2': 'font/woff2', '.txt': 'text/plain', '.xml': 'application/xml' };

function serve(dir) {
    const server = http.createServer((req, res) => {
        const urlPath = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
        let file = path.join(dir, urlPath);
        if (!file.startsWith(dir)) return res.writeHead(403).end();
        if (fs.existsSync(file) && fs.statSync(file).isDirectory()) file = path.join(file, 'index.html');
        if (!fs.existsSync(file)) return res.writeHead(404).end();
        res.writeHead(200, { 'Content-Type': TYPES[path.extname(file)] || 'application/octet-stream' });
        fs.createReadStream(file).pipe(res);
    });
    return new Promise(resolve => server.listen(0, '127.0.0.1', () => resolve(server)));
}

function findPages(dir, base = dir) {
    return fs.readdirSync(dir, { withFileTypes: true }).flatMap(entry => {
        const full = path.join(dir, entry.name);
        if (entry.isDirectory()) return findPages(full, base);
        return entry.name.endsWith('.html') && !entry.name.startsWith('google') ? [path.relative(base, full).split(path.sep).join('/')] : [];
    });
}

async function main() {
    const dist = path.join(__dirname, 'dist');
    execFileSync(process.execPath, [path.join(__dirname, 'build.js')], { stdio: 'ignore' });
    const requested = process.argv.slice(2);
    const pages = requested.length ? requested : findPages(dist);
    const exempt = new Set(readExemptPages());
    let blockingPages = 0;

    const { chromium } = require('playwright');
    const server = await serve(dist);
    const browser = await chromium.launch();
    const origin = `http://127.0.0.1:${server.address().port}`;
    let failures = 0;
    let reported = 0;
    let warnings = 0;

    try {
        for (const pagePath of pages) {
            const page = await browser.newPage();
            const response = await page.goto(`${origin}/${pagePath}`, { waitUntil: 'networkidle' });
            const blocks = isBlocking(pagePath, { exempt, requested });
            if (blocks) blockingPages++;
            if (!response || !response.ok()) {
                console.log(`✖ ${pagePath} : page introuvable dans dist/ (${response ? response.status() : 'aucune réponse'})`);
                if (blocks) failures++;
                else reported++;
                await page.close();
                continue;
            }
            const results = await measurePage(page);
            await page.close();
            const lines = results.flatMap(({ width, problems }) => problems.map(p => ({ width, ...p })));
            const errors = lines.filter(l => !l.warning);
            if (blocks) failures += errors.length;
            else reported += errors.length;
            warnings += lines.length - errors.length;
            const mark = !errors.length ? '✔' : blocks ? '✖' : '·';
            console.log(`${mark} ${pagePath}${blocks ? '' : ' (exemptée : pas encore refaite)'}`);
            for (const l of lines) {
                const sign = l.warning ? '⚠' : blocks ? '✖' : '·';
                console.log(`    ${sign} ${l.width}px  ${l.kind} : ${l.detail}${l.elements.length ? ` — ${l.elements.join(', ')}` : ''}`);
            }
        }
    } finally {
        await browser.close();
        server.close();
    }

    console.log(`\n${pages.length} page(s) × ${WIDTHS.join(' / ')}px : ${failures} problème(s) bloquant(s) sur ${blockingPages} page(s) contrôlée(s), ${reported} sur ${exempt.size} page(s) exemptée(s), ${warnings} à vérifier à l'œil.`);
    process.exitCode = failures ? 1 : 0;
}

if (require.main === module) {
    main().catch(error => {
        console.error(error);
        process.exitCode = 1;
    });
}

module.exports = { measurePage, WIDTHS, isBlocking, readExemptPages, findPages };
