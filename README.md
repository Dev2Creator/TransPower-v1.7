# Trans Power v7

Trans Power v7 is an offline, completely on-device AI assistant application featuring "Sweetheart"—an AI companion designed with a warm, caring "big sister" personality. 

The application utilizes a local Large Language Model running directly on the user's device in the browser/WebView using **Transformers.js**.

## Core Technology
- **Model**: Hugging Face SmolLM 135M (Quantized ONNX format)
- **Inference Engine**: Transformers.js (v3) running WebGL/WASM execution
- **Platform**: Progressive Web App with a native Android wrapper (Capacitor)
- **No Cloud Required**: 100% of data processing, LLM inference, and TTS (Text-to-Speech) happens offline locally.

## Project Structure
- `index.html` / `style.css` / `script-v7.js`: Core web application UI and logic.
- `llm-worker-v7.js` / `tts-worker.js`: Web Workers for running heavy local AI tasks off the main UI thread.
- `assets/model/Sweetheart-135M/`: The quantized ONNX LLM model and its tokenizer configurations.
- `mobile/`: The Capacitor-powered native Android wrapper project.

## Android Build Instructions

The Android wrapper is heavily optimized to keep the final APK size small while bundling the LLM inside the app itself. 

To build the APK, we use an automated PowerShell script that syncs the exact web assets needed and compiles the project via Gradle:

1. Open PowerShell and navigate to the mobile folder:
   ```powershell
   cd mobile
   ```
2. Run the build script:
   ```powershell
   .\build-apk.ps1
   ```

### Build Script Details
- The script automatically calls `sync-web-assets.ps1` to mirror the web app into the Android `assets-v7/public` folder.
- It bypasses stale locked OneDrive files by explicitly ignoring legacy paths.
- The Gradle configuration is optimized for **ABI splits** (`arm64-v8a` and `armeabi-v7a`). This prevents architecture duplication, keeping the bundled app under 100MB.
- Final outputs are generated in: `mobile\android\app\build\outputs\apk\release\`
