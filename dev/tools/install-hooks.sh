#!/usr/bin/env bash
# Instalează hook-urile git pre-commit și pre-push care rulează verificările DS (în fiecare platformă și în repo-ul DS).
# Nu pot fi ocolite din greșeală: pentru o excepție reală se editează tools/consumer-allowlist.json, cu motiv.
set -euo pipefail
here="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
root="$(cd "$here/../../.." && pwd)"

hook_body() { # $1 = argument pentru ds-governance.sh ("" = tot)
cat <<EOF
#!/usr/bin/env bash
# Instalat de ds/dev/tools/install-hooks.sh — verificări DS (fără CSS local).
gov="\$(git rev-parse --show-toplevel)/$2/ds-governance.sh"
if [ ! -f "\$gov" ]; then echo "DS hook: nu găsesc \$gov (repo-ul DS trebuie clonat la ../../ds față de platformă)." >&2; exit 1; fi
bash "\$gov" $1 || { echo "DS hook: încălcare a regulii „doar design system”. Creează stilul în DS, nu local." >&2; exit 1; }
EOF
}

install() { # $1 = dir repo, $2 = argument pentru ds-governance.sh, $3 = calea către tools/ relativ la rădăcina repo-ului
  local hooks="$1/.git/hooks"
  [ -d "$hooks" ] || { echo "sar peste $1 (nu e repo git)"; return; }
  for h in pre-commit pre-push; do hook_body "$2" "$3" > "$hooks/$h"; chmod +x "$hooks/$h"; done
  echo "hook-uri instalate în $1"
}

for p in crm domain-tools fleet profit pusculita; do
  install "$root/php/$p" "php/$p" "../../ds/dev/tools"
done
install "$root/ds" "" "dev/tools"
