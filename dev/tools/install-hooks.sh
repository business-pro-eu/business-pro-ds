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
# Copiile din modules/ nu se editează în platformă (se schimbă modulul): blochează doar copiile editate sau lipsă.
mods="\$(git rev-parse --show-toplevel)/../../modules/tools/modules.php"
if [ -n "$1" ] && [ -f "\$mods" ]; then
  php "\$mods" check "\$(basename "\$(git rev-parse --show-toplevel)")" --edits-only --quiet || { echo "Modules hook: o copie din modules/ a fost editată în platformă. Schimbă modulul și rulează: php modules/tools/modules.php update" >&2; exit 1; }
fi
EOF
}

install() { # $1 = dir repo, $2 = argument pentru ds-governance.sh, $3 = calea către tools/ relativ la rădăcina repo-ului
  local hooks="$1/.git/hooks"
  [ -d "$hooks" ] || { echo "sar peste $1 (nu e repo git)"; return; }
  for h in pre-commit pre-push; do hook_body "$2" "$3" > "$hooks/$h"; chmod +x "$hooks/$h"; done
  echo "hook-uri instalate în $1"
}

for p in bookings crm domain-tools fleet idp profit pusculita; do
  install "$root/php/$p" "php/$p" "../../ds/dev/tools"
done
install "$root/ds" "" "dev/tools"
