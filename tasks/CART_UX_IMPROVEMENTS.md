# Cart UX Improvements Plan

## Status: PLANNING ONLY - NOT IMPLEMENTED YET

## Features to Implement:

### 1. Animation When Item Added to Cart
- Cart drawer should open when item added
- Cart badge should update with count
- Optional: Toast notification

### 2. Add to Cart Button Animation
- Show loading state during API call
- Show success state (checkmark) after item added
- Return to normal after 1-2 seconds

### 3. Plus/Minus Buttons Live-Connect to Cart
- Current: Local state only, syncs on Add to Cart
- Desired: Update cart directly when changing quantity

## Implementation Priority:
1. Cart drawer opens on add (EASY - 5 min)
2. Button loading state (MEDIUM - 30 min)
3. Cart badge animation (MEDIUM - 1-2 hours)
4. Button success state (MEDIUM - 1 hour)
5. Live cart sync (HARD - 3-4 hours)

## Key Locations:
- lumelle-bundle.js: Cart functionality
- layout/theme.liquid: Cart icon
- lumelleOpenCart(): Function to open drawer

## Branch: develop ONLY
