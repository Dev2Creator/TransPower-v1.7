# Trans Power Assistant v1.7

**Trans Power Assistant** is a cross-platform, 100% offline AI companion app featuring the warm, caring "Sweetheart" personality. Powered entirely by a local, quantized Hugging Face SmolLM-135M ONNX model, it ensures complete privacy and zero data telemetry by running entirely on your device.

## 🚀 Features

- **100% Offline Generation**: No internet required. Your prompts never leave your device.
- **Cross-Platform**: Built natively for Android (APK) and Windows Desktop (Portable `.exe`).
- **Sweetheart Personality**: A customized system prompt designed to give empathetic, warm, big-sister-like advice and conversation.
- **High-Performance Inference**: Uses `transformers.js` combined with an optimized ONNX backend.
- **Privacy First**: Fully AGPL-3.0 licensed for open transparency.

## 📦 Project Structure

- `/mobile` - The Android wrapper powered by Capacitor and Gradle cross-compilation.
- `/desktop` - The Windows Desktop wrapper powered by Electron.
- `/assets/model` - The local ONNX AI models and tokenizers.

## 🛠️ Building the App

### 🤖 Android (APK)

1. Make sure you have Android Studio, the Android SDK, and NDK installed.
2. Open PowerShell and navigate to the project directory.
3. Run the web asset sync script to copy the AI model into the Android bundle:
   ```powershell
   cd mobile
   .\sync-web-assets.ps1
   ```
4. Build the APK via Gradle:
   ```powershell
   .\build-apk.ps1
   ```
5. The compiled APKs (for `arm64-v8a` and `armeabi-v7a`) will be in `mobile/android/app/build/outputs/apk/release/`.

### 🪟 Windows Desktop (.exe)

1. Ensure you have Node.js and `npm` installed.
2. Navigate to the desktop directory and install dependencies:
   ```powershell
   cd desktop
   npm install
   ```
3. Sync the web assets into the desktop package:
   ```powershell
   .\build-desktop.ps1
   ```
4. Build the portable Windows executable using Electron Builder:
   ```powershell
   npm run build:win
   ```
5. The final `.exe` will be generated in `desktop/dist/`.

## 📜 License

This project is licensed under the **AGPL-3.0 License**. See the [LICENSE](LICENSE) file for more details.

## 👩‍💻 Author

Created with love by **Anika Mukherjee** (`cuteypieanika@gmail.com`).
