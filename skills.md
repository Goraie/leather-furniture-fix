---
name: Lenremont HTML Standards
description: Core rules for creating responsive HTML blocks for lenremont.ru landing pages, detailing mobile width percentages, column ordering, and class namings.
---

# Lenremont HTML Guidelines

Use this skill whenever generating HTML blocks, landing modules, or Raw HTML snippets for `lenremont.ru`.

## 1. Container and Mobile Widths
- The main desktop container must have a `max-width` (e.g., `1200px` or `1280px`) and be centered with `margin: 0 auto;`.
- **CRITICAL CONTAINER RULE**: The working container width must dynamically become **88%** (to perfectly mirror the native `.x-container.width` from the client's WordPress theme). Do NOT stretch content to 100vw or 100% width on responsive screens without these padding metrics.
  - Example CSS structure to use (matching `.x-container.max` and `.x-container.width`):
    ```css
    .lr-container { width: 88%; max-width: 1280px; margin: 0 auto; }
    ```

## 2. Adaptive Row Layouts (Mobile Reordering)
- When building a standard 2-column block (e.g., Text on Left, Image on Right), ALWAYS use CSS Grid or Flexbox.
- **CRITICAL MOBILE REORDERING**: If an image is located on the right side on desktop, the layout must stack vertically on mobile screens so that the **image appears first (on top)**, followed by the text below it.
  - Do not let the text bury the image. Users process visual context faster on mobile; visual anchors must lead.
  - Example Implementation using CSS Grid order or Flexbox:
    ```css
    .lr-2col { display: flex; flex-direction: row; gap: 30px; }
    .lr-text-left { order: 1; }
    .lr-img-right { order: 2; }

    @media (max-width: 768px) {
        .lr-2col { flex-direction: column; }
        .lr-img-right { order: -1; margin-bottom: 20px; } /* forces image to top! */
        .lr-text-left { order: 1; }
    }
    ```

## 3. General Styling Constants
- **Prefixes**: Always prefix classes with `lr-` (e.g., `.lr-btn`, `.lr-section`, `.lr-hero`) to avoid conflicts with global themes like WordPress Cornerstone.
- **Typography**: Employ fluid typography using `clamp()` to seamlessly shrink massive headings on small screens, preventing word breaks.
- **Background Transitions**: When using `100vw` backgrounds, ensure smooth gradients into base body colors (`linear-gradient`, `mask-image`) to prevent sharp horizontal cutoffs.

## 4. Automation & REST API Deployment
When the user asks to push or update the HTML code directly on the website, leverage the custom `htmlonpage.php` REST API.
- **Base Endpoint**: `https://www.lenremont.ru/wp-json/htmlonpage/v1/update-code/[PAGE_ID]`
- **Required Token**: `SZKaEFGhb8I4YIfyVD307al3Z2WSDewZ` (Pass via `X-HtmlOnPage-Token` header)
- **CRITICAL WAF BYPASS**: The Lenremont.ru host (Wordfence/Cloudflare) heavily filters API bots. You MUST spoof a modern browser `User-Agent` (e.g., `Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36`) and pass standard headers (`Accept`, `Accept-Language`, `Content-Type: application/json`) to prevent 403/401 drops.
- **Scripting Delivery**: Do not use raw cURL if the payload is huge (600+ lines). Write a Python `urllib` or PowerShell `Invoke-RestMethod` script locally and execute it via `run_command` to safely transport the JSON payload `{"html_code": "..."}` directly to the server.

## 5. Structural Constraints for WordPress
- **NO HEADER / NO FOOTER**: Since these snippets are injected into an existing `lenremont.ru` environment via Elementor or Raw HTML blocks, the code MUST NOT contain a global header or footer.
- **Standalone Sections**: Build only the internal sections (Hero, Features, Services, etc.). The surrounding site shell provides navigation and legal info.
- **Z-Index Sensitivity**: Use `z-index` cautiously. Standard WP headers often use high values (`999+`), so ensure your popups or sticky elements don't overlap native site navigation.
