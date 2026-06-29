<div align="center">

# Trans Power™ V7 🏳️‍⚧️

### Private tools. Affirming knowledge. A softer place to land.

An offline-first personal companion, learning library, wellness space, voice lab, and private tracker built for trans people and anyone exploring gender safely.

[![Platform](https://img.shields.io/badge/platform-PWA%20%7C%20Android-E47C55?style=flat-square)](#run-the-app)
[![Local AI](https://img.shields.io/badge/AI-Sweetheart--135M-D7C0AA?style=flat-square)](#sweetheart-local-ai)
[![Capacitor](https://img.shields.io/badge/mobile-Capacitor%208-614B39?style=flat-square)](#android-build)
[![Privacy](https://img.shields.io/badge/design-offline--first-3478F6?style=flat-square)](#privacy-and-local-data)

[Run](#run-the-app) · [Explore](#what-is-inside) · [AI](#sweetheart-local-ai) · [Android](#android-build) · [Safety](#health-and-safety)

</div>

---

    ████████╗██████╗  █████╗ ███╗   ██╗███████╗
    ╚══██╔══╝██╔══██╗██╔══██╗████╗  ██║██╔════╝
       ██║   ██████╔╝███████║██╔██╗ ██║███████╗
       ██║   ██╔══██╗██╔══██║██║╚██╗██║╚════██║
       ██║   ██║  ██║██║  ██║██║ ╚████║███████║
       ╚═╝   ╚═╝  ╚═╝╚═╝  ╚═╝╚═╝  ╚═══╝╚══════╝

Trans Power turns a browser or Android WebView into a private sanctuary. It combines practical gender education, local journaling and tracking, guided wellness, voice analysis, and Sweetheart—a caring companion that can run from bundled local model files.

## Run the app

Install through the IRL command center when the Trans Power package is available:

    irl install transpower

For local web development, serve the folder over HTTP so workers, the service worker, and model assets can load correctly:

    python -m http.server 8080

Then open:

    http://localhost:8080

Opening `index.html` directly with `file://` may prevent browser workers and local model loading.

## What is inside

| Space | What you get |
|---|---|
| First launch | Chosen name, pronouns, voice preference, and local setup |
| Home | Daily affirmation, goal, mood check-in, streak, and activity stats |
| Learn | Terms, HRT information, myth checks, timelines, and coming-out guidance |
| Glow | Goal-based style and presentation guidance |
| Sweetheart | Supportive chat with local and fallback response modes |
| Wellness | Breathing, journal, mood history, mindfulness, side-effect notes, and safety plan |
| Voice | Browser-based voice measurements, sessions, calibration, and coaching |
| Medication | Medication, dose, supply, and side-effect tracking |
| Privacy | Local export/import, stealth behavior, and optional PIN gate |
| Mobile | Capacitor Android wrapper with optimized ABI builds |

The interface uses deep glassy surfaces, trans-flag accents, animated ambient texture, touch-friendly cards, and the warm, human-first writing style shared across the IRL ecosystem.

## Sweetheart local AI

The bundled worker searches for `Sweetheart-135M` model files under `assets/model/` and selects a runtime based on device capability:

    WebGPU when available
    └── WASM fallback for wider compatibility

The model runs in a Web Worker so generation does not freeze the main interface. A classic rule-based offline engine remains available when the local model cannot load.

Some optional response and voice paths can make network requests when connectivity is available. The app falls back to local behavior when those requests fail. If you require a fully air-gapped session, disconnect the device and verify the local model is present before relying on AI features.

## Privacy and local data

Personal app state is stored in browser/WebView `localStorage` using `tp_` keys, including the chosen profile, journal entries, mood history, medication records, voice sessions, and safety-plan fields.

The settings tools can export and import this local state. Treat exported files as sensitive: they may contain deeply personal information.

A local PIN gate is a convenience barrier on the device. It is not a substitute for full-device encryption, a strong operating-system lock, or separate user accounts.

## Offline behavior

The service worker caches the application shell for repeat visits. The local text-generation model is bundled for offline use, while neural voice assets may be downloaded and cached separately depending on the selected mode.

| Capability | Offline behavior |
|---|---|
| Journal, mood, safety plan, trackers | Local |
| Learning library and classic responses | Local |
| Sweetheart 135M | Local when model assets and runtime load |
| Browser speech synthesis | Device/browser dependent |
| Optional neural or network-assisted paths | May require a connection |

## Android build

Requirements:

- Node.js and npm
- Java/JDK compatible with the Android build
- Android SDK
- PowerShell on the build machine

From the `mobile` directory:

    npm install
    npm run build:apk

The build script syncs the required web assets and calls Gradle. Release APK outputs are written under:

    mobile/android/app/build/outputs/apk/release/

ABI splits are configured for `arm64-v8a` and `armeabi-v7a` to avoid bundling both architectures into one oversized APK.

## Project structure

    v7
    ├── index.html              application shell and views
    ├── style.css              visual system and responsive layout
    ├── script-v7.js           profile, trackers, wellness, and interaction logic
    ├── data.js                curated local knowledge and classic responses
    ├── llm-worker-v7.js       local Sweetheart text-generation worker
    ├── tts-worker.js          optional neural voice worker
    ├── sw.js                  offline application-shell cache
    ├── assets/model/          bundled local model files
    └── mobile/                Capacitor Android wrapper and build scripts

## Health and safety

Trans Power is an educational and self-reflection tool. It is not a doctor, therapist, crisis service, medication prescriber, diagnostic system, or replacement for qualified care.

HRT timelines and side-effect tools are general information and personal notes—not medical instructions. Do not start, stop, or change medication based only on this app. Seek a qualified clinician for individualized advice.

If you may be in immediate danger or at risk of harming yourself, contact local emergency services or a trusted crisis resource in your region. A saved safety plan can support you, but it cannot provide emergency intervention.

## Author

Created by **Anika Mukherjee**

Email: [cuteypieanika@gmail.com](mailto:cuteypieanika@gmail.com)

GitHub: [@Dev2Creator](https://github.com/Dev2Creator)

## Copyright and trademark

Copyright © 2026 Anika Mukherjee. All rights reserved.

**Trans Power™** is a trademark of Anika Mukherjee.

Third-party libraries and models remain subject to their respective licenses and terms.

---

<div align="center">

Built as a reminder that privacy, softness, and self-knowledge can belong in the same app. 🏳️‍⚧️

</div>
