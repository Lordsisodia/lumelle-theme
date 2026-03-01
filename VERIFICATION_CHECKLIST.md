# 🔍 Verification Checklist

Use these methods to **verify that a claimed fix was actually applied**.

---

## Method 1: Git Diff (Most Reliable)

Shows exactly what changed between branches or commits:

```bash
# Compare current changes vs last commit
git diff HEAD

# Compare develop vs main
git diff main..develop

# Compare specific file
git diff main..develop -- layout/theme.liquid

# Show what changed in last commit
git show HEAD
```

---

## Method 2: Grep with Line Numbers

Find specific patterns with context:

```bash
# Find pattern with line number
grep -n "pattern" file.txt

# Find with 3 lines of context
grep -n -C3 "pattern" file.txt

# Count occurrences
grep -c "pattern" file.txt
```

---

## Method 3: Pattern Count Verification

Verify expected counts:

```bash
# Should be 16 curler entries (8 slash + 8 dash format)
grep -c "curler.*cloudinary" layout/theme.liquid

# Should be 16 towel entries (8 slash + 8 dash format)
grep -c "towel.*cloudinary" layout/theme.liquid
```

---

## Method 4: Show Code Context

Display specific lines:

```bash
# Show lines 100-150
sed -n '100,150p' layout/theme.liquid

# Show lines around a pattern
grep -A5 -B5 "pattern" file.txt
```

---

## Method 5: Git Log

Check commit history:

```bash
# Last 5 commits
git log --oneline -5

# What files changed in last commit
git show --stat HEAD

# Check if commit was pushed
git status
```

---

## Method 6: Before/After Comparison

Always check both states:

```bash
# BEFORE making changes
cp file.txt file.txt.before

# AFTER making changes
diff file.txt.before file.txt
```

---

## Quick Verification Commands

| Task | Command |
|------|---------|
| Check current branch | `git branch` |
| Check uncommitted changes | `git status` |
| See last commit details | `git show HEAD` |
| Verify push completed | `git log origin/branch --oneline -1` |
| Count specific pattern | `grep -c "pattern" file` |
| Show specific lines | `sed -n 'X,Yp' file` |

---

## ⚠️ Always Ask For:

1. **Git diff output** - Shows exactly what changed
2. **Line numbers** - Where the change is
3. **Before/After counts** - Verify the change quantity
4. **Commit hash** - Proof it was committed
5. **Push confirmation** - `git status` showing up to date

---

## Example: Verifying Image Path Fix

```bash
# 1. Check the diff
git diff main..develop -- layout/theme.liquid

# 2. Count entries
grep -c "curler.*cloudinary" layout/theme.liquid  # Should be 16

# 3. Show specific lines
grep -n "uploads-curler-1.webp" layout/theme.liquid

# 4. Verify commit
git log --oneline -1

# 5. Check push
git status
```

---

**Never trust without verifying!** 🔒
