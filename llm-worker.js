// Trans Power V7 - Sweetheart local LLM worker.
// Runs fully offline with a silicon-aware WebGPU -> WASM fallback path.

console.log('Sweetheart Worker: booting local brain...');

const workerBaseUrl = self.location.href.substring(0, self.location.href.lastIndexOf('/') + 1);

try {
  importScripts(workerBaseUrl + 'transformers-v3.min.js');
} catch (err) {
  try {
    importScripts('./transformers-v3.min.js');
  } catch (fallbackErr) {
    self.postMessage({
      status: 'error',
      message: `Sweetheart could not load Transformers.js locally: ${err?.message || fallbackErr?.message || 'unknown import error'}`
    });
  }
}

const { pipeline, env } = (typeof transformers !== 'undefined')
  ? transformers
  : { pipeline: null, env: null };

if (env) {
  env.allowLocalModels = true;
  env.allowRemoteModels = false;
}

const MODEL_NAME = 'Sweetheart-135M';
const pathsToTry = [
  workerBaseUrl + 'assets/model/',
  'assets/model/',
  './assets/model/'
];

let generator = null;
let isReady = false;
let runtime = null;

async function profileDevice() {
  let adapter = null;
  let adapterInfo = {};

  if (navigator.gpu && navigator.gpu.requestAdapter) {
    try {
      adapter = await navigator.gpu.requestAdapter({
        powerPreference: 'high-performance'
      });
      if (adapter && adapter.requestAdapterInfo) {
        adapterInfo = await adapter.requestAdapterInfo().catch(() => ({}));
      }
    } catch (err) {
      adapter = null;
    }
  }

  const ua = navigator.userAgent || '';
  const gpuName = [
    adapterInfo.description,
    adapterInfo.vendor,
    adapterInfo.architecture,
    ua
  ].filter(Boolean).join(' ');

  return {
    hasWebGPU: !!adapter,
    gpuName,
    cores: navigator.hardwareConcurrency || 4,
    memory: navigator.deviceMemory || 4,
    isAndroid: /Android/i.test(ua),
    isSnapdragon: /Adreno|Qualcomm|Snapdragon/i.test(gpuName),
    isMTK: /Mali|PowerVR|MediaTek|MTK|Dimensity|Helio/i.test(gpuName)
  };
}

function chooseRuntime(profile) {
  if (profile.hasWebGPU && profile.memory >= 6 && profile.cores >= 6) {
    return {
      device: 'webgpu',
      dtype: 'q8',
      maxNewTokens: 96,
      mode: profile.isSnapdragon ? 'snapdragon-lite-webgpu' : profile.isMTK ? 'mtk-lite-webgpu' : 'lite-webgpu-performance'
    };
  }

  if (profile.hasWebGPU && profile.memory >= 4) {
    return {
      device: 'webgpu',
      dtype: 'q8',
      maxNewTokens: 64,
      mode: profile.isMTK ? 'mtk-lite-balanced' : 'lite-webgpu-balanced'
    };
  }

  return {
    device: 'wasm',
    dtype: 'q8',
    maxNewTokens: profile.memory <= 3 ? 36 : 56,
      mode: profile.memory <= 3 ? 'lite-battery-saver-wasm' : 'lite-balanced-wasm'
  };
}

function postBrainStatus(status, message, extra = {}) {
  self.postMessage({ status, message, runtime, ...extra });
}

async function initModel() {
  if (!pipeline || isReady) return;

  const profile = await profileDevice();
  runtime = chooseRuntime(profile);

  postBrainStatus(
    'profile',
    `Sweetheart profile: ${runtime.mode}`,
    { profile }
  );

  let lastError = null;

  for (const modelPath of pathsToTry) {
    try {
      env.localModelPath = modelPath;
      postBrainStatus('loading', `Scanning local brain at ${modelPath}`);

      const check = await fetch(`${modelPath}${MODEL_NAME}/config.json`);
      if (!check.ok) continue;

      postBrainStatus('loading', `Loading Sweetheart 135M (${runtime.mode})`);
      generator = await pipeline('text-generation', MODEL_NAME, {
        device: runtime.device,
        dtype: runtime.dtype,
        progress_callback: (x) => {
          if (x.status === 'progress') {
            self.postMessage({
              status: 'progress',
              file: x.file,
              progress: x.progress,
              runtime
            });
          }
        }
      });

      isReady = true;
      postBrainStatus('ready', `Sweetheart local brain ready (${runtime.mode})`);
      return;
    } catch (err) {
      lastError = err;

      if (runtime.device === 'webgpu') {
        runtime = {
          device: 'wasm',
          dtype: 'q8',
          maxNewTokens: 48,
          mode: 'webgpu-fallback-wasm'
        };
        postBrainStatus('loading', 'WebGPU failed. Trying CPU-safe WASM mode.');
        try {
          generator = await pipeline('text-generation', MODEL_NAME, {
            device: runtime.device,
            dtype: runtime.dtype
          });
          isReady = true;
          postBrainStatus('ready', `Sweetheart local brain ready (${runtime.mode})`);
          return;
        } catch (wasmErr) {
          lastError = wasmErr;
        }
      }
    }
  }

  postBrainStatus(
    'error',
    `Sweetheart local brain unavailable: ${lastError?.message || 'model files missing'}`
  );
}

function sanitizeReply(text) {
  let out = String(text || '').trim();
  out = out.replace(/<\|im_end\|>/g, '');
  out = out.replace(/<\|endoftext\|>/g, '');
  out = out.split('<|im_start|>')[0].trim();
  out = out.split('\n').filter(Boolean).slice(0, 3).join('\n');
  if (out.length > 420) out = out.slice(0, 417).trim() + '...';
  return out || 'I am here with you, sweetheart. Tell me one thing you need right now.';
}

function buildPrompt(data) {
  const nameLine = data.name ? `The user's chosen name is ${data.name}.` : '';
  const contextLine = data.context ? `Local app context: ${data.context}` : '';
  const userText = data.prompt || '';

  return `<|im_start|>system
You are Sweetheart AI inside Trans Power.
You are a big caring sister: warm, protective, affirming, grounded, and practical.
Support trans users with emotional care, app navigation, journaling prompts, voice practice encouragement, medication reminders, and safety planning.
Keep replies short, kind, and useful.
Do not be flirty, childish, mean, or dramatic.
For medical, legal, dosage, side-effect, or crisis topics, be careful and encourage a clinician, emergency service, crisis line, or trusted human support when needed.
${nameLine}
${contextLine}
<|im_end|>
<|im_start|>user
${userText}
<|im_end|>
<|im_start|>assistant
`;
}

self.addEventListener('message', async (event) => {
  const data = event.data || {};

  if (data.type === 'init') {
    initModel();
    return;
  }

  if (data.type !== 'generate' || !isReady || !generator) return;

  try {
    postBrainStatus('generating', 'Sweetheart is thinking locally...');
    const output = await generator(buildPrompt(data), {
      max_new_tokens: data.maxNewTokens || runtime?.maxNewTokens || 56,
      temperature: 0.45,
      do_sample: true,
      repetition_penalty: 1.18,
      top_p: 0.9
    });
    const fullText = output?.[0]?.generated_text || '';
    const reply = sanitizeReply(fullText.split('<|im_start|>assistant').pop());
    self.postMessage({ status: 'complete', reply, runtime });
  } catch (err) {
    self.postMessage({
      status: 'error',
      message: err.message,
      runtime
    });
  }
});
