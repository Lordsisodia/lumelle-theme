# Shopify Theme Extraction System - Build Prompt

## Context

The Lumelle Shopify theme (`/lumelle-shopify/`) needs to be rebuilt using React components from the main Lumelle app (`/lumelle/`). Currently the theme has poorly-made Liquid sections that don't match the React originals.

## Source of Truth

**Main React components**: `/lumelle/src/shopify-embed.tsx`
- Contains inline React components with ALL styling (inline styles, not Tailwind)
- Already has: TrustBar, EmailCapture, AnnouncementBar
- Missing: HeroShop, BenefitsSection, ReviewsAutoCarousel, FeaturedTikTok, FaqSectionShop, FinalCtaSection

**Content config**: `/lumelle/src/content/home.config.ts`
- Contains ALL copy, images, and data for each component
- This is what should populate the sections, NOT made-up content

**Existing Shopify bundle**: `/lumelle-shopify/assets/lumelle-bundle.js`
- Currently has 50 lines - only includes Footer + a few components
- Needs HeroShop and other components ADDED

**Current Shopify sections**: `/lumelle-shopify/sections/lumelle-*.liquid`
- Poor quality, don't match React styling
- Use placeholder content instead of real content from home.config.ts

## What Already Works in Shopify

- The React mounting system exists (mounts to div IDs like `#react-footer`)
- Theme loads the bundle via `<script src="{{ 'lumelle-bundle.js' | asset_url }}">`

## Your Mission

### Phase 1: Understand the Architecture

1. Read `/lumelle/src/shopify-embed.tsx` - understand how inline React components work
2. Read `/lumelle/src/content/home.config.ts` - understand the data structure  
3. Check `/lumelle/src/domains/client/marketing/ui/sections/shop/` for component implementations:
   - HeroShop.tsx - the main hero component
   - trust-bar/TrustBar.tsx
   - benefits-section/BenefitsSection.tsx
   - reviews-auto-carousel/ReviewsAutoCarousel.tsx
   - featured-tik-tok/FeaturedTikTok.tsx
   - faq-section-shop/FaqSectionShop.tsx
   - final-cta-section/FinalCtaSection.tsx
   - email-capture-band/EmailCaptureBand.tsx

### Phase 2: Build the Extraction Pipeline

Create a new file: `/lumelle/scripts/extract-shopify-embed.js` (or similar)

This script should:
1. Parse `shopify-embed.tsx` to extract each component function
2. Extract inline styles (they're already in the file as JS objects)
3. Bundle ALL needed components into a single JS file
4. Output to `/lumelle-shopify/assets/lumelle-bundle.js`

### Phase 3: Update Shopify Sections

For EACH component, create a minimal Shopify section that just mounts React:

```liquid
{% comment %} Lumelle Hero {% endcomment %}
<div id="react-hero"></div>

{% schema %}
{
  "name": "Lumelle Hero",
  "presets": [{ "name": "Lumelle Hero" }]
}
{% endschema %}
```

**Sections to create/update:**
1. `sections/lumelle-hero.liquid` - mounts `#react-hero`
2. `sections/lumelle-trust-bar.liquid` - mounts `#react-trust-bar` (already exists, check if working)
3. `sections/lumelle-benefits.liquid` - mounts `#react-benefits`
4. `sections/lumelle-reviews.liquid` - mounts `#react-reviews`
5. `sections/lumelle-tiktok.liquid` - mounts `#react-tiktok`
6. `sections/lumelle-faq.liquid` - mounts `#react-faq`
7. `sections/lumelle-final-cta.liquid` - mounts `#react-cta`
8. `sections/lumelle-email-capture.liquid` - mounts `#react-email` (already exists)

### Phase 4: Update Homepage Template

Update `/lumelle-shopify/templates/index.json` to include all sections in order:

```json
{
  "sections": {
    "hero": { "type": "lumelle-hero" },
    "trust_bar": { "type": "lumelle-trust-bar" },
    "benefits": { "type": "lumelle-benefits" },
    "reviews": { "type": "lumelle-reviews" },
    "tiktok": { "type": "lumelle-tiktok" },
    "final_cta": { "type": "lumelle-final-cta" },
    "email_capture": { "type": "lumelle-email-capture" },
    "faq": { "type": "lumelle-faq" }
  },
  "order": ["hero", "trust_bar", "benefits", "reviews", "tiktok", "final_cta", "email_capture", "faq"]
}
```

## Key Files to Reference

- `/lumelle/src/shopify-embed.tsx` - template for how to write inline React components
- `/lumelle/src/content/home.config.ts` - ALL the content (headlines, copy, images, reviews, FAQs)
- `/lumelle/src/domains/client/marketing/ui/sections/shop/hero-shop/HeroShop.tsx` - full hero implementation with config

## Important Notes

1. **Don't use Tailwind** - the working React components use inline styles. Keep it that way.
2. **Don't make up content** - always extract from `home.config.ts`
3. **Keep the React mounting pattern** - components mount to specific IDs (e.g., `document.getElementById('react-hero')`)
4. **Images**: Use paths from `home.config.ts` - they're stored in `/uploads/luminele/` and can be referenced via Shopify's asset URL filter or the CDN

## Success Criteria

- [ ] All homepage sections mount their React components correctly
- [ ] Content matches exactly what's in home.config.ts
- [ ] Styling is pixel-perfect (inline styles preserved)
- [ ] Homepage loads without errors in Shopify theme preview
