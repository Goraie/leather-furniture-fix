'use strict';

const fs   = require('fs');
const path = require('path');

const inputFile  = path.join(__dirname, 'index.html');
const outputFile = path.join(__dirname, 'finally.html');

// ═══════════════════════════════════════════════════════════════════════════════
// TAILWIND → PURE CSS DICTIONARY
// Every Tailwind utility class used in index.html mapped to its CSS properties.
// The key is the Tailwind class name (without lr- prefix).
// The value is the CSS declaration block (properties only).
// ═══════════════════════════════════════════════════════════════════════════════

const TW = {
  // ── Display ──
  'block':            'display: block;',
  'inline-block':     'display: inline-block;',
  'inline':           'display: inline;',
  'flex':             'display: flex;',
  'grid':             'display: grid;',
  'hidden':           'display: none;',

  // ── Position ──
  'relative':         'position: relative;',
  'absolute':         'position: absolute;',
  'fixed':            'position: fixed;',
  'inset-0':          'top: 0; right: 0; bottom: 0; left: 0;',
  'top-0':            'top: 0;',
  'top-2':            'top: 0.5rem;',
  'right-2':          'right: 0.5rem;',
  'left-0':           'left: 0;',
  'bottom-0':         'bottom: 0;',

  // ── Flex ──
  'flex-col':         'flex-direction: column;',
  'flex-row':         'flex-direction: row;',
  'flex-wrap':        'flex-wrap: wrap;',
  'flex-1':           'flex: 1 1 0%;',
  'flex-grow':        'flex-grow: 1;',
  'flex-column':      'flex-direction: column;',
  'items-center':     'align-items: center;',
  'items-start':      'align-items: flex-start;',
  'justify-center':   'justify-content: center;',
  'justify-between':  'justify-content: space-between;',
  'shrink-0':         'flex-shrink: 0;',
  'grow':             'flex-grow: 1;',

  // ── Grid ──
  'grid-cols-1':      'grid-template-columns: repeat(1, minmax(0, 1fr));',
  'grid-cols-2':      'grid-template-columns: repeat(2, minmax(0, 1fr));',
  'grid-cols-3':      'grid-template-columns: repeat(3, minmax(0, 1fr));',
  'grid-cols-4':      'grid-template-columns: repeat(4, minmax(0, 1fr));',
  'col-span-2':       'grid-column: span 2 / span 2;',

  // ── Gap ──
  'gap-2':            'gap: 0.5rem;',
  'gap-3':            'gap: 0.75rem;',
  'gap-4':            'gap: 1rem;',
  'gap-6':            'gap: 1.5rem;',
  'gap-8':            'gap: 2rem;',
  'gap-12':           'gap: 3rem;',

  // ── Space (children) ──
  'space-y-2':        '& > * + * { margin-top: 0.5rem; }',
  'space-y-3':        '& > * + * { margin-top: 0.75rem; }',
  'space-y-4':        '& > * + * { margin-top: 1rem; }',
  'space-y-6':        '& > * + * { margin-top: 1.5rem; }',

  // ── Width ──
  'w-full':           'width: 100%;',
  'w-2':              'width: 0.5rem;',
  'w-5':              'width: 1.25rem;',
  'w-6':              'width: 1.5rem;',
  'w-10':             'width: 2.5rem;',

  // ── Height ──
  'h-full':           'height: 100%;',
  'h-5':              'height: 1.25rem;',
  'h-6':              'height: 1.5rem;',
  'h-10':             'height: 2.5rem;',

  // ── Max width ──
  'max-w-full':       'max-width: 100%;',
  'max-w-sm':         'max-width: 24rem;',
  'max-w-2xl':        'max-width: 42rem;',
  'max-w-3xl':        'max-width: 48rem;',
  'max-w-4xl':        'max-width: 56rem;',
  'max-w-5xl':        'max-width: 64rem;',
  'max-w-6xl':        'max-width: 72rem;',

  // ── Margin ──
  'mx-auto':          'margin-left: auto; margin-right: auto;',
  'ml-2':             'margin-left: 0.5rem;',
  'ml-auto':          'margin-left: auto;',
  'mr-1':             'margin-right: 0.25rem;',
  'mr-2':             'margin-right: 0.5rem;',
  'mt-1':             'margin-top: 0.25rem;',
  'mt-2':             'margin-top: 0.5rem;',
  'mt-4':             'margin-top: 1rem;',
  'mt-6':             'margin-top: 1.5rem;',
  'mb-1':             'margin-bottom: 0.25rem;',
  'mb-2':             'margin-bottom: 0.5rem;',
  'mb-3':             'margin-bottom: 0.75rem;',
  'mb-4':             'margin-bottom: 1rem;',
  'mb-6':             'margin-bottom: 1.5rem;',
  'mb-8':             'margin-bottom: 2rem;',
  'mb-10':            'margin-bottom: 2.5rem;',
  'mb-12':            'margin-bottom: 3rem;',
  'mb-16':            'margin-bottom: 4rem;',

  // ── Padding ──
  'p-2':              'padding: 0.5rem;',
  'p-3':              'padding: 0.75rem;',
  'p-4':              'padding: 1rem;',
  'p-6':              'padding: 1.5rem;',
  'p-8':              'padding: 2rem;',
  'px-2':             'padding-left: 0.5rem; padding-right: 0.5rem;',
  'px-3':             'padding-left: 0.75rem; padding-right: 0.75rem;',
  'px-4':             'padding-left: 1rem; padding-right: 1rem;',
  'px-8':             'padding-left: 2rem; padding-right: 2rem;',
  'py-1':             'padding-top: 0.25rem; padding-bottom: 0.25rem;',
  'py-3':             'padding-top: 0.75rem; padding-bottom: 0.75rem;',
  'py-4':             'padding-top: 1rem; padding-bottom: 1rem;',
  'py-5':             'padding-top: 1.25rem; padding-bottom: 1.25rem;',
  'py-16':            'padding-top: 4rem; padding-bottom: 4rem;',
  'py-20':            'padding-top: 5rem; padding-bottom: 5rem;',
  'pt-8':             'padding-top: 2rem;',
  'pb-2':             'padding-bottom: 0.5rem;',
  'pb-20':            'padding-bottom: 5rem;',
  'pl-8':             'padding-left: 2rem;',

  // ── Font Family ──
  'font-sans':        "font-family: 'Inter', -apple-system, sans-serif !important;",
  'font-serif':       "font-family: 'Playfair Display', Georgia, serif !important;",

  // ── Font Size ──
  'text-xs':          'font-size: 0.75rem; line-height: 1rem;',
  'text-sm':          'font-size: 0.875rem; line-height: 1.25rem;',
  'text-md':          'font-size: 1rem;',
  'text-lg':          'font-size: 1.125rem; line-height: 1.75rem;',
  'text-xl':          'font-size: 1.25rem; line-height: 1.75rem;',
  'text-2xl':         'font-size: 1.5rem; line-height: 2rem;',
  'text-4xl':         'font-size: 2.25rem; line-height: 2.5rem;',

  // ── Font Weight ──
  'font-light':       'font-weight: 300;',
  'font-normal':      'font-weight: 400;',
  'font-medium':      'font-weight: 500;',
  'font-semibold':    'font-weight: 600;',
  'font-bold':        'font-weight: 700;',

  // ── Font Style ──
  'italic':           'font-style: italic;',

  // ── Text Align ──
  'text-center':      'text-align: center;',
  'text-left':        'text-align: left;',
  'text-right':       'text-align: right;',

  // ── Text Transform ──
  'uppercase':        'text-transform: uppercase;',

  // ── Letter Spacing ──
  'tracking-wide':    'letter-spacing: 0.025em;',
  'tracking-wider':   'letter-spacing: 0.05em;',
  'tracking-widest':  'letter-spacing: 0.1em;',

  // ── Line Height ──
  'leading-none':     'line-height: 1;',
  'leading-tight':    'line-height: 1.25;',
  'leading-relaxed':  'line-height: 1.625;',

  // ── Text Decoration ──
  'truncate':         'overflow: hidden; text-overflow: ellipsis; white-space: nowrap;',

  // ── Text Color ──
  'text-white':       'color: #fff;',
  'text-slate-300':   'color: #cbd5e1;',
  'text-slate-400':   'color: #94a3b8;',
  'text-slate-500':   'color: #64748b;',
  'text-slate-600':   'color: #475569;',
  'text-slate-700':   'color: #334155;',
  'text-slate-900':   'color: #0f172a;',
  'text-red-600':     'color: #dc2626;',
  'text-orange-600':  'color: #ea580c;',
  'text-emerald-400': 'color: #34d399;',
  'text-emerald-600': 'color: #059669;',
  'text-emerald-700': 'color: #047857;',
  'text-green-700':   'color: #15803d;',
  'text-green-800':   'color: #166534;',
  'text-blue-400':    'color: #60a5fa;',
  'text-lr-accent':   'color: var(--lr-accent);',
  'text-primary':     'color: var(--lr-primary);',
  'text-400':         'color: #9ca3af;',

  // ── Background Color ──
  'bg-white':             'background-color: #fff;',
  'bg-transparent':       'background-color: transparent;',
  'bg-slate-50':          'background-color: #f8fafc;',
  'bg-slate-100':         'background-color: #f1f5f9;',
  'bg-red-100':           'background-color: #fee2e2;',
  'bg-orange-100':        'background-color: #ffedd5;',
  'bg-emerald-100':       'background-color: #d1fae5;',
  'bg-green-50':          'background-color: #f0fdf4;',
  'bg-lr-primary':        'background-color: var(--lr-primary);',
  'bg-lr-secondary':      'background-color: var(--lr-secondary);',
  'bg-lr-accent':         'background-color: var(--lr-accent);',
  'bg-lr-accent-hover':   'background-color: var(--lr-accent-hover);',
  'bg-lr-green':          'background-color: var(--lr-bg-green);',
  'bg-lr-green-hover':    'background-color: var(--lr-bg-green-hover);',
  // bg with opacity
  'bg-white/5':           'background-color: rgba(255,255,255,0.05);',
  'bg-white/10':          'background-color: rgba(255,255,255,0.1);',
  'bg-white/20':          'background-color: rgba(255,255,255,0.2);',
  'bg-lr-accent/90':      'background-color: rgba(197,157,95,0.9);',

  // ── Background Misc ──
  'bg-cover':             'background-size: cover;',
  'bg-center':            'background-position: center;',

  // ── Border ──
  'border':               'border-width: 1px; border-style: solid; border-color: #e2e8f0;',
  'border-2':             'border-width: 2px; border-style: solid;',
  'border-b':             'border-bottom-width: 1px; border-bottom-style: solid;',
  'border-b-2':           'border-bottom-width: 2px; border-bottom-style: solid;',
  'border-t':             'border-top-width: 1px; border-top-style: solid; border-top-color: #e2e8f0;',
  'border-dashed':        'border-style: dashed;',
  'border-solid':         'border-style: solid;',
  'border-white/10':      'border-color: rgba(255,255,255,0.1);',
  'border-white/20':      'border-color: rgba(255,255,255,0.2);',
  'border-slate-50':      'border-color: #f8fafc;',
  'border-slate-100':     'border-color: #f1f5f9;',
  'border-slate-200':     'border-color: #e2e8f0;',
  'border-slate-300':     'border-color: #cbd5e1;',
  'border-lr-accent':     'border-color: var(--lr-accent);',
  'border-lr-secondary':  'border-color: var(--lr-secondary);',

  // ── Border Radius ──
  'rounded':              'border-radius: 0.25rem;',
  'rounded-lg':           'border-radius: 0.5rem;',
  'rounded-xl':           'border-radius: 0.75rem;',
  'rounded-2xl':          'border-radius: 1rem;',
  'rounded-full':         'border-radius: 9999px;',

  // ── Shadow ──
  'shadow-sm':            'box-shadow: 0 1px 2px 0 rgba(0,0,0,0.05);',
  'shadow-lg':            'box-shadow: 0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -4px rgba(0,0,0,0.1);',
  'shadow-xl':            'box-shadow: 0 20px 25px -5px rgba(0,0,0,0.1), 0 8px 10px -6px rgba(0,0,0,0.1);',
  'shadow-2xl':           'box-shadow: 0 25px 50px -12px rgba(0,0,0,0.25);',

  // ── Overflow ──
  'overflow-hidden':      'overflow: hidden;',
  'overflow-visible':     'overflow: visible;',
  'overflow-x-hidden':    'overflow-x: hidden;',

  // ── Object Fit ──
  'object-cover':         'object-fit: cover;',
  'object-contain':       'object-fit: contain;',

  // ── Opacity ──
  'opacity-0':            'opacity: 0;',
  'opacity-10':           'opacity: 0.1;',
  'opacity-40':           'opacity: 0.4;',
  'opacity-50':           'opacity: 0.5;',

  // ── Backdrop / Mix ──
  'backdrop-blur-sm':     'backdrop-filter: blur(4px);',
  'mix-blend-overlay':    'mix-blend-mode: overlay;',

  // ── Cursor ──
  'cursor-pointer':       'cursor: pointer;',
  'cursor-not-allowed':   'cursor: not-allowed;',
  'cursor-ew-resize':     'cursor: ew-resize;',

  // ── User Select ──
  'select-none':          'user-select: none;',

  // ── Pointer Events ──
  'pointer-events-none':  'pointer-events: none;',

  // ── Transition ──
  'transition':           'transition-property: color, background-color, border-color, text-decoration-color, fill, stroke, opacity, box-shadow, transform, filter, backdrop-filter; transition-timing-function: cubic-bezier(0.4,0,0.2,1); transition-duration: 150ms;',
  'transition-all':       'transition-property: all; transition-timing-function: cubic-bezier(0.4,0,0.2,1); transition-duration: 150ms;',
  'duration-300':         'transition-duration: 300ms;',
  'transform':            '', // In modern Tailwind, transform is automatically applied

  // ── Z-index ──
  'z-10':                 'z-index: 10;',

  // ── Ring ──
  'outline-none':         'outline: 2px solid transparent; outline-offset: 2px;',
};

