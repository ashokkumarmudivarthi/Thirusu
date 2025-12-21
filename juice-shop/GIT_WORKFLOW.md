# ThiruSu Juice Shop - Git Workflow Guide

## Version Control with Git 📚

Complete guide for working with Git, GitHub, and managing your codebase.

---

## Table of Contents
1. [Git Basics](#git-basics)
2. [Initial Setup](#initial-setup)
3. [Common Workflows](#common-workflows)
4. [Branching Strategy](#branching-strategy)
5. [Push & Pull](#push--pull)
6. [Collaboration](#collaboration)
7. [Best Practices](#best-practices)
8. [Troubleshooting](#troubleshooting)

---

## Git Basics

### What is Git?
Git is a **version control system** that tracks changes to your code:
- **Tracks history**: See what changed, when, and why
- **Collaboration**: Multiple developers work together
- **Branching**: Work on features independently
- **Rollback**: Undo mistakes easily

### What is GitHub?
GitHub is a **cloud platform** for hosting Git repositories:
- **Remote storage**: Backup your code
- **Collaboration**: Share with team
- **Issue tracking**: Manage tasks
- **CI/CD**: Automated testing and deployment

---

## Initial Setup

### 1. Install Git

**Download Git:**
- Windows: [https://git-scm.com/download/win](https://git-scm.com/download/win)
- macOS: `brew install git`
- Linux: `sudo apt-get install git`

**Verify installation:**
```powershell
git --version
# Output: git version 2.x.x
```

### 2. Configure Git

**Set your identity** (required):
```powershell
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"
```

**Verify configuration:**
```powershell
git config --list
# Should show your name and email
```

**Optional configurations:**
```powershell
# Set default editor
git config --global core.editor "code --wait"  # VS Code

# Set default branch name
git config --global init.defaultBranch main

# Enable colored output
git config --global color.ui auto
```

### 3. Setup GitHub Account

1. **Create account**: [https://github.com/signup](https://github.com/signup)
2. **Verify email**: Check inbox
3. **Create personal access token** (for HTTPS):
   - Settings → Developer settings → Personal access tokens → Tokens (classic)
   - Generate new token
   - Select scopes: `repo`, `workflow`
   - Copy token (save securely)

**OR setup SSH keys** (recommended):
```powershell
# Generate SSH key
ssh-keygen -t ed25519 -C "your.email@example.com"
# Press Enter (default location)
# Enter passphrase (optional)

# Copy public key
Get-Content ~/.ssh/id_ed25519.pub | clip

# Add to GitHub:
# Settings → SSH and GPG keys → New SSH key
# Paste key, give it a name
```

**Test SSH connection:**
```powershell
ssh -T git@github.com
# Output: Hi username! You've successfully authenticated...
```

---

## Common Workflows

### Workflow 1: Starting Fresh (New Project)

#### Step 1: Create GitHub Repository
1. Go to GitHub
2. Click **"New repository"**
3. Name: `ThiruSu` (or your choice)
4. Description: "Juice shop e-commerce application"
5. **Private** or Public
6. ✅ Initialize with README (optional)
7. Click **"Create repository"**

#### Step 2: Clone to Local
```powershell
# Navigate to desired directory
cd e:\

# Clone repository
git clone https://github.com/yourusername/ThiruSu.git

# OR using SSH
git clone git@github.com:yourusername/ThiruSu.git

# Navigate into folder
cd ThiruSu
```

#### Step 3: Add Your Code
```powershell
# Copy juice-shop folder into ThiruSu
# OR create structure manually

# Check status
git status
# Shows untracked files
```

#### Step 4: Initial Commit
```powershell
# Add all files
git add .

# Commit with message
git commit -m "Initial commit: Juice shop application"

# Push to GitHub
git push origin main
```

### Workflow 2: Working with Existing Project

#### Clone Repository
```powershell
# Clone project
git clone https://github.com/username/ThiruSu.git

# Navigate to project
cd ThiruSu\juice-shop

# Check remote
git remote -v
# Shows: origin https://github.com/username/ThiruSu.git
```

#### Install Dependencies
```powershell
# Frontend
npm install

# Backend
cd backend
npm install
cd ..
```

#### Start Working
```powershell
# Pull latest changes
git pull origin main

# Create feature branch
git checkout -b feature/your-feature-name

# Make changes...
# Edit files
```

### Workflow 3: Daily Development

#### Morning Routine
```powershell
# Navigate to project
cd e:\ThiruSu\juice-shop

# Check current branch
git branch
# Shows: * main

# Pull latest changes
git pull origin main

# Create new feature branch
git checkout -b feature/add-payment-gateway
```

#### Working on Features
```powershell
# Make changes to code...
# Edit files, add features

# Check what changed
git status
# Shows: modified files

# See specific changes
git diff
# Shows: line-by-line changes

# Stage files
git add .
# Or specific files:
git add src/pages/Payment.jsx

# Commit changes
git commit -m "feat: add payment gateway integration"

# Push to remote
git push origin feature/add-payment-gateway
```

#### End of Day
```powershell
# Commit all work
git add .
git commit -m "wip: payment gateway progress"
git push origin feature/add-payment-gateway

# Switch back to main
git checkout main
```

### Workflow 4: Feature Completion

#### Merge Feature to Main
```powershell
# Ensure feature branch is up to date
git checkout feature/add-payment-gateway
git pull origin main  # Get latest main changes

# Switch to main
git checkout main

# Merge feature
git merge feature/add-payment-gateway

# Push to remote
git push origin main

# Delete feature branch (optional)
git branch -d feature/add-payment-gateway
git push origin --delete feature/add-payment-gateway
```

#### Create Pull Request (GitHub)
1. Push feature branch
2. Go to GitHub repository
3. Click **"Pull requests"**
4. Click **"New pull request"**
5. Base: `main` ← Compare: `feature/add-payment-gateway`
6. Add title and description
7. Click **"Create pull request"**
8. Review changes
9. Click **"Merge pull request"**
10. Delete branch

---

## Branching Strategy

### Branch Types

#### 1. Main Branch
- **Name**: `main` (or `master`)
- **Purpose**: Production-ready code
- **Rules**: 
  - Never commit directly
  - Only merge tested features
  - Always deployable

#### 2. Feature Branches
- **Name**: `feature/feature-name`
- **Purpose**: New features
- **Examples**:
  - `feature/user-authentication`
  - `feature/product-reviews`
  - `feature/payment-integration`

#### 3. Bugfix Branches
- **Name**: `bugfix/bug-description`
- **Purpose**: Fix bugs
- **Examples**:
  - `bugfix/cart-not-updating`
  - `bugfix/login-error`

#### 4. Hotfix Branches
- **Name**: `hotfix/critical-issue`
- **Purpose**: Urgent production fixes
- **Merge**: Directly to main and develop

### Creating Branches

**Create new branch:**
```powershell
# Create and switch
git checkout -b feature/new-feature

# Or two commands
git branch feature/new-feature
git checkout feature/new-feature
```

**List branches:**
```powershell
# Local branches
git branch

# All branches (including remote)
git branch -a
```

**Switch branches:**
```powershell
git checkout main
git checkout feature/new-feature
```

**Delete branches:**
```powershell
# Delete local branch
git branch -d feature/completed-feature

# Force delete
git branch -D feature/unwanted-feature

# Delete remote branch
git push origin --delete feature/old-feature
```

---

## Push & Pull

### Pushing Code

#### Push to Remote
```powershell
# Push current branch
git push origin branch-name

# Example
git push origin feature/user-auth

# Push main branch
git push origin main

# Set upstream (first time)
git push -u origin feature/new-feature
# Then use: git push
```

#### Force Push (Use Carefully!)
```powershell
# Force push (overwrites remote)
git push -f origin branch-name

# Safer force push (checks remote)
git push --force-with-lease origin branch-name
```

### Pulling Code

#### Pull from Remote
```powershell
# Pull current branch
git pull origin main

# Pull with rebase
git pull --rebase origin main
```

#### Fetch vs Pull
```powershell
# Fetch (download without merging)
git fetch origin

# See what's new
git log origin/main

# Then merge manually
git merge origin/main

# Pull = Fetch + Merge
git pull origin main
```

---

## Collaboration

### Working with Team

#### Fork Workflow
1. **Fork repository** on GitHub
2. **Clone your fork:**
   ```powershell
   git clone https://github.com/yourusername/ThiruSu.git
   ```
3. **Add upstream:**
   ```powershell
   git remote add upstream https://github.com/original/ThiruSu.git
   ```
4. **Sync with upstream:**
   ```powershell
   git fetch upstream
   git merge upstream/main
   ```
5. **Create PR** from your fork

#### Handling Conflicts

**When conflicts occur:**
```powershell
# Pull latest
git pull origin main

# Conflict message appears
# CONFLICT (content): Merge conflict in src/App.jsx

# Open conflicted file
# Look for markers:
<<<<<<< HEAD
Your changes
=======
Their changes
>>>>>>> branch-name

# Edit file, choose correct version
# Remove markers

# Stage resolved file
git add src/App.jsx

# Commit merge
git commit -m "Resolve merge conflict in App.jsx"

# Push
git push origin main
```

### Code Review

#### Before Creating PR
```powershell
# Update from main
git checkout feature/your-feature
git pull origin main

# Run tests
npm test

# Check code quality
npm run lint

# Commit and push
git push origin feature/your-feature
```

#### PR Checklist
- ✅ Code works locally
- ✅ Tests passing
- ✅ No merge conflicts
- ✅ Descriptive title
- ✅ Detailed description
- ✅ Screenshots (if UI changes)

---

## Best Practices

### Commit Messages

#### Format
```
<type>: <short description>

<longer description (optional)>

<footer (optional)>
```

#### Types
- **feat**: New feature
- **fix**: Bug fix
- **docs**: Documentation
- **style**: Formatting, whitespace
- **refactor**: Code restructure
- **test**: Adding tests
- **chore**: Maintenance

#### Examples
```powershell
git commit -m "feat: add user authentication"
git commit -m "fix: resolve cart total calculation error"
git commit -m "docs: update installation guide"
git commit -m "refactor: simplify product API logic"
```

#### Good vs Bad Commits
**Good:**
```
feat: add email validation to signup form
fix: prevent duplicate orders on double-click
docs: add API documentation for chat endpoints
```

**Bad:**
```
update
fix bug
changes
asdf
```

### Git Ignore

#### Create .gitignore
```powershell
# In project root
New-Item .gitignore
```

#### Common Entries
```gitignore
# Dependencies
node_modules/
package-lock.json

# Environment
.env
.env.local
.env.production

# Build output
dist/
build/

# Logs
*.log
npm-debug.log*

# OS files
.DS_Store
Thumbs.db

# IDE
.vscode/
.idea/
*.swp

# Database
*.sql
*.db
```

### Workflow Tips

#### Commit Often
```powershell
# Small, logical commits
git add src/components/NewComponent.jsx
git commit -m "feat: create NewComponent"

git add src/pages/HomePage.jsx
git commit -m "feat: integrate NewComponent in HomePage"
```

#### Pull Before Push
```powershell
# Always pull first
git pull origin main

# Then push
git push origin main
```

#### Use Branches
```powershell
# Don't work directly on main
# Create feature branch
git checkout -b feature/my-feature

# Work on feature
# Commit changes
# Merge when done
```

---

## Troubleshooting

### Common Issues

#### 1. Forgot to Pull Before Push
```powershell
# Error: Updates were rejected
# Solution: Pull first, resolve conflicts, then push
git pull origin main
# Fix conflicts if any
git add .
git commit -m "Merge remote changes"
git push origin main
```

#### 2. Committed to Wrong Branch
```powershell
# On main (by mistake)
# Move last commit to new branch

# Create new branch from current state
git branch feature/my-feature

# Reset main to previous commit
git reset --hard HEAD~1

# Switch to feature branch
git checkout feature/my-feature
```

#### 3. Want to Undo Last Commit
```powershell
# Keep changes, undo commit
git reset --soft HEAD~1

# Discard commit and changes
git reset --hard HEAD~1

# Undo specific file
git checkout -- filename.js
```

#### 4. Accidentally Deleted Files
```powershell
# Restore from last commit
git checkout HEAD -- filename.js

# Restore all deleted files
git checkout HEAD -- .
```

#### 5. Wrong Commit Message
```powershell
# Amend last commit message
git commit --amend -m "New correct message"

# If already pushed
git commit --amend -m "New message"
git push --force-with-lease origin branch-name
```

#### 6. Large Files Error
```powershell
# Error: File too large
# Solution: Use Git LFS or remove file

# Remove from git
git rm --cached large-file.zip

# Add to .gitignore
echo "large-file.zip" >> .gitignore

# Commit
git commit -m "Remove large file"
```

### Checking Status

#### Useful Commands
```powershell
# Current status
git status

# Commit history
git log
git log --oneline
git log --graph --all

# Show changes
git diff
git diff filename.js

# Show specific commit
git show commit-hash

# Who changed what
git blame filename.js
```

---

## Advanced Git

### Stashing Changes

**Save work temporarily:**
```powershell
# Stash changes
git stash

# Stash with message
git stash save "work in progress on feature"

# List stashes
git stash list

# Apply last stash
git stash pop

# Apply specific stash
git stash apply stash@{0}

# Delete stash
git stash drop stash@{0}
```

### Cherry-picking

**Apply specific commit to another branch:**
```powershell
# On feature branch, find commit hash
git log --oneline

# Switch to target branch
git checkout main

# Apply commit
git cherry-pick commit-hash

# Push
git push origin main
```

### Rebasing

**Rewrite commit history:**
```powershell
# Rebase feature on main
git checkout feature/my-feature
git rebase main

# Interactive rebase (last 3 commits)
git rebase -i HEAD~3

# Squash commits
# Edit, reword, squash in editor
```

### Tagging

**Mark releases:**
```powershell
# Create tag
git tag v1.0.0

# Tag with message
git tag -a v1.0.0 -m "Release version 1.0.0"

# Push tags
git push origin v1.0.0
git push origin --tags

# List tags
git tag

# Delete tag
git tag -d v1.0.0
git push origin :refs/tags/v1.0.0
```

---

## GitHub Features

### Issues

**Create issue:**
1. Go to **Issues** tab
2. Click **New issue**
3. Title: "Bug: Cart not updating"
4. Description: Steps to reproduce
5. Assign labels: bug, priority-high
6. Assign to team member
7. Click **Submit**

### Projects

**Create project board:**
1. Go to **Projects** tab
2. Click **New project**
3. Choose template: Kanban
4. Columns: To Do, In Progress, Done
5. Add issues as cards
6. Drag to move status

### GitHub Actions (CI/CD)

**Create workflow:**
```yaml
# .github/workflows/main.yml
name: CI

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  build:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v2
    - name: Setup Node.js
      uses: actions/setup-node@v2
      with:
        node-version: '18'
    - name: Install dependencies
      run: npm install
    - name: Run tests
      run: npm test
    - name: Build
      run: npm run build
```

---

## Quick Reference

### Essential Commands
```powershell
# Setup
git clone <url>                    # Clone repository
git init                           # Initialize git

# Status
git status                         # Check status
git log                            # View history
git diff                           # See changes

# Branches
git branch                         # List branches
git branch <name>                  # Create branch
git checkout <name>                # Switch branch
git checkout -b <name>             # Create & switch
git branch -d <name>               # Delete branch

# Changes
git add .                          # Stage all
git add <file>                     # Stage file
git commit -m "message"            # Commit
git commit --amend                 # Amend commit

# Remote
git remote -v                      # View remotes
git pull origin main               # Pull changes
git push origin main               # Push changes
git fetch origin                   # Fetch updates

# Undo
git reset --soft HEAD~1            # Undo commit
git reset --hard HEAD~1            # Discard commit
git checkout -- <file>             # Discard changes

# Merge
git merge <branch>                 # Merge branch
git rebase <branch>                # Rebase

# Misc
git stash                          # Stash changes
git tag <name>                     # Create tag
git cherry-pick <hash>             # Apply commit
```

---

## You're a Git Pro! 🎓

You now have complete knowledge of Git workflows for ThiruSu Juice Shop.

**Key Takeaways:**
- ✅ Commit often with clear messages
- ✅ Always pull before push
- ✅ Use feature branches
- ✅ Review code before merging
- ✅ Keep main branch clean

**Happy Version Controlling!** 🚀📚
