#!/bin/bash

# Script to commit staged changes and push to develop branch
# Handles remote divergence via rebase to keep history linear (no merge commits)

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

print_header "Commit & Push → develop"

# ── 2. Check for staged changes ──────────────────────────────────────────────
print_info "Checking for staged changes..."

if git diff --cached --quiet; then
    print_error "No staged changes found."
    echo ""

    # Show unstaged changes as a hint
    UNSTAGED=$(git diff --stat)
    UNTRACKED=$(git ls-files --others --exclude-standard)

    if [ -n "$UNSTAGED" ] || [ -n "$UNTRACKED" ]; then
        print_warning "You have unstaged/untracked changes. Stage them first with:"
        echo ""
        echo "  git add <file>      # stage specific file"
        echo "  git add .           # stage everything"
        echo ""
        git status --short
    else
        print_info "Working directory is clean — nothing to commit."
    fi
    exit 1
fi

# ── 3. Show what is staged ────────────────────────────────────────────────────
print_info "Staged changes to be committed:"
echo ""
git diff --cached --stat
echo ""

# ── 4. Prompt for commit message ─────────────────────────────────────────────
COMMIT_MESSAGE=""
while [ -z "$COMMIT_MESSAGE" ]; do
    read -p "$(echo -e ${YELLOW}Enter commit message:${NC} )" COMMIT_MESSAGE
    if [ -z "$COMMIT_MESSAGE" ]; then
        print_warning "Commit message cannot be empty. Please try again."
    fi
done

# ── 5. Commit locally ────────────────────────────────────────────────────────
print_info "Committing staged changes..."
if ! git commit -m "$COMMIT_MESSAGE"; then
    print_error "Commit failed."
    exit 1
fi
print_success "Committed: \"$COMMIT_MESSAGE\""

# ── 6. Fetch remote develop ──────────────────────────────────────────────────
print_info "Fetching latest from origin/develop..."
if ! git fetch origin develop 2>/dev/null; then
    print_warning "Could not fetch origin/develop — skipping remote sync check."
else
    # ── 7. Special case: remote has new commits ───────────────────────────────
    BEHIND=$(git log HEAD..origin/develop --oneline 2>/dev/null)

    if [ -n "$BEHIND" ]; then
        print_warning "Remote develop has new commits not in your local branch:"
        echo ""
        echo "$BEHIND" | while IFS= read -r line; do
            echo "  $line"
        done
        echo ""
        print_info "Rebasing your commit on top of remote changes to keep history linear..."

        if ! git rebase origin/develop; then
            echo ""
            print_error "Rebase hit conflicts. Resolve them and then continue:"
            echo ""
            echo "  1. Edit conflicted files"
            echo "  2. git add <resolved-files>"
            echo "  3. git rebase --continue"
            echo "  4. git push origin develop"
            echo ""
            print_info "To abort and go back to before the rebase:"
            echo "  git rebase --abort"
            exit 1
        fi
        print_success "Rebase complete — your commit is now on top of remote changes"
    else
        print_success "Remote develop is in sync — no rebase needed"
    fi
fi

# ── 8. Push to origin/develop ────────────────────────────────────────────────
CURRENT_BRANCH=$(git rev-parse --abbrev-ref HEAD)

if [ "$CURRENT_BRANCH" != "develop" ]; then
    print_warning "You are on branch '${CURRENT_BRANCH}', not 'develop'."
    read -p "$(echo -e ${YELLOW}Push '${CURRENT_BRANCH}' to origin/develop anyway? [y/N]:${NC} )" -n 1 -r
    echo ""
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        print_warning "Push cancelled."
        exit 0
    fi
    PUSH_TARGET="$CURRENT_BRANCH:develop"
else
    PUSH_TARGET="develop"
fi

print_info "Pushing to origin/develop..."
if ! git push origin "$PUSH_TARGET"; then
    print_error "Push failed."
    exit 1
fi

print_success "Successfully pushed to origin/develop!"
echo ""
PUSHED_COMMIT=$(git rev-parse --short HEAD)
echo -e "${GREEN}Commit:${NC} ${PUSHED_COMMIT} — ${COMMIT_MESSAGE}"
echo ""
print_success "Done!"
