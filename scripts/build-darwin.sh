#!/bin/sh
set -eu

if [ "$(uname -s)" != "Darwin" ]; then
  echo "Error: build:darwin can only be run on macOS." >&2
  echo "Darwin binaries are rebuilt by package owners on macOS during npm publish." >&2
  exit 1
fi

if ! command -v xcrun >/dev/null 2>&1; then
  echo "Error: xcrun was not found. Install Xcode Command Line Tools with: xcode-select --install" >&2
  exit 1
fi

CLANG="$(xcrun --find clang 2>/dev/null || true)"
if [ -z "$CLANG" ]; then
  echo "Error: Apple clang was not found. Install Xcode Command Line Tools with: xcode-select --install" >&2
  exit 1
fi

SDK_PATH="$(xcrun --sdk macosx --show-sdk-path 2>/dev/null || true)"
if [ -z "$SDK_PATH" ]; then
  echo "Error: macOS SDK was not found. Install Xcode Command Line Tools with: xcode-select --install" >&2
  exit 1
fi

MACOSX_DEPLOYMENT_TARGET="${MACOSX_DEPLOYMENT_TARGET:-11.0}"
ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd -P)"
DARWIN_DIR="$ROOT_DIR/libs/darwin"

build_binary() {
  src="$1"
  out="$2"

  echo "Building ${out#"$ROOT_DIR"/}"
  "$CLANG" \
    -O2 \
    -Wall \
    -isysroot "$SDK_PATH" \
    -mmacosx-version-min="$MACOSX_DEPLOYMENT_TARGET" \
    -arch x86_64 \
    -arch arm64 \
    "$src" \
    -framework AppKit \
    -framework Foundation \
    -o "$out"
  chmod 755 "$out"
}

build_binary "$DARWIN_DIR/fontlist.m" "$DARWIN_DIR/fontlist"
build_binary "$DARWIN_DIR/fontlist2.m" "$DARWIN_DIR/fontlist2"

echo "Built Darwin font helper binaries."
