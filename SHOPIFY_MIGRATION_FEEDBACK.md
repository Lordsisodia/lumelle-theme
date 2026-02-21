# Shopify Theme React Migration - Feedback & Tasks

## Date: Feb 21, 2026

---

## PART 1: USER FEEDBACK (10 Points)

### 1. Announcement Bar - Missing Rotation
**Current:** Pink bar at top with text, but not rotating
**Expected:** Should rotate across 3 different messages (free shipping, money back guarantee, etc.)
**Issue:** Implemented as static Liquid, not React component

### 2. Top Nav - Wrong Font & Color
**Current:** Uses Shopify theme fonts/colors
**Expected:** Should use Lumelle's exact font and brand colors
**Issue:** Using Shopify Dawn theme header, not React

### 3. Top Nav - Missing Profile Icon
**Current:** No profile icon on right side
**Expected:** Should have profile icon on right hand side of nav

### 4. Side Nav - Not Using Lumelle's Side Nav
**Current:** Using Shopify side nav
**Expected:** Should use Lumelle's side navigation

### 5. Hero Section - Font/Size Inaccuracies
**Current:** Close but not exact - fonts, text sizes, callout boxes, stars not matching
**Expected:** Pixel-perfect match of Lumelle hero
**Issue:** Re-created "close approximation" rather than exact component

### 6. Benefits/Product Section - Wrong Component
**Current:** Shows "Why you'll love it" with benefit cards
**Expected:** Should show "Product Spotlight" with:
- Product image in a box
- "Lumelle Shower Cap" title
- "Shop the cap" button
- Scrollable carousel of 3 other products

### 7. Customer Stories Section - Missing
**Current:** Not present
**Expected:** Customer stories/reviews section below product spotlight

### 8. Footer - Was Working, Now Gone
**Current:** Footer stopped working after bundle update
**Expected:** Should have Lumelle footer with logo, "Made in UK", "30-day returns", email capture, click-to-top

### 9. Components Not Exact - Close Approximations
**Feedback:** "You've imitated it really well, but you're not using the exact components"
**Issue:** Some components are re-created lookalikes rather than the actual React components from the app

### 10. Overall - Needs More Work
**Feedback:** "This needs some work", "we're definitely missing some stuff, but we're on a good track here"

---

## PART 2: EXACT COMPONENT ORDER (from ShopLandingPage.tsx)

The Lumelle app uses these components in order:

1. **MarketingLayout** (includes header/nav) - `@/layouts/MarketingLayout`
2. **HeroShop** - `@client/marketing/ui/sections/shop/hero-shop/HeroShop`
3. **TrustBar** - `@client/marketing/ui/sections/shop/trust-bar/TrustBar`
4. **ProductSpotlightSection** - `@client/marketing/ui/sections/shop/product-spotlight-section/ProductSpotlightSection`
5. ~~**BenefitsSection**~~ - Currently DISABLED (`SHOW_WHY_YOULL_LOVE_IT = false`)
6. **ReviewsAutoCarousel** - `@client/shop/products/ui/sections`
7. **FeaturedTikTok** - `@client/shop/products/ui/sections`
8. **BundleCards** - `@client/marketing/ui/sections/shop/bundle-cards/BundleCards`
9. **FinalCtaSection** - `@client/marketing/ui/sections/shop/final-cta-section/FinalCtaSection`
10. **FaqSectionShop** - `@client/shop/products/ui/sections`
11. **EmailCaptureBand** - `@client/marketing/ui/sections/shop/email-capture-band/EmailCaptureBand`

Also uses:
- **GlobalFooter** - `@ui/components/GlobalFooter` (rendered inside MarketingLayout)

---

## PART 3: SOURCE FILE LOCATIONS

### Components to Import:

| Component | Source File |
|----------|-------------|
| HeroShop | `src/domains/client/marketing/ui/sections/shop/hero-shop/HeroShop.tsx` |
| TrustBar | `src/domains/client/marketing/ui/sections/shop/trust-bar/TrustBar.tsx` |
| ProductSpotlightSection | `src/domains/client/marketing/ui/sections/shop/product-spotlight-section/ProductSpotlightSection.tsx` |
| BenefitsSection | `src/domains/client/marketing/ui/sections/shop/benefits-section/BenefitsSection.tsx` |
| ReviewsAutoCarousel | `src/domains/client/shop/products/ui/sections/ReviewsAutoCarousel.tsx` |
| FeaturedTikTok | `src/domains/client/shop/products/ui/sections/FeaturedTikTok.tsx` |
| BundleCards | `src/domains/client/marketing/ui/sections/shop/bundle-cards/BundleCards.tsx` |
| FinalCtaSection | `src/domains/client/marketing/ui/sections/shop/final-cta-section/FinalCtaSection.tsx` |
| FaqSectionShop | `src/domains/client/shop/products/ui/sections/FaqSectionShop.tsx` |
| EmailCaptureBand | `src/domains/client/marketing/ui/sections/shop/email-capture-band/EmailCaptureBand.tsx` |
| GlobalFooter | `src/ui/components/GlobalFooter.tsx` |
| MarketingLayout | `src/layouts/MarketingLayout.tsx` |

### Config Source:
- `src/content/home.config.ts` - Contains all the data (hero, reviews, FAQ, etc.)

---

## PART 4: CURRENT BUNDLE vs REQUIRED

### Currently in shopify-embed.tsx (9 components):
1. TrustBar ✅
2. AnnouncementBar ❌ (not on landing page)
3. EmailCapture ✅
4. HeroShop ✅
5. BenefitsSection ❌ (disabled on app)
6. ReviewsAutoCarousel ✅
7. FeaturedTikTok ✅
8. FaqSectionShop ✅
9. FinalCtaSection ✅

### Missing from Shopify bundle:
1. **ProductSpotlightSection** - MUST HAVE, replaces benefits
2. **BundleCards** - Should be after TikTok
3. **GlobalFooter** - Was working before (dead code in old bundle)
4. **MarketingLayout** - For header/nav (this is complex - may need Liquid approach)

---

## PART 5: ACTION ITEMS

### Priority 1 - Critical:
- [ ] Import **ProductSpotlightSection** to replace wrong Benefits section
- [ ] Fix **GlobalFooter** - was working before
- [ ] Add **BundleCards** section

### Priority 2 - Navigation:
- [ ] Fix header/nav to use Lumelle fonts/colors
- [ ] Add profile icon to nav
- [ ] Implement side nav

### Priority 3 - Polish:
- [ ] Make HeroShop match exactly (fonts, sizes)
- [ ] Fix announcement bar rotation
- [ ] Add customer stories section

---

## NOTES

- The old bundle (before Feb 21 6:41pm) had GlobalFooter code but it was never called (dead code). The footer was working on Shopify because of a different/older bundle version.
- BenefitsSection is disabled in the app (`SHOW_WHY_YOULL_LOVE_IT = false`)
- The landing page imports from `@client/marketing/ui/sections` and `@client/shop/products/ui/sections`
