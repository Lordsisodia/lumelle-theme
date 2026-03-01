#!/bin/bash
# Flatten assets folder structure for Shopify compatibility
# Run from lumelle-theme directory

set -e

echo "=== Step 1: Move all images from subfolders to root assets/ ==="

# Find all image files in subdirectories and move them
find assets -type f \( -name "*.webp" -o -name "*.jpg" -o -name "*.png" -o -name "*.avif" -o -name "*.gif" -o -name "*.svg" \) | while read filepath; do
  dir=$(dirname "$filepath")
  if [ "$dir" != "assets" ]; then
    # Convert assets/uploads/curler/1.webp -> assets/uploads-curler-1.webp
    newname=$(echo "$filepath" | sed 's|assets/||' | tr '/' '-')
    newpath="assets/$newname"

    if [ -f "$newpath" ]; then
      echo "SKIP: $newpath already exists"
    else
      echo "MOVE: $filepath -> $newpath"
      git mv "$filepath" "$newpath"
    fi
  fi
done

echo ""
echo "=== Step 2: Update path references in layout/theme.liquid ==="
# Convert: "uploads/curler/1.webp" -> "uploads-curler-1.webp"
sed -i '' 's|"uploads/luminele/|"uploads-luminele-|g' layout/theme.liquid
sed -i '' 's|"uploads/curler/|"uploads-curler-|g' layout/theme.liquid
sed -i '' 's|"uploads/towel/|"uploads-towel-|g' layout/theme.liquid
sed -i '' 's|"images/|"images-|g' layout/theme.liquid

echo ""
echo "=== Step 3: Update path references in snippets/lumelle-data.liquid ==="
# Convert: '/uploads/curler/1.webp' -> 'uploads-curler-1.webp'
sed -i '' "s|'/uploads/luminele/|'uploads-luminele-|g" snippets/lumelle-data.liquid
sed -i '' 's|"/uploads/luminele/|"uploads-luminele-|g' snippets/lumelle-data.liquid
sed -i '' "s|'/uploads/curler/|'uploads-curler-|g" snippets/lumelle-data.liquid
sed -i '' 's|"/uploads/curler/|"uploads-curler-|g' snippets/lumelle-data.liquid
sed -i '' "s|'/uploads/towel/|'uploads-towel-|g" snippets/lumelle-data.liquid
sed -i '' 's|"/uploads/towel/|"uploads-towel-|g' snippets/lumelle-data.liquid
sed -i '' 's|"/images/|"images-|g' snippets/lumelle-data.liquid

echo ""
echo "=== Step 4: Remove empty subdirectories ==="
find assets -type d -empty -delete 2>/dev/null || true

echo ""
echo "=== Done! ==="
echo "Review changes with: git status"
echo "Commit with: git commit -m 'Flatten assets folder structure for Shopify'"
