# 📸 Screenshot Update Instructions

## New Screenshots to Add

You've provided 3 beautiful new screenshots that should replace the old ones:

### Screenshot 1: Create Flip Page
**Filename**: `01-create-flip.png`
- Shows the "Create New Flip" interface
- Beautiful gradient background
- Clear "How it works" instructions
- Professional UI

### Screenshot 2: Leaderboard
**Filename**: `02-leaderboard.png`
- Shows "Top Players" rankings
- #1, #2, #3 with win counts
- Clean, modern design

### Screenshot 3: Active Flips
**Filename**: `03-active-flips.png`
- Shows three flip cards
- Different states: Open, Waiting, Resolved
- Bet buttons visible
- Winner displayed on resolved flip

---

## How to Update

### Step 1: Save Your Screenshots
Save the 3 images you uploaded to:
```
linera-flip-market/screenshots/
├── 01-create-flip.png
├── 02-leaderboard.png
└── 03-active-flips.png
```

### Step 2: Delete Old Screenshots
Remove these old files:
```
screenshots/Screenshot 2025-10-27 152934.jpg
screenshots/Screenshot 2025-10-27 153121.jpg
screenshots/Screenshot 2025-10-27 153154.jpg
```

### Step 3: Update README.md
The README already references:
```markdown
### Create Flip
![Create Flip](screenshots/02-create-flip.png)

### Leaderboard
![Leaderboard](screenshots/03-leaderboard.png)

### Active Flips
![Active Flips](screenshots/01-active-flips.png)
```

Just make sure the filenames match!

### Step 4: Commit Changes
```bash
git add screenshots/
git commit -m "Update screenshots with new high-quality images"
git push origin main
```

---

## Quick Commands (PowerShell)

```powershell
# Navigate to screenshots folder
cd c:\Users\SADAM\OneDrive\Adam\OneDrive\Documents\linera-flip-market\screenshots

# Delete old screenshots
Remove-Item "Screenshot 2025-10-27 152934.jpg"
Remove-Item "Screenshot 2025-10-27 153121.jpg"
Remove-Item "Screenshot 2025-10-27 153154.jpg"

# Then manually save your new images as:
# - 01-active-flips.png (the one with 3 flip cards)
# - 02-create-flip.png (the one with create form)
# - 03-leaderboard.png (the one with top players)
```

---

## ✅ Checklist

- [ ] Save screenshot 1 (Active Flips) as `01-active-flips.png`
- [ ] Save screenshot 2 (Create Flip) as `02-create-flip.png`
- [ ] Save screenshot 3 (Leaderboard) as `03-leaderboard.png`
- [ ] Delete old screenshot files
- [ ] Verify images show in README
- [ ] Commit and push changes

---

**Your new screenshots look amazing! Much more professional! 🎨**