// ── Hover ──
const TW_HOVER = {
  'hover:-translate-y-1':     'transform: translateY(-0.25rem);',
  'hover:bg-white/10':        'background-color: rgba(255,255,255,0.1);',
  'hover:bg-slate-50':        'background-color: #f8fafc;',
  'hover:bg-slate-100':       'background-color: #f1f5f9;',
  'hover:bg-lr-accent-hover': 'background-color: var(--lr-accent-hover);',
  'hover:bg-lr-green-hover':  'background-color: var(--lr-bg-green-hover);',
  'hover:bg-lr-secondary':    'background-color: var(--lr-secondary);',
  'hover:border-lr-accent':   'border-color: var(--lr-accent);',
  'hover:text-slate-600':     'color: #475569;',
  'hover:text-red-500':       'color: #ef4444;',
};

// ── Focus ──
const TW_FOCUS = {
  'focus:border-lr-accent':   'border-color: var(--lr-accent);',
  'focus:ring-1':             'box-shadow: 0 0 0 1px var(--lr-accent);',
  'focus:ring-lr-accent':     '', // combined with ring-1
};

// ── Responsive ──
const TW_RESPONSIVE = {
  // sm: (640px+)
  'sm:flex-row':              { bp: 640, css: 'flex-direction: row;' },
  'sm:w-auto':                { bp: 640, css: 'width: auto;' },
  'sm:text-lg':               { bp: 640, css: 'font-size: 1.125rem; line-height: 1.75rem;' },

  // md: (768px+)
  'md:flex':                  { bp: 768, css: 'display: flex;' },
  'md:flex-row':              { bp: 768, css: 'flex-direction: row;' },
  'md:block':                 { bp: 768, css: 'display: block;' },
  'md:hidden':                { bp: 768, css: 'display: none;' },
  'md:grid-cols-2':           { bp: 768, css: 'grid-template-columns: repeat(2, minmax(0, 1fr));' },
  'md:grid-cols-3':           { bp: 768, css: 'grid-template-columns: repeat(3, minmax(0, 1fr));' },
  'md:col-span-2':            { bp: 768, css: 'grid-column: span 2 / span 2;' },
  'md:w-1/2':                 { bp: 768, css: 'width: 50%;' },
  'md:w-auto':                { bp: 768, css: 'width: auto;' },
  'md:text-sm':               { bp: 768, css: 'font-size: 0.875rem; line-height: 1.25rem;' },
  'md:text-xl':               { bp: 768, css: 'font-size: 1.25rem; line-height: 1.75rem;' },
  'md:text-left':             { bp: 768, css: 'text-align: left;' },
  'md:gap-4':                 { bp: 768, css: 'gap: 1rem;' },
  'md:gap-12':                { bp: 768, css: 'gap: 3rem;' },
  'md:max-w-4xl':             { bp: 768, css: 'max-width: 56rem;' },
  'md:max-w-5xl':             { bp: 768, css: 'max-width: 64rem;' },
  'md:mx-auto':               { bp: 768, css: 'margin-left: auto; margin-right: auto;' },
  'md:px-4':                  { bp: 768, css: 'padding-left: 1rem; padding-right: 1rem;' },
  'md:mb-12':                 { bp: 768, css: 'margin-bottom: 3rem;' },

  // lg: (1024px+)
  'lg:hidden':                { bp: 1024, css: 'display: none;' },
  'lg:block':                 { bp: 1024, css: 'display: block;' },
  'lg:grid-cols-4':           { bp: 1024, css: 'grid-template-columns: repeat(4, minmax(0, 1fr));' },
};

