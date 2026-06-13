#!/bin/bash
set -e

echo "🌸 Welcome to the Trans Power Assistant Installer 🌸"
echo "==================================================="
echo "This script will download and install the latest Linux release."

# Define variables
REPO="Dev2Creator/TransPower-v1.7"
INSTALL_DIR="/opt/transpwr"
BIN_DIR="/usr/local/bin"

# Ensure running as root for system-wide install
if [ "$EUID" -ne 0 ]; then
  echo "❌ Please run this script with sudo or as root to install."
  exit 1
fi

echo "✨ Fetching the latest release..."
# Note: For this to work, you must upload the transpwr-1.7.0.tar.gz to your GitHub Releases
DOWNLOAD_URL="https://github.com/$REPO/releases/download/v1.7.0/transpwr-1.7.0.tar.gz"

echo "📥 Downloading Trans Power..."
mkdir -p /tmp/transpwr_install
curl -fsSL "$DOWNLOAD_URL" -o /tmp/transpwr_install/transpwr.tar.gz

echo "📦 Extracting files..."
rm -rf "$INSTALL_DIR"
mkdir -p "$INSTALL_DIR"
tar -xzf /tmp/transpwr_install/transpwr.tar.gz -C "$INSTALL_DIR" --strip-components=1

echo "🔗 Creating shortcuts..."
ln -sf "$INSTALL_DIR/transpwr" "$BIN_DIR/transpwr"

echo "🧹 Cleaning up..."
rm -rf /tmp/transpwr_install

echo ""
echo "✅ Trans Power installed successfully!"
echo "Type 'transpwr' in your terminal to start the assistant."
