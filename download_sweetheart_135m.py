import os
import shutil
import sys
from pathlib import Path


ROOT = Path(__file__).resolve().parent
TARGET = ROOT / "assets" / "model" / "Sweetheart-135M"
REPO_ID = "HuggingFaceTB/SmolLM-135M-Instruct"


def main():
    try:
        from huggingface_hub import snapshot_download
    except ImportError as exc:
        print("Missing huggingface_hub. Install it with:")
        print("python -m pip install --target pydeps huggingface_hub")
        raise SystemExit(1) from exc

    tmp = ROOT / ".model-download" / "Sweetheart-135M"
    if tmp.exists():
        shutil.rmtree(tmp)
    tmp.mkdir(parents=True, exist_ok=True)

    print(f"Downloading fresh model from {REPO_ID}")
    print(f"Temporary folder: {tmp}")

    snapshot_download(
        repo_id=REPO_ID,
        local_dir=str(tmp),
        local_dir_use_symlinks=False,
        allow_patterns=[
            "config.json",
            "generation_config.json",
            "tokenizer.json",
            "tokenizer_config.json",
            "special_tokens_map.json",
            "chat_template.jinja",
            "onnx/model_quantized.onnx",
        ],
    )

    required = tmp / "onnx" / "model_quantized.onnx"
    if not required.exists():
        print("Fresh repo did not contain onnx/model_quantized.onnx.")
        print("Downloaded files:")
        for path in sorted(tmp.rglob("*")):
            if path.is_file():
                print(f"- {path.relative_to(tmp)}")
        raise SystemExit(2)

    if TARGET.exists():
        backup = TARGET.with_name("Sweetheart-135M.previous")
        if backup.exists():
            shutil.rmtree(backup)
        TARGET.rename(backup)
        print(f"Previous model moved to {backup}")

    TARGET.parent.mkdir(parents=True, exist_ok=True)
    tmp.rename(TARGET)
    size_mb = (TARGET / "onnx" / "model_quantized.onnx").stat().st_size / (1024 * 1024)
    print(f"Sweetheart 135M ready: {TARGET}")
    print(f"Quantized ONNX size: {size_mb:.1f} MB")


if __name__ == "__main__":
    main()
