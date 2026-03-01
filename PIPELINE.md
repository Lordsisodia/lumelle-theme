# Lumelle Theme - Task Pipeline

## 🔄 How to Use This Pipeline

1. Pick ONE task from the queue below
2. Create a feature branch: `git checkout -b fix/task-name`
3. Make changes and commit
4. Push to GitHub and test on dev store
5. Mark task complete and move to next

---

## 📋 Task Queue

### 🔴 HIGH PRIORITY

- [ ] **Fix mobile menu animation** - Menu drawer animation is jerky on mobile
- [ ] **Add loading states to buttons** - Show spinner when Add to Cart is clicked
- [ ] **Fix product image zoom** - Zoom doesn't work on mobile touch
- [ ] **Test Cloudinary images on live site** - Verify all images load correctly

### 🟡 MEDIUM PRIORITY

- [ ] **Typography consistency** - Font sizes vary across components
- [ ] **Add alt text to images** - Accessibility improvement
- [ ] **Optimize bundle size** - Reduce lumelle-bundle.js size
- [ ] **Add error boundaries** - Graceful error handling in React
- [ ] **Fix footer centering on mobile** - Email subscription card alignment
- [ ] **Improve cart feedback** - Show confirmation when item added

### 🟢 LOW PRIORITY

- [ ] **Add micro-animations** - Subtle hover effects on buttons
- [ ] **Improve accessibility scores** - ARIA labels, focus states
- [ ] **Lazy load images** - Improve page load performance
- [ ] **Add schema markup** - SEO improvement for products
- [ ] **Create 404 page** - Custom not found page
- [ ] **Add breadcrumb navigation** - Better UX for product pages

### ✅ COMPLETED

- [x] Migrate images to Cloudinary CDN (2024-03)
- [x] Fix Add to Cart functionality (2024-03)
- [x] Fix side navigation drawer (2024-03)
- [x] Fix product URL format (/products/) (2024-03)
- [x] Fix variant ID passing to React (2024-03)
- [x] Remove duplicate burger icon (2024-03)
- [x] Hide cart in side nav (2024-03)

---

## 📝 Notes

### Testing Each Task

1. Push to GitHub
2. Pull in Shopify Admin (dev store)
3. Test on mobile and desktop
4. Check console for errors
5. Verify images load
6. Test cart functionality

### Rollback Process

If a task breaks something:
```bash
git revert HEAD
git push origin main
```

---

*Last Updated: March 2024*
