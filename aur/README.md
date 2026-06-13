# AUR Publishing Guide

To publish Trans Power to the Arch User Repository (AUR), run these commands on your Arch Linux machine:

### 1. Make sure you have the required tools installed
```bash
sudo pacman -S base-devel git
```

### 2. Generate the package metadata
```bash
cd aur
makepkg --printsrcinfo > .SRCINFO
```

### 3. Clone your AUR repository
Replace `transpwr-bin` with your actual package name if different.
```bash
cd ..
git clone ssh://aur@aur.archlinux.org/transpwr-bin.git
```

### 4. Copy files and push
```bash
cp aur/PKGBUILD transpwr-bin/
cp aur/.SRCINFO transpwr-bin/
cd transpwr-bin
git add PKGBUILD .SRCINFO
git commit -m "Initial release v1.7.0"
git push
```
