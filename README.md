<div align="center">
  
  # 💖 Trans Power Assistant v1.7 💖
  
  **Your 100% Offline, Cross-Platform AI Companion**

  [![License: AGPL v3](https://img.shields.io/badge/License-AGPL%20v3-blue.svg)](https://www.gnu.org/licenses/agpl-3.0)
  [![Platform: Windows | Linux | macOS | Android](https://img.shields.io/badge/Platform-Windows%20%7C%20Linux%20%7C%20macOS%20%7C%20Android-lightgrey.svg)]()
  [![AI Model: SmolLM-135M](https://img.shields.io/badge/AI%20Model-SmolLM--135M-purple.svg)]()
  
  *A warm, caring, big-sister-like AI that runs locally on your device with zero data telemetry.*
</div>

---

## ✨ Features

- 🔒 **100% Offline Generation**: No internet required. Your prompts never leave your device. Complete privacy, zero telemetry.
- 🌍 **Truly Cross-Platform**: Natively built for **Windows** (Portable `.exe`), **Android** (APK), **Linux** (DEB, AUR, Tarball), and **macOS**.
- 🫂 **"Sweetheart" Personality**: Custom-tuned system prompts designed to give empathetic, warm, big-sister-like advice and conversation.
- ⚡ **High-Performance Inference**: Uses state-of-the-art WebAssembly & ONNX Runtime backends for incredibly fast token generation on consumer hardware.
- ⌨️ **Stunning CLI Experience**: A beautiful, color-coded terminal interface for developers who prefer living in the command line.
- 📖 **Fully Open Source**: AGPL-3.0 licensed for total transparency and community trust.

---

## 🚀 Quick Install (Command Line)

For developers who want to chat with Sweetheart directly from the terminal without a GUI:

### 🐍 Option 1: Conda Environment (Recommended for Python/Data users)
We provide an `environment.yml` to set up the perfect isolated runtime without messing up your system's Node versions:
```bash
conda env create -f environment.yml
conda activate transpwr
cd desktop
npm install -g .
transpwr
```

### 💻 Option 2: Global NPM Install
If you already have Node.js 20+ installed on your system:
```bash
cd desktop
npm install -g .
transpwr
```

### 🐧 Option 3: Linux One-Liner (Arch/Debian/Ubuntu)
Installs the latest Linux release instantly via terminal:
```bash
curl -fsSL https://raw.githubusercontent.com/Dev2Creator/TransPower-v1.7/main/install.sh | sudo bash
```
*(Arch Linux users can also package this into the AUR using our provided `PKGBUILD` in the `aur/` directory for `yay -S transpwr`)*

---

## 🛠️ Building the Desktop GUI

You can compile the beautiful graphical interface directly from source for your specific OS.

### 🪟 Windows (.exe)
1. Ensure **Node.js** and **npm** are installed.
2. Navigate to the desktop directory and build:
   ```powershell
   cd desktop
   npm install
   .\build-desktop.ps1
   npm run build:win
   ```
3. Your portable executable will be ready in `desktop/dist/`.

### 🐧 Linux (.deb, .tar.gz, pacman)
1. Ensure **Node.js**, **npm**, and **fpm** are installed.
2. Build the packages:
   ```bash
   cd desktop
   npm install
   # Sync web assets manually or via script
   npm run build:linux
   ```

### 🍎 macOS (.dmg, .zip)
*Must be compiled on an actual macOS machine.*
```bash
cd desktop
npm install
npm run build:mac
```

---

## 📱 Building the Android App (APK)

Trans Power also comes with a Capacitor-powered Android app!
1. Install **Android Studio**, the **Android SDK**, and **NDK**.
2. Open PowerShell and navigate to the project directory:
   ```powershell
   cd mobile
   .\sync-web-assets.ps1
   .\build-apk.ps1
   ```
3. Your compiled APKs (`arm64-v8a` and `armeabi-v7a`) will be waiting in `mobile/android/app/build/outputs/apk/release/`.

---

## 📂 Project Architecture

```text
TransPower/
├── 📁 desktop/        # Electron wrapper, CLI interface & Windows/Mac/Linux build config
├── 📁 mobile/         # Capacitor wrapper & Gradle build scripts for Android
├── 📁 aur/            # Arch User Repository (AUR) packaging files (PKGBUILD)
├── 📁 www/            # Shared Web UI and transformers.js logic
│   └── 📁 assets/
│       └── 📁 model/  # The local ONNX AI models and tokenizers (Sweetheart-135M)
└── 📄 environment.yml # Conda environment configuration
```

---

## 👩‍💻 Author & License

Created with love by **Anika Mukherjee** (`cuteypieanika@gmail.com`).

This project is licensed under the **AGPL-3.0 License** - protecting user freedoms and ensuring any modifications remain open source. See the [LICENSE](LICENSE) file for more details.

<div align="center">
  <br />
  <i>"I'm here for you, always." — Sweetheart 💖</i>
</div>
