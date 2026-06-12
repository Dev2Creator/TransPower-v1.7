importScripts('./transformers-v3.min.js');

const { pipeline, env } = transformers;

// We want to fetch the model from HF the first time, then use cache.
env.allowLocalModels = false;
env.allowRemoteModels = true;

let synthesizer = null;
let isReady = false;

async function initTTS() {
    try {
        self.postMessage({ status: 'loading', message: 'Downloading Neural Voice assets... (82MB)' });
        
        // This downloads the Kokoro model AND the WASM phonemizer to IndexedDB
        synthesizer = await pipeline('text-to-speech', 'onnx-community/Kokoro-82M-v1.0-ONNX', {
            device: 'wasm',
            dtype: 'q8', // Quantized to save RAM
            progress_callback: (x) => {
                if (x.status === 'progress') {
                    self.postMessage({ status: 'progress', file: x.file, progress: x.progress });
                }
            }
        });
        
        isReady = true;
        self.postMessage({ status: 'ready', message: 'Neural Voice Online! 🌸' });
    } catch (e) {
        console.error('TTS Worker Error:', e);
        self.postMessage({ status: 'error', message: 'Failed to load Neural Voice: ' + e.message });
    }
}

self.addEventListener('message', async (e) => {
    if (e.data.type === 'init') {
        initTTS();
    } else if (e.data.type === 'speak') {
        if (!isReady || !synthesizer) {
            self.postMessage({ status: 'error', message: 'TTS not ready.' });
            return;
        }
        
        try {
            self.postMessage({ status: 'generating' });
            
            // Kokoro supports multiple voices bundled in the repo
            const output = await synthesizer(e.data.text, {
                voice: 'af_heart' // Default female voice in the Kokoro repo
            });
            
            self.postMessage({
                status: 'complete',
                audio: output.audio,
                sampling_rate: output.sampling_rate
            });
        } catch (err) {
            self.postMessage({ status: 'error', message: 'Synthesis failed: ' + err.message });
        }
    }
});
