#!/usr/bin/env bash
# Genera/actualiza las baseline de screenshots DENTRO del Docker oficial de
# Playwright, para que coincidan con el runner de CI (mismo font-rendering que
# el macOS/Windows local NO reproduce).
#
# Uso:
#   ./e2e/update-baselines.sh
#
# Requiere Docker corriendo. Commitear el resultado en e2e/__screenshots__/.
set -euo pipefail

IMAGE="mcr.microsoft.com/playwright:v1.61.1-jammy"
cd "$(dirname "$0")/.."

echo "▶ Generando baseline en $IMAGE ..."
docker run --rm \
  -v "$PWD":/work \
  -w /work \
  --ipc=host \
  "$IMAGE" \
  bash -c "npm ci && npm run test:e2e:update"

echo "✓ Baseline actualizadas en e2e/__screenshots__/. Revisa y commitea."