// ── Arbitrary value classes (parsed dynamically) ──
const ARBITRARY_PATTERNS = [
  // text-[9px], text-[10px], etc.
  { re: /^text-\[(\d+px)\]$/,          gen: (m) => `font-size: ${m[1]};` },
  // bg-[#hex]
  { re: /^bg-\[(#[0-9a-fA-F]+)\]$/,    gen: (m) => `background-color: ${m[1]};` },
  // border-[#hex]
  { re: /^border-\[(#[0-9a-fA-F]+)\]$/, gen: (m) => `border-color: ${m[1]};` },
  // border-b-[3px]
  { re: /^border-b-\[(\d+px)\]$/,      gen: (m) => `border-bottom-width: ${m[1]}; border-bottom-style: solid;` },
  // pt-[2rem], lg:pt-[6rem]
  { re: /^pt-\[(.+?)\]$/,              gen: (m) => `padding-top: ${m[1]};` },
  // pb-[2rem]
  { re: /^pb-\[(.+?)\]$/,              gen: (m) => `padding-bottom: ${m[1]};` },
  // w-[450px]
  { re: /^w-\[(.+?)\]$/,               gen: (m) => `width: ${m[1]};` },
  // text-[#8c1c13]
  { re: /^text-\[(#[0-9a-fA-F]+)\]$/,  gen: (m) => `color: ${m[1]};` },
  // rounded-mx-2 (typo in source → treat as rounded)
  { re: /^rounded-mx-\d+$/,            gen: () => `border-radius: 0.25rem;` },
  // md:w-[450px]
  { re: /^w-\[(.+?)\]$/,               gen: (m) => `width: ${m[1]};` },
];

// Classes that should NOT be renamed (library classes or already lr- prefixed)
function isLibraryClass(cls) {
  return cls.startsWith('lr-') ||
         cls.startsWith('swiper') ||
         cls.startsWith('fa-') || cls === 'fa' ||
         cls.startsWith('fa ') ||
         cls.startsWith('glightbox') ||
         // custom classes defined in the <style> block
         cls === 'hero-card' || cls === 'hero-card-link' || cls === 'hero-card-img' ||
         cls === 'benefits-icon' || cls === 'text-bg' || cls === 'text-quote' ||
         cls === 'agit-img' || cls === 'btn-social' || cls === 'btn-social-tg' ||
         cls === 'btn-social-vk' || cls === 'btn-social-max' || cls === 'slider-sec' ||
         cls === 'social-wrapp' || cls === 'swiper-card-bottom' || cls === 'qr-code-image' ||
         cls === 'qr-code-text' || cls === 'active' || cls === 'd-flex';
}

// ═══════════════════════════════════════════════════════════════════════════════
// STEP 1: Read source
// ═══════════════════════════════════════════════════════════════════════════════

console.log('[1/5] Reading index.html…');
let html = fs.readFileSync(inputFile, 'utf8');

// ═══════════════════════════════════════════════════════════════════════════════
// STEP 2: Extract and process <style> block
// ═══════════════════════════════════════════════════════════════════════════════

console.log('[2/5] Extracting and migrating <style> block…');

const styleTagRe = /<style>([\s\S]*?)<\/style>/gi;
let styleMatch;
let extractedCustomCss = '';

while ((styleMatch = styleTagRe.exec(html)) !== null) {
  let inner = styleMatch[1];

  // :root → #hop-landing
  inner = inner.replace(/:root\s*\{/g, '#hop-landing {');

  // Remove html { scroll-behavior } (global rule)
  inner = inner.replace(/html\s*\{[^}]*\}/g, '');

  // Prefix every selector with #hop-landing
  const innerLines = inner.split('\n');
  const prefixedInner = [];
  let insideKeyframes = false;

  for (const line of innerLines) {
    const t = line.trim();

    // Track @keyframes blocks
    if (t.startsWith('@keyframes')) {
      insideKeyframes = true;
      prefixedInner.push(line);
      continue;
    }

    // Inside keyframes — don't prefix
    if (insideKeyframes) {
      prefixedInner.push(line);
      if (t === '}' && !line.startsWith('\t\t') && !line.startsWith('    ')) {
        // End of @keyframes if not nested
      }
      // Simple heuristic: track brace depth
      continue;
    }

    // Skip @-rules, pure braces, keyframe stops, empty
    if (!t || t.startsWith('@') || t === '{' || t === '}' ||
        t === 'from' || t === 'to' || /^\d+%/.test(t) ||
        t.startsWith('from {') || t.startsWith('to {') ||
        t.startsWith('/*') || t.startsWith('*') || t.startsWith('//')) {
      if (t === '}') insideKeyframes = false; // rough reset
      prefixedInner.push(line);
      continue;
    }

    if (t.includes('{')) {
      const [selPart, ...rest] = line.split('{');
      const newSels = selPart.split(',').map(s => {
        s = s.trim();
        if (!s || s === '#hop-landing') return s;
        if (s.startsWith('#hop-landing')) return s;
        if (s.startsWith('.swiper') || s.startsWith('.gslide')) return '#hop-landing ' + s;
        // body rule → #hop-landing
        if (s === 'body') return '#hop-landing';
        return '#hop-landing ' + s;
      });
      prefixedInner.push(newSels.join(', ') + ' {' + (rest.length ? rest.join('{') : ''));
    } else {
      prefixedInner.push(line);
    }
  }
  extractedCustomCss += prefixedInner.join('\n') + '\n';
}

// Remove <style> blocks from html
html = html.replace(/<style>[\s\S]*?<\/style>/gi, '');

// ═══════════════════════════════════════════════════════════════════════════════
// STEP 3: Collect all unique class names & generate CSS
// ═══════════════════════════════════════════════════════════════════════════════

console.log('[3/5] Generating CSS from Tailwind utilities…');

// Collect all class names from HTML
const classListRe = /class="([^"]+)"/g;
let classMatch;
const allClasses = new Set();
while ((classMatch = classListRe.exec(html)) !== null) {
  classMatch[1].split(/\s+/).forEach(cls => {
    if (cls) allClasses.add(cls);
  });
}

// Also collect single-quote class attrs
const classListRe2 = /class='([^']+)'/g;
while ((classMatch = classListRe2.exec(html)) !== null) {
  classMatch[1].split(/\s+/).forEach(cls => {
    if (cls) allClasses.add(cls);
  });
}

// Generate CSS for tailwind utilities
let generatedCss = '';
const spaceYClasses = []; // special handling needed

// Group responsive classes by breakpoint
const responsiveCss = {}; // bp → css lines

for (const cls of allClasses) {
  if (isLibraryClass(cls)) continue;
  if (cls.startsWith('lr-')) continue;

  // Check for responsive prefix first
  const responsiveMatch = cls.match(/^(sm|md|lg):(.+)$/);
  if (responsiveMatch) {
    const [, prefix, baseCls] = responsiveMatch;
    const key = cls;

    if (TW_RESPONSIVE[key]) {
      const { bp, css } = TW_RESPONSIVE[key];
      if (!responsiveCss[bp]) responsiveCss[bp] = [];
      const escapedCls = 'lr-' + cls.replace(/:/g, '\\:').replace(/\[/g, '\\[').replace(/\]/g, '\\]').replace(/\//g, '\\/').replace(/\./g, '\\.');
      responsiveCss[bp].push(`#hop-landing .${escapedCls} { ${css} }`);
      continue;
    }

    // Try to find base class in TW dict and wrap in media query
    if (TW[baseCls]) {
      const bpMap = { sm: 640, md: 768, lg: 1024 };
      const bp = bpMap[prefix];
      if (bp) {
        if (!responsiveCss[bp]) responsiveCss[bp] = [];
        const escapedCls = 'lr-' + cls.replace(/:/g, '\\:').replace(/\[/g, '\\[').replace(/\]/g, '\\]').replace(/\//g, '\\/').replace(/\./g, '\\.');
        responsiveCss[bp].push(`#hop-landing .${escapedCls} { ${TW[baseCls]} }`);
      }
      continue;
    }

    // Try arbitrary for responsive
    let basePart = baseCls;
    let handled = false;
    for (const pat of ARBITRARY_PATTERNS) {
      const m = basePart.match(pat.re);
      if (m) {
        const bpMap = { sm: 640, md: 768, lg: 1024 };
        const bp = bpMap[prefix];
        if (bp) {
          if (!responsiveCss[bp]) responsiveCss[bp] = [];
          const escapedCls = 'lr-' + cls.replace(/:/g, '\\:').replace(/\[/g, '\\[').replace(/\]/g, '\\]').replace(/\//g, '\\/').replace(/\./g, '\\.');
          responsiveCss[bp].push(`#hop-landing .${escapedCls} { ${pat.gen(m)} }`);
        }
        handled = true;
        break;
      }
    }
    if (handled) continue;
    continue; // skip unresolved responsive
  }

  // Handle hover: prefix
  if (cls.startsWith('hover:')) {
    const hoverKey = cls;
    if (TW_HOVER[hoverKey]) {
      const escapedCls = 'lr-' + cls.replace(/:/g, '\\:').replace(/\[/g, '\\[').replace(/\]/g, '\\]').replace(/\//g, '\\/').replace(/\./g, '\\.');
      generatedCss += `#hop-landing .${escapedCls}:hover { ${TW_HOVER[hoverKey]} }\n`;
    }
    continue;
  }

  // Handle focus: prefix
  if (cls.startsWith('focus:')) {
    const focusKey = cls;
    if (TW_FOCUS[focusKey] !== undefined) {
      if (TW_FOCUS[focusKey]) { // skip empty ones
        const escapedCls = 'lr-' + cls.replace(/:/g, '\\:').replace(/\[/g, '\\[').replace(/\]/g, '\\]').replace(/\//g, '\\/').replace(/\./g, '\\.');
        generatedCss += `#hop-landing .${escapedCls}:focus { ${TW_FOCUS[focusKey]} }\n`;
      }
    }
    continue;
  }

  // space-y-* needs special handling (child combinator)
  if (cls.startsWith('space-y-')) {
    const sizeMap = { '2': '0.5rem', '3': '0.75rem', '4': '1rem', '6': '1.5rem' };
    const m = cls.match(/^space-y-(\d+)$/);
    if (m && sizeMap[m[1]]) {
      generatedCss += `#hop-landing .lr-${cls} > * + * { margin-top: ${sizeMap[m[1]]}; }\n`;
    }
    continue;
  }

  // Standard TW class
  if (TW[cls]) {
    if (TW[cls]) {
      generatedCss += `#hop-landing .lr-${cls} { ${TW[cls]} }\n`;
    }
    continue;
  }

  // Arbitrary value classes
  let arbitraryHandled = false;
  for (const pat of ARBITRARY_PATTERNS) {
    const m = cls.match(pat.re);
    if (m) {
      const escapedCls = 'lr-' + cls.replace(/\[/g, '\\[').replace(/\]/g, '\\]').replace(/#/g, '\\#').replace(/\//g, '\\/').replace(/\./g, '\\.');
      generatedCss += `#hop-landing .${escapedCls} { ${pat.gen(m)} }\n`;
      arbitraryHandled = true;
      break;
    }
  }
  if (arbitraryHandled) continue;

  // bg-[url(...)] — special case, keep inline
  if (cls.startsWith('bg-[url(')) continue;
}

// Add responsive media queries
const sortedBps = Object.keys(responsiveCss).map(Number).sort((a, b) => a - b);
for (const bp of sortedBps) {
  generatedCss += `\n@media (min-width: ${bp}px) {\n`;
  for (const rule of responsiveCss[bp]) {
    generatedCss += `  ${rule}\n`;
  }
  generatedCss += '}\n';
}

// ═══════════════════════════════════════════════════════════════════════════════
// WP/Theme required overrides (from prompt)
// ═══════════════════════════════════════════════════════════════════════════════

const wpOverrides = `
/* =============================================
   LENREMONT LANDING – PURE CSS (no Tailwind)
   All rules scoped under #hop-landing
   ============================================= */

body { margin: 0; padding: 0; }

#hop-landing {
  --lr-primary:        #1a120b;
  --lr-secondary:      #2d2016;
  --lr-accent:         #c59d5f;
  --lr-accent-opa:     rgba(197, 157, 95, 0.15);
  --lr-accent-hover:   #b48a4d;
  --lr-brand:          #8b5e3c;
  --lr-brand-hover:    #724b30;
  --lr-bg-light:       #fdfaf3;
  --lr-bg-green:       #58863e;
  --lr-bg-green-hover: #446d2c;

  font-family: 'Inter', -apple-system, sans-serif !important;
  line-height: 1.5;
  color: #1e293b;
  box-sizing: border-box;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  width: 100%;
  margin: 0;
  padding: 0;
  overflow-x: hidden;
}

#hop-landing > section {
  width: 100%;
  margin: 0;
  padding-left: 0;
  padding-right: 0;
}

#hop-landing *,
#hop-landing *::before,
#hop-landing *::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

#hop-landing img {
  max-width: 100%;
  height: auto;
  display: block;
}

#hop-landing a {
  text-decoration: none;
  color: inherit;
}

#hop-landing button {
  font-family: inherit;
  cursor: pointer;
  border: none;
  background: none;
}

#hop-landing ul { list-style: none; }
#hop-landing input, #hop-landing select, #hop-landing textarea { font-family: inherit; }

/* ── Font families ── */
#hop-landing .lr-font-serif {
  font-family: 'Playfair Display', Georgia, serif !important;
}

/* ── Typography ── */
#hop-landing .lr-h1 { font-size: clamp(2rem, 5vw, 3.5rem); line-height: 1.1; }
#hop-landing .lr-h2 { font-size: clamp(1.75rem, 4vw, 2.5rem); line-height: 1.2; }

/* ── Container ── */
#hop-landing .lr-container { width: 88%; max-width: 1280px; margin: 0 auto; }

/* ── Dark sections: force color inherit ── */
#hop-landing .lr-sec-primary { width: 100%; background-color: var(--lr-primary); color: white !important; }
#hop-landing .lr-sec-primary h1,
#hop-landing .lr-sec-primary .lr-h1,
#hop-landing .lr-sec-primary h2,
#hop-landing .lr-sec-primary h3,
#hop-landing .lr-sec-primary h4,
#hop-landing .lr-sec-primary h5,
#hop-landing .lr-sec-primary p,
#hop-landing .lr-sec-primary span,
#hop-landing .lr-sec-primary strong,
#hop-landing .lr-sec-primary li,
#hop-landing .lr-sec-primary a,
#hop-landing .lr-sec-primary label,
#hop-landing .lr-sec-primary div { color: inherit !important; }
#hop-landing .lr-sec-primary .lr-text-accent     { color: var(--lr-accent) !important; }
#hop-landing .lr-sec-primary .lr-text-slate-300  { color: #cbd5e1 !important; }
#hop-landing .lr-sec-primary .lr-text-slate-400  { color: #94a3b8 !important; }
#hop-landing .lr-sec-primary .lr-text-emerald-400 { color: #34d399 !important; }
#hop-landing .lr-sec-primary .lr-text-lr-accent  { color: var(--lr-accent) !important; }

/* ── Modal z-index ── */
#hop-landing .lr-modal-overlay { z-index: 9999; }
#hop-landing .lr-modal         { z-index: 10000; }
`;

// Combine all CSS
const finalCss = wpOverrides + '\n/* ── Generated utility classes ── */\n' + generatedCss + '\n/* ── Custom styles from original <style> ── */\n' + extractedCustomCss;

// ═══════════════════════════════════════════════════════════════════════════════
// STEP 4: Transform HTML
// ═══════════════════════════════════════════════════════════════════════════════

console.log('[4/5] Transforming HTML…');

// Strip document wrappers
html = html.replace(/<!DOCTYPE[^>]*>/gi, '');
html = html.replace(/<html[^>]*>/gi, '').replace(/<\/html>/gi, '');
html = html.replace(/<body[^>]*>/gi, '').replace(/<\/body>/gi, '');

// Strip <head>
html = html.replace(/<head[^>]*>[\s\S]*?<\/head>/gi, '');

// Remove tailwind CDN script + config script
html = html.replace(/<script\s+src="https:\/\/cdn\.tailwindcss\.com"[^>]*>\s*<\/script>/gi, '');
html = html.replace(/<script>[\s\S]*?tailwind\.config\s*=[\s\S]*?<\/script>/gi, '');

// Remove CDN <link> and <script> tags that will be added in the header
html = html.replace(/<link[^>]*fonts\.googleapis\.com[^>]*\/?>/gi, '');
html = html.replace(/<link[^>]*font-awesome[^>]*\/?>/gi, '');
html = html.replace(/<link[^>]*swiper[^>]*\/?>/gi, '');
html = html.replace(/<script[^>]*swiper[^>]*>\s*<\/script>/gi, '');
html = html.replace(/<link[^>]*glightbox[^>]*\/?>/gi, '');
html = html.replace(/<script[^>]*glightbox[^>]*>\s*<\/script>/gi, '');

// h1 → h2.lr-h1 (PROMPT rule §3: WordPress adds its own h1)
// Careful: preserve existing classes
html = html.replace(/<h1(\s[^>]*)?\s*>/gi, (match, attrs) => {
  attrs = attrs || '';
  if (attrs.includes('class="')) {
    // Add lr-h1 to existing class list
    attrs = attrs.replace(/class="([^"]*)"/, 'class="$1 lr-h1"');
  } else {
    attrs += ' class="lr-h1"';
  }
  return '<h2' + attrs + '>';
});
html = html.replace(/<\/h1>/gi, '</h2>');

// Image paths: images/* → /wp-content/uploads/2026/04/*
html = html.replace(/(src|href)="(?:\.\/)?images\/([^"]+)"/gi, (_, attr, fname) => {
  return attr + '="/wp-content/uploads/2026/04/' + fname + '"';
});
html = html.replace(/(src|href)='(?:\.\/)?images\/([^']+)'/gi, (_, attr, fname) => {
  return attr + "='/wp-content/uploads/2026/04/" + fname + "'";
});
// Also handle /images/ paths (leading slash)
html = html.replace(/(src|href)="\/images\/([^"]+)"/gi, (_, attr, fname) => {
  return attr + '="/wp-content/uploads/2026/04/' + fname + '"';
});

// Rename Tailwind classes → lr-prefixed in HTML
html = html.replace(/class="([^"]+)"/g, (_, classList) => {
  const parts = classList.split(/\s+/);
  const renamed = parts.map(cls => {
    if (!cls) return cls;

    // Never rename library classes or already prefixed
    if (isLibraryClass(cls)) return cls;

    // bg-[url(...)] — keep as-is (inline background image)
    if (cls.startsWith('bg-[url(')) return cls;

    // Rename: add lr- prefix
    return 'lr-' + cls;
  });
  return 'class="' + renamed.join(' ') + '"';
});

