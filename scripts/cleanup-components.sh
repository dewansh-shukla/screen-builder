#!/usr/bin/env bash
# cleanup-components.sh
#
# Run this after syncing components from the main app to strip API calls,
# external service imports, and provider dependencies.
#
# Usage: bash scripts/cleanup-components.sh

set -euo pipefail

COMPONENTS_DIR="src/components"
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo "=== Component Cleanup for Screen Builder ==="
echo ""

# Patterns that indicate problematic imports (API calls, auth, stores, services)
BLOCKED_PATTERNS=(
    '@/lib/imagekit'
    '@/lib/firebase'
    '@/lib/axios'
    '@/lib/c56Api'
    '@/lib/paymentApi'
    '@/lib/affiliate-api'
    '@/hooks/useAuth'
    '@/hooks/gallery'
    '@/providers/venue-store'
    '@/services/'
    'uploadToImageKit'
    'useMutation'
    'useQuery'
    'mutateAsync'
)

found_issues=0

echo "Scanning ${COMPONENTS_DIR}/ for problematic imports..."
echo ""

for pattern in "${BLOCKED_PATTERNS[@]}"; do
    matches=$(grep -rl "$pattern" "$COMPONENTS_DIR" 2>/dev/null || true)
    if [ -n "$matches" ]; then
        echo -e "${RED}FOUND:${NC} '${pattern}' in:"
        echo "$matches" | while read -r file; do
            echo "  - $file"
        done
        echo ""
        found_issues=$((found_issues + 1))
    fi
done

if [ "$found_issues" -eq 0 ]; then
    echo -e "${GREEN}All clean!${NC} No problematic imports found."
else
    echo -e "${YELLOW}Found $found_issues blocked pattern(s).${NC}"
    echo ""
    echo "To fix these, convert the components to accept data via props"
    echo "instead of fetching it internally. Key rules:"
    echo ""
    echo "  1. Replace useAuth() with optional userId/user props"
    echo "  2. Replace data fetching hooks with items/data props"
    echo "  3. Replace mutation hooks with onSubmit/onChange callbacks"
    echo "  4. Replace store access with props passed from parent"
    echo "  5. Remove imagekit/firebase/API imports entirely"
    echo ""
    echo "See existing cleaned files for examples:"
    echo "  - src/components/application/gallery/gallery-preview.tsx"
    echo "  - src/components/application/app-header/app-header.tsx"
fi
