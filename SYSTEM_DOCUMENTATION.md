# Lumelle Shopify Theme - System Documentation

## 📋 Table of Contents

1. [System Overview](#system-overview)
2. [Architecture](#architecture)
3. [How to Push Changes](#how-to-push-changes)
4. [Image Management (Cloudinary)](#image-management)
5. [Known Issues & Fixes](#known-issues)
6. [Task Pipeline System](#task-pipeline-system)
7. [File Structure](#file-structure)
8. [Credentials & Secrets](#credentials)

---

## 🏗 System Overview

### What We Built

A **hybrid Shopify + React theme** for Lumelle beauty products featuring:

| Component | Technology |
|-----------|------------|
| **Storefront** | Shopify Liquid templates |
| **Product Pages** | React bundle embedded in Liquid |
| **Images** | Cloudinary CDN |
| **Navigation** | Hybrid (Turbo + React) |
| **Cart** | Shopify AJAX API |

### Stores

| Store | Purpose | Theme ID |
|-------|---------|----------|
| `lumelle-3.myshopify.com` | Development | 192294748534 |
| `shop.lumellebeauty.co.uk` | Production/Live | 192217710966 |
| `lumellettest.myshopify.com` | Testing | 196027547990 |

---

## 🏛 Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     SHOPIFY STORE                           │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐         │
│  │   Liquid    │  │   Liquid    │  │   Liquid    │         │
│  │  Templates  │  │  Sections   │  │  Snippets   │         │
│  └──────┬──────┘  └──────┬──────┘  └──────┬──────┘         │
│         │                │                │                 │
│         └────────────────┼────────────────┘                 │
│                          │                                   │
│  ┌───────────────────────▼───────────────────────┐         │
│  │              theme.liquid                      │         │
│  │  ┌─────────────────────────────────────────┐  │         │
│  │  │  LUMELLE_IMAGES mapping (Cloudinary)    │  │         │
│  │  │  lumelleConfig (shop settings)          │  │         │
│  │  │  window.productData (current product)   │  │         │
│  │  └─────────────────────────────────────────┘  │         │
│  └───────────────────────┬───────────────────────┘         │
│                          │                                   │
│  ┌───────────────────────▼───────────────────────┐         │
│  │         lumelle-bundle.js (React)              │         │
│  │  ┌─────────────────────────────────────────┐  │         │
│  │  │  Product Pages (PDP)                    │  │         │
│  │  │  Side Navigation Drawer                 │  │         │
│  │  │  Footer Components                      │  │         │
│  │  │  Add to Cart / Buy Now                  │  │         │
│  │  └─────────────────────────────────────────┘  │         │
│  └───────────────────────────────────────────────┘         │
└─────────────────────────────────────────────────────────────┘
```

### Data Flow

```
1. Page Load
   └── theme.liquid renders
       ├── LUMELLE_IMAGES loaded (Cloudinary URLs)
       ├── lumelle-data.liquid snippet (product data)
       └── lumelle-bundle.js loads (React app)

2. React Mount
   └── Bundle reads window.productData
       └── Renders product page components
           └── Images loaded from Cloudinary

3. User Interaction
   └── Add to Cart clicked
       └── Calls Shopify /cart/add.js API
           └── Cart updates
```

---

## 🚀 How to Push Changes

### Method 1: GitHub → Shopify (Recommended)

```bash
# 1. Make your changes locally
cd /a0/usr/projects/lumelle/theme-files

# 2. Commit changes
git add .
git commit -m "Your commit message"

# 3. Push to GitHub
git push origin main

# 4. In Shopify Admin:
#    - Go to Online Store → Themes
#    - Find your development theme
#    - Click "Actions" → "Pull from GitHub"
```

### Method 2: Direct Shopify CLI Push

```bash
# Using theme access token
npx @shopify/cli theme push \
  --store lumelle-3.myshopify.com \
  --theme 192294748534 \
  --password YOUR_TOKEN_HERE
```

### Method 3: Manual Upload

```bash
# Create zip
cd theme-files
zip -r ../lumelle-theme.zip .

# Upload in Shopify Admin:
# Online Store → Themes → Upload theme
```

---

## 🖼 Image Management

### Cloudinary Configuration

| Setting | Value |
|---------|-------|
| **Cloud Name** | `dbowtimdn` |
| **Base URL** | `https://res.cloudinary.com/dbowtimdn/image/upload/lumelle/` |
| **Total Images** | 323 |

### Image Folders in Cloudinary

| Folder | Count | Contents |
|--------|-------|----------|
| `lumelle/root/` | 135 | SVG icons, hero images |
| `lumelle/og/` | 70 | Open Graph images |
| `lumelle/images/` | 44 | Avatars, lifestyle |
| `lumelle/curler/` | 23 | Curler product |
| `lumelle/luminele/` | 22 | Shower cap product |
| `lumelle/blog/` | 10 | Blog covers |
| `lumelle/towel/` | 8 | Hair towel product |
| `lumelle/logos/` | 8 | Integration logos |
| `lumelle/icons/` | 3 | App icons |

### How Images Work

```javascript
// In theme.liquid (LUMELLE_IMAGES)
window.LUMELLE_IMAGES = {
  '/uploads/curler/1.webp': 'https://res.cloudinary.com/dbowtimdn/image/upload/lumelle/curler/1.webp',
  // ... more images
};

// In React bundle (he() function)
function he(imagePath) {
  return window.LUMELLE_IMAGES[imagePath] || imagePath;
}
```

### Uploading New Images

```bash
# Using Cloudinary API
pip install cloudinary

python3 << 'EOF'
import cloudinary
import cloudinary.uploader

cloudinary.config(
    cloud_name="dbowtimdn",
    api_key="162511853292628",
    api_secret="YOUR_SECRET"
)

cloudinary.uploader.upload(
    "local-image.webp",
    public_id="lumelle/folder/image-name"
)
EOF
```

---

## 🐛 Known Issues & Fixes

### Issue 1: Product Navigation Shows Wrong Content
**Cause:** Turbo navigation doesn't remount React
**Fix:** Added `data-turbo="false"` to product links
**File:** `lumelle-bundle.js`

### Issue 2: Side Nav Drawer Doesn't Open
**Cause:** `redirectTo` function was undefined
**Fix:** Added `redirectTo = window.location.assign` in bundle
**File:** `lumelle-bundle.js`

### Issue 3: Add to Cart Not Working
**Cause:** Variant ID not passed to React components
**Fix:** Added `data-variant-id` attribute in Liquid sections
**Files:** `lumelle-react-pdp-price.liquid`, `lumelle-react-pdp-bottom-cta.liquid`

### Issue 4: Images Not Loading (Double Encoding)
**Cause:** URLs with spaces encoded twice
**Fix:** Migrated to Cloudinary CDN with clean paths
**File:** `theme.liquid` (LUMELLE_IMAGES)

### Issue 5: URL Format Mismatch
**Cause:** Code used `/product/` but Shopify uses `/products/`
**Fix:** Changed all URLs to use `/products/`
**Files:** `lumelle-data.liquid`, `lumelle-bundle.js`

---

## 🔄 Task Pipeline System

### Overview

A task pipeline allows you to queue up 20-30 improvements and have them executed one by one without breaking the site.

### Recommended Setup

Create a file called `PIPELINE.md` in the theme-files folder:

```markdown
# Task Pipeline

## Queue (Priority Order)

### High Priority (Do First)
- [ ] Fix mobile menu animation
- [ ] Add loading states to buttons
- [ ] Fix product image zoom on mobile

### Medium Priority  
- [ ] Improve typography consistency
- [ ] Add alt text to all images
- [ ] Optimize bundle size

### Low Priority
- [ ] Add micro-animations
- [ ] Improve accessibility scores
- [ ] Add error boundaries

### Completed
- [x] Migrate images to Cloudinary
- [x] Fix Add to Cart functionality
- [x] Fix side navigation drawer
```

### Pipeline Workflow

```
┌─────────────────────────────────────────────────────────┐
│                    TASK PIPELINE                         │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  1. Pick next task from queue                            │
│     └── Review task description                          │
│                                                          │
│  2. Create feature branch                                │
│     └── git checkout -b fix/task-name                    │
│                                                          │
│  3. Make changes                                         │
│     └── Test locally if possible                         │
│                                                          │
│  4. Commit with descriptive message                      │
│     └── git commit -m "Fix: description"                 │
│                                                          │
│  5. Push to GitHub                                       │
│     └── git push origin fix/task-name                    │
│                                                          │
│  6. Test on dev store                                    │
│     └── Pull from GitHub in Shopify Admin                │
│                                                          │
│  7. If working → Merge to main                           │
│     └── If broken → Revert and fix                       │
│                                                          │
│  8. Mark task complete, move to next                     │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

### Best Practices for Pipeline

1. **One task at a time** - Don't batch changes
2. **Test on dev store first** - Never push directly to live
3. **Small commits** - Easier to revert if broken
4. **Document changes** - Update this file
5. **Wait for confirmation** - Verify each change works

---

## 📁 File Structure

```
theme-files/
├── layout/
│   └── theme.liquid          # Main template (LUMELLE_IMAGES here)
├── snippets/
│   ├── lumelle-data.liquid   # Product data for React
│   └── header-drawer.liquid  # Navigation drawer
├── assets/
│   ├── lumelle-bundle.js     # React app (MAIN FILE)
│   ├── lumelle-footer-override.css
│   └── uploads-*.webp        # Fallback images (not used if Cloudinary works)
├── sections/
│   ├── lumelle-react-pdp-price.liquid
│   ├── lumelle-react-pdp-bottom-cta.liquid
│   └── lumelle-react-pdp-mobile-cta.liquid
├── templates/
│   ├── product.lumelle.json  # Custom product template
│   └── product.json          # Default product template
└── config/
    └── settings_schema.json
```

---

## 🔐 Credentials

### Shopify

| Store | Theme ID | Token Location |
|-------|----------|----------------|
| lumelle-3.myshopify.com | 192294748534 | CREDENTIALS.md |
| shop.lumellebeauty.co.uk | 192217710966 | Needs new token |

### Cloudinary

| Setting | Value | Location |
|---------|-------|----------|
| Cloud Name | dbowtimdn | CLOUDINARY_CREDS.md |
| API Key | 162511853292628 | CLOUDINARY_CREDS.md |
| API Secret | (stored separately) | CLOUDINARY_CREDS.md |

### GitHub

| Repo | URL |
|------|-----|
| lumelle-theme | github.com:Lordsisodia/lumelle-theme |

---

## 📊 UI/UX Checklist

### Clickability Issues to Check

- [ ] All buttons have hover states
- [ ] Mobile touch targets are 44px minimum
- [ ] Links have visible focus states
- [ ] Cart buttons work on all pages
- [ ] Navigation drawer opens/closes smoothly
- [ ] Product images zoom on hover/click

### Accessibility Issues to Check

- [ ] All images have alt text
- [ ] Color contrast meets WCAG AA
- [ ] Keyboard navigation works
- [ ] Screen reader compatible
- [ ] Focus visible on all interactive elements

### Performance Issues to Check

- [ ] Bundle size under 500KB
- [ ] Images using Cloudinary CDN
- [ ] Lazy loading enabled
- [ ] No console errors

---

## 📝 Recent Changes

| Date | Commit | Description |
|------|--------|-------------|
| 2024-03-01 | 3d85c36 | Migrate images to Cloudinary CDN |
| 2024-03-01 | 8cdb4d2 | Flatten assets folder structure |
| 2024-03-01 | 1eaa9f5 | Fix /product/ to /products/ URLs |
| 2024-03-01 | 3c55f77 | Fix PDP Add to Cart buttons |

---

## 🆘 Troubleshooting

### Site Shows White Screen
1. Check browser console for errors
2. Look for syntax errors in lumelle-bundle.js
3. Verify LUMELLE_IMAGES is defined
4. Check for missing closing tags in theme.liquid

### Images Not Loading
1. Verify Cloudinary URLs in LUMELLE_IMAGES
2. Check browser network tab for 404s
3. Verify images exist in Cloudinary

### Cart Not Working
1. Check variant ID is passed correctly
2. Verify /cart/add.js API returns success
3. Check for JavaScript errors

---

*Last Updated: March 2024*
*Author: Agent Zero*
