#!/usr/bin/env bash
# Verificările de governance ale DS-ului. Fără argument: DS + toate platformele. Cu php/<nume>: doar acea platformă.
set -euo pipefail
here="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
command -v node >/dev/null || { echo "ds-governance: node lipsește din PATH" >&2; exit 1; }
if [ $# -eq 0 ]; then
  node "$here/score-ds.js" | tail -1
  node "$here/audit-ds.js" | tail -1
  node "$here/audit-inventory.js"
  node "$here/audit-consumers.js"
else
  node "$here/audit-consumers.js" --platform="$1"
fi
