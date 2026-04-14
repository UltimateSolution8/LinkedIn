#!/bin/bash

# Script to promote code from develop to main (production) branch
# Uses --ff-only merge to keep a linear commit history (no merge commits)
# If fast-forward is not possible, offers to rebase develop onto main first

set -e  # Exit on error

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

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

# ── 1. Git repo check ────────────────────────────────────────────────────────
if ! git rev-parse --git-dir > /dev/null 2>&1; then
    print_error "Not in a git repository!"
    exit 1
fi

# Store original branch to return to after script completes
ORIGINAL_BRANCH=$(git rev-parse --abbrev-ref HEAD)

print_header "Promote to Production: develop → main (fast-forward only)"

# ── 2. Uncommitted changes check ─────────────────────────────────────────────
print_info "Checking for uncommitted changes..."
if ! git diff-index --quiet HEAD -- 2>/dev/null; then
    print_error "You have uncommitted changes. Please commit or stash them before running this script."
    git status --short
    exit 1
fi
print_success "Working directory is clean"

# ── 3. Fetch latest from remote ──────────────────────────────────────────────
print_info "Fetching latest changes from remote..."
if ! git fetch origin; then
    print_error "Failed to fetch from remote"
    exit 1
fi
print_success "Fetched latest changes"

# ── 4. Update develop via rebase (keeps develop linear) ──────────────────────
print_info "Updating develop branch (rebase)..."
if ! git checkout develop; then
    print_error "Failed to checkout develop branch"
    exit 1
fi

if ! git pull --rebase origin develop; then
    print_error "Failed to rebase develop against origin/develop."
    print_info "Resolve conflicts then run: git rebase --continue"
    print_info "Or abort with: git rebase --abort"
    exit 1
fi
print_success "develop is up to date (rebased)"

DEVELOP_COMMIT=$(git rev-parse HEAD)
DEVELOP_COMMIT_SHORT=$(git rev-parse --short HEAD)

# ── 5. Update main via fast-forward ──────────────────────────────────────────
print_info "Updating main branch..."
if ! git checkout main; then
    print_error "Failed to checkout main branch"
    exit 1
fi

if ! git pull --ff-only origin main; then
    print_error "Could not fast-forward local main to origin/main."
    print_info "This means main has local commits not on remote. Investigate before continuing."
    git checkout "$ORIGINAL_BRANCH"
    exit 1
fi
print_success "main is up to date"

MAIN_COMMIT=$(git rev-parse HEAD)
MAIN_COMMIT_SHORT=$(git rev-parse --short HEAD)

# ── 6. Check if there is anything to promote ─────────────────────────────────
COMMITS_TO_PROMOTE=$(git log main..develop --oneline)

if [ -z "$COMMITS_TO_PROMOTE" ]; then
    print_success "Nothing to promote — main is already up to date with develop."
    print_info "Returning to original branch ($ORIGINAL_BRANCH)..."
    git checkout "$ORIGINAL_BRANCH"
    print_success "Done!"
    exit 0
fi

# ── 7. Show commits to be promoted ───────────────────────────────────────────
print_header "Commits to be promoted to production"
echo -e "${YELLOW}From:${NC} develop (${DEVELOP_COMMIT_SHORT})"
echo -e "${YELLOW}Into:${NC} main   (${MAIN_COMMIT_SHORT})"
echo ""
echo "$COMMITS_TO_PROMOTE"
echo ""

# ── 8. Special case: fast-forward not possible ───────────────────────────────
# This happens when main has commits that are not ancestors of develop
# (e.g. a hotfix was applied directly to main without syncing back to develop)
if ! git merge-base --is-ancestor main develop 2>/dev/null; then
    echo ""
    print_warning "Fast-forward is NOT possible."
    print_info "main has commits that are not in develop. This means the branches have diverged."
    echo ""
    print_info "Commits on main that are NOT in develop:"
    git log develop..main --oneline | while IFS= read -r line; do
        echo "  $line"
    done
    echo ""
    print_info "To fix this, develop must be rebased onto main."
    print_warning "This will rewrite develop's commit history and require a force-push."
    echo ""
    read -p "$(echo -e ${YELLOW}Rebase develop onto main now? [y/N]:${NC} )" -n 1 -r
    echo ""

    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        print_warning "Promotion cancelled. You can manually rebase with:"
        echo ""
        echo "  git checkout develop"
        echo "  git rebase main"
        echo "  git push --force-with-lease origin develop"
        echo "  # then re-run this script"
        git checkout "$ORIGINAL_BRANCH"
        exit 0
    fi

    # Rebase develop onto main
    print_info "Switching to develop and rebasing onto main..."
    git checkout develop

    if ! git rebase main; then
        echo ""
        print_error "Rebase hit conflicts. Resolve them and then continue:"
        echo ""
        echo "  1. Edit conflicted files"
        echo "  2. git add <resolved-files>"
        echo "  3. git rebase --continue"
        echo "  4. git push --force-with-lease origin develop"
        echo "  5. Re-run this script"
        echo ""
        print_info "To abort:"
        echo "  git rebase --abort"
        exit 1
    fi

    print_success "Rebase complete"

    # Force-push the rebased develop to remote
    print_info "Force-pushing rebased develop to origin..."
    if ! git push --force-with-lease origin develop; then
        print_error "Force-push to origin/develop failed."
        exit 1
    fi
    print_success "origin/develop updated (force-pushed)"

    # Update commit references after rebase
    DEVELOP_COMMIT=$(git rev-parse HEAD)
    DEVELOP_COMMIT_SHORT=$(git rev-parse --short HEAD)

    # Switch back to main for the merge
    git checkout main
fi

# ── 9. Production warning + confirmation ─────────────────────────────────────
print_header "Summary"
echo -e "${YELLOW}Commits to promote (${DEVELOP_COMMIT_SHORT} → main):${NC}"
echo ""
git log main..develop --oneline | while IFS= read -r line; do
    echo "  $line"
done
echo ""

print_warning "WARNING: You are about to push to PRODUCTION (main branch)!"
read -p "$(echo -e ${YELLOW}Do you want to proceed? [y/N]:${NC} )" -n 1 -r
echo ""

if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    print_warning "Promotion cancelled. No changes were made to main."
    print_info "Returning to original branch ($ORIGINAL_BRANCH)..."
    git checkout "$ORIGINAL_BRANCH"
    exit 0
fi

# ── 10. Fast-forward main to develop ─────────────────────────────────────────
print_info "Fast-forward merging develop into main..."
if ! git merge --ff-only develop; then
    print_error "Fast-forward merge failed unexpectedly."
    print_info "This should not happen after the checks above. Run the script again."
    exit 1
fi
print_success "Fast-forward merge complete — no merge commit created"

# ── 11. Push main to remote ───────────────────────────────────────────────────
print_info "Pushing main to origin..."
if ! git push origin main; then
    print_error "Failed to push main to remote."
    print_warning "Local main is ahead of origin. You can push manually:"
    echo "  git push origin main"
    exit 1
fi

NEW_MAIN_SHORT=$(git rev-parse --short HEAD)
print_success "Successfully pushed main to origin!"
echo ""
echo -e "${GREEN}Production is now at:${NC} ${NEW_MAIN_SHORT}"
echo ""
print_success "Promotion complete: develop → main (linear history preserved)"

# ── 12. Return to original branch ────────────────────────────────────────────
print_info "Returning to original branch ($ORIGINAL_BRANCH)..."
git checkout "$ORIGINAL_BRANCH"
print_success "Done!"
