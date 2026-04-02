#!/bin/bash

# Script to promote code from develop to main (production) branch
# This script merges develop into main and prompts for confirmation before pushing

set -e  # Exit on error

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored messages
print_info() {
    echo -e "${BLUE}ℹ ${1}${NC}"
}

print_success() {
    echo -e "${GREEN}✓ ${1}${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠ ${1}${NC}"
}

print_error() {
    echo -e "${RED}✗ ${1}${NC}"
}

print_header() {
    echo -e "\n${BLUE}==================================================${NC}"
    echo -e "${BLUE}  ${1}${NC}"
    echo -e "${BLUE}==================================================${NC}\n"
}

# Check if we're in a git repository
if ! git rev-parse --git-dir > /dev/null 2>&1; then
    print_error "Not in a git repository!"
    exit 1
fi

# Store the original branch to return to later
ORIGINAL_BRANCH=$(git rev-parse --abbrev-ref HEAD)

print_header "Promote to Production: develop → main"

# Check for uncommitted changes
print_info "Checking for uncommitted changes..."
if ! git diff-index --quiet HEAD -- 2>/dev/null; then
    print_error "You have uncommitted changes. Please commit or stash them before running this script."
    git status --short
    exit 1
fi
print_success "Working directory is clean"

# Fetch latest changes from remote
print_info "Fetching latest changes from remote..."
if ! git fetch origin; then
    print_error "Failed to fetch from remote"
    exit 1
fi
print_success "Fetched latest changes"

# Checkout and update develop branch
print_info "Updating develop branch..."
if ! git checkout develop; then
    print_error "Failed to checkout develop branch"
    exit 1
fi

if ! git pull origin develop; then
    print_error "Failed to pull develop branch"
    exit 1
fi
print_success "Updated develop branch"

# Store develop commit hash for reference
DEVELOP_COMMIT=$(git rev-parse HEAD)
DEVELOP_COMMIT_SHORT=$(git rev-parse --short HEAD)

# Checkout and update main branch
print_info "Updating main branch..."
if ! git checkout main; then
    print_error "Failed to checkout main branch"
    exit 1
fi

if ! git pull origin main; then
    print_error "Failed to pull main branch"
    exit 1
fi
print_success "Updated main branch"

# Store main commit hash for reference
MAIN_COMMIT=$(git rev-parse HEAD)
MAIN_COMMIT_SHORT=$(git rev-parse --short HEAD)

# Show commits that will be merged
print_header "Commits to be promoted to production"
echo -e "${YELLOW}From:${NC} develop (${DEVELOP_COMMIT_SHORT})"
echo -e "${YELLOW}Into:${NC} main (${MAIN_COMMIT_SHORT})"
echo ""

# Check if there are any commits to merge
COMMITS_TO_MERGE=$(git log main..develop --oneline)
if [ -z "$COMMITS_TO_MERGE" ]; then
    print_warning "No new commits to merge. Production (main) is already up to date with develop."

    # Check if there are unpushed commits on main
    UNPUSHED_COMMITS=$(git log origin/main..main --oneline)
    if [ -z "$UNPUSHED_COMMITS" ]; then
        print_success "Main branch is also in sync with remote. Nothing to do."
        print_info "Returning to original branch ($ORIGINAL_BRANCH)..."
        git checkout "$ORIGINAL_BRANCH"
        exit 0
    fi

    # Show unpushed commits
    print_header "Unpushed commits on main"
    echo "$UNPUSHED_COMMITS"
    echo ""

    # Ask for confirmation to push
    print_warning "⚠️  WARNING: You are about to push to PRODUCTION (main branch)!"
    read -p "$(echo -e ${YELLOW}Do you want to push main to remote? [y/N]:${NC} )" -n 1 -r
    echo ""

    if [[ $REPLY =~ ^[Yy]$ ]]; then
        print_info "Pushing main to remote..."
        if ! git push origin main; then
            print_error "Failed to push to remote"
            exit 1
        fi
        print_success "Successfully pushed main to remote!"
        print_success "Production deployment complete!"
    else
        print_warning "Push cancelled. You can manually push later with:"
        echo "  git push origin main"
    fi

    # Return to original branch
    print_info "Returning to original branch ($ORIGINAL_BRANCH)..."
    git checkout "$ORIGINAL_BRANCH"
    print_success "Done!"
    exit 0
fi

echo "$COMMITS_TO_MERGE"
echo ""

# Attempt to merge develop into main
print_info "Merging develop into main..."
if ! git merge develop --no-edit -m "Merge branch 'develop' into main"; then
    print_error "Merge failed! There are conflicts that need to be resolved manually."
    echo ""
    print_warning "Conflicted files:"
    git diff --name-only --diff-filter=U
    echo ""
    print_info "To resolve conflicts:"
    echo "  1. Edit the conflicted files to resolve conflicts"
    echo "  2. Run: git add <resolved-files>"
    echo "  3. Run: git commit"
    echo "  4. Run: git push origin main (or run this script again)"
    echo ""
    print_info "To abort the merge:"
    echo "  Run: git merge --abort"
    exit 1
fi

print_success "Merge successful!"

# Show what will be pushed
print_header "Summary"
NEW_MAIN_COMMIT=$(git rev-parse HEAD)
NEW_MAIN_COMMIT_SHORT=$(git rev-parse --short HEAD)

echo -e "${GREEN}Main branch is now at:${NC} ${NEW_MAIN_COMMIT_SHORT}"
echo ""

# Check if it's a fast-forward merge
if [ "$NEW_MAIN_COMMIT" = "$DEVELOP_COMMIT" ]; then
    print_info "Fast-forward merge (no merge commit created)"
else
    print_info "Merge commit created"
fi

# Ask for confirmation before pushing
echo ""
print_warning "⚠️  WARNING: You are about to push to PRODUCTION (main branch)!"
read -p "$(echo -e ${YELLOW}Do you want to push main to remote? [y/N]:${NC} )" -n 1 -r
echo ""

if [[ $REPLY =~ ^[Yy]$ ]]; then
    print_info "Pushing main to remote..."
    if ! git push origin main; then
        print_error "Failed to push to remote"
        exit 1
    fi
    print_success "Successfully pushed main to remote!"
    print_success "Production deployment complete: develop → main"
else
    print_warning "Push cancelled. You can manually push later with:"
    echo "  git push origin main"
fi

# Return to original branch
print_info "Returning to original branch ($ORIGINAL_BRANCH)..."
git checkout "$ORIGINAL_BRANCH"

print_success "Done!"
