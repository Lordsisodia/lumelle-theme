# Lumelle Shopify Theme Agent Context

## Project Overview
This is a Shopify theme with embedded React components for the Lumelle beauty brand (shop.lumellebeauty.co.uk). The React app is built in `/Users/shaansisodia/DEV/client-projects/lumelle/` and bundled to `/Users/shaansisodia/DEV/client-projects/lumelle-shopify/assets/`.

## Key Paths

- **React Source**: `/Users/shaansisodia/DEV/client-projects/lumelle/`
- **Shopify Theme**: `/Users/shaansisodia/DEV/client-projects/lumelle-shopify/`
- **Embed Entry**: `lumelle/src/shopify-embed.tsx`
- **Home Config**: `lumelle/src/content/home.config.ts`
- **Brand Config**: `lumelle/src/config/brand.config.ts`

## Building & Deploying

**Build React bundle:**
```bash
cd /Users/shaansisodia/DEV/client-projects/lumelle && npm run build:shopify
```

**Push to Shopify test store:**
```bash
cd /Users/shaansisodia/DEV/client-projects/lumelle-shopify
shopify theme push --store lumelletest.myshopify.com --theme 196027679062
```

## Testing URLs

- **Homepage**: https://lumelletest.myshopify.com?preview_theme_id=196027679062
- **Product (Shower Cap)**: https://lumelletest.myshopify.com/products/lumelle-shower-cap?preview_theme_id=196027679062

## Architecture

The theme uses:
1. **Multiple React roots** - Each section (hero, benefits, PDP sections) mounts independently
2. **LUMELLE_IMAGES** - Maps local asset paths to Shopify CDN URLs (defined in `layout/theme.liquid`)
3. **DEFAULT_CONFIG** - Hardcoded fallback data in `shopify-embed.tsx` when no Shopify product data exists
4. **cdnUrl function** - Resolves local paths like `/uploads/luminele/shower-cap-01.webp` to actual URLs

## Common Issues & Fixes

- **404 on product links**: Links use `/products/` (plural), NOT `/product/` (singular)
- **Images not loading**: Use local paths like `/uploads/luminele/...` not external CDN URLs
- **React hydration errors**: Ensure each section has its own root element with unique ID

## Current Template
Product pages use `templates/product.lumelle.json` which defines React sections. The main entry is `sections/lumelle-react-pdp.liquid`.

## Available Components (PDP)
- HeroMedia (gallery)
- PriceBlock
- HowToSection
- FeatureCallouts
- DetailsAccordion
- FeaturedTikTok
- FaqSectionShop
- ReviewsAutoCarousel
