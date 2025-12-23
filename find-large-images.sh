#!/bin/bash

# Image Optimization Finder
# Run this in your project root to find images that need optimization

echo "🔍 Finding large images in your project..."
echo ""

# Find images larger than 500KB
echo "📊 Images larger than 500KB:"
find src/assets -type f \( -iname "*.jpg" -o -iname "*.jpeg" -o -iname "*.png" -o -iname "*.gif" \) -size +500k -exec ls -lh {} \; | awk '{print $9 " - " $5}'

echo ""
echo "💡 Recommendations:"
echo ""
echo "1. Convert to WebP format (80-90% size reduction):"
echo "   npm install -D vite-plugin-image-optimizer"
echo ""
echo "2. Or use online tools:"
echo "   - Squoosh: https://squoosh.app/"
echo "   - TinyPNG: https://tinypng.com/"
echo ""
echo "3. Your biggest offenders from the build:"
echo "   - Personal_Image: 3,274 KB → should be ~300 KB as webp"
echo "   - Daily_Image: 1,895 KB → should be ~200 KB as webp"
echo "   - GuildBoss: 1,426 KB → should be ~150 KB as webp"
echo ""
echo "4. Consider lazy loading with Intersection Observer"
echo ""