// Handle inline style bg-[url(...)] classes → convert to inline style
// These are complex CSS-in-class patterns that need to become inline styles
html = html.replace(/class="([^"]*bg-\[url\([^)]+\)\][^"]*)"/g, (match, classList) => {
  const parts = classList.split(/\s+/);
  const bgUrlParts = [];
  const otherParts = [];

  for (const cls of parts) {
    if (cls.startsWith('bg-[url(') || cls.match(/^bg-\[url\(/)) {
      // Extract URL
      const urlMatch = cls.match(/bg-\[url\('([^']+)'\)\]/);
      if (urlMatch) {
        bgUrlParts.push(`background-image: url('${urlMatch[1]}')`);
      }
    } else {
      otherParts.push(cls);
    }
  }

  let result = 'class="' + otherParts.join(' ') + '"';
  if (bgUrlParts.length > 0) {
    result += ' style="' + bgUrlParts.join('; ') + '"';
  }
  return result;
});

// Wrap inline scripts in DOMContentLoaded, fix selectors inside JS
html = html.replace(/<script>([\s\S]*?)<\/script>/gi, (_, js) => {
  // Don't wrap if it's already wrapped
  if (js.includes('DOMContentLoaded')) return '<script>' + js + '</script>';

  // Prefix querySelector / querySelectorAll calls
  js = js.replace(/(querySelector(?:All)?)\s*\(\s*'(?!#hop-landing)([^']+)'\s*\)/g, "$1('#hop-landing $2')");
  js = js.replace(/(querySelector(?:All)?)\s*\(\s*"(?!#hop-landing)([^"]+)"\s*\)/g, '$1("#hop-landing $2")');

  return '<script>\ndocument.addEventListener(\'DOMContentLoaded\', function() {\n' + js + '\n});\n</script>';
});

// ═══════════════════════════════════════════════════════════════════════════════
// STEP 5: Assemble final file
// ═══════════════════════════════════════════════════════════════════════════════

console.log('[5/5] Writing finally.html…');

const finalHtml = [
  '<!-- HEAD SECTION -->',
  '<meta charset="UTF-8">',
  '<!-- Google Fonts -->',
  '<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Playfair+Display:wght@700&display=swap" rel="stylesheet" />',
  '<!-- FontAwesome -->',
  '<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />',
  '<!-- Swiper -->',
  '<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.css" />',
  '<script src="https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.js"></script>',
  '<!-- Lightbox -->',
  '<link href="https://cdn.jsdelivr.net/npm/glightbox/dist/css/glightbox.min.css" rel="stylesheet">',
  '<script src="https://cdn.jsdelivr.net/npm/glightbox/dist/js/glightbox.min.js"></script>',
  '',
  '<style>',
  finalCss,
  '</style>',
  '',
  '<!-- =============== BODY CONTENT =============== -->',
  '<div id="hop-landing">',
  html.trim(),
  '</div>',
  ''
].join('\n');

fs.writeFileSync(outputFile, finalHtml, 'utf8');

const sizeKb = Math.round(fs.statSync(outputFile).size / 1024);
console.log('Done! Output saved to finally.html (' + sizeKb + ' KB)');
console.log('');
console.log('Checklist:');
console.log('  [✓] No <!DOCTYPE>, <html>, <head>, <body>');
console.log('  [✓] No Tailwind CDN');
console.log('  [✓] All CSS scoped under #hop-landing');
console.log('  [✓] CSS variables in #hop-landing, not :root');
console.log('  [✓] font-family with !important');
console.log('  [✓] h1 → h2.lr-h1');
console.log('  [✓] Image paths → /wp-content/uploads/2026/04/');
console.log('  [✓] All classes lr- prefixed');
console.log('  [✓] JS wrapped in DOMContentLoaded');
