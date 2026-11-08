# Reguli de proiect (ds)


## Commit după fiecare sarcină (obligatoriu)
Regulă pentru orice asistent AI (Claude, ChatGPT/Codex, Gemini) care lucrează în acest repo.

- La finalul **fiecărei sarcini încheiate** (cod, markup, configurație versionată, documentație) faci `git commit` în repo-ul respectiv, **înainte** să spui că ai terminat. Nu lăsa modificări necomise între sarcini.
- Un commit per sarcină logică, cu mesaj clar în română: ce s-a schimbat și de ce. Nu amesteca sarcini diferite într-un commit.
- Doar commit local. **Nu face `git push`** fără cerere explicită.
- Fiecare platformă e un repo separat (`ds`, `crm`, `profit`, `fleet`, `domain-tools`, `pusculita`, `bookings`). Dacă o sarcină atinge mai multe (de exemplu DS + o platformă), comiți în fiecare repo separat.
- Nu comite secrete sau date de rulare: `config.php`, `.env*`, `secrets/`, `data/`, `logs/`, `uploads/`, cache-uri, arhive (`.zip`), dump-uri. Dacă apare un fișier nou de acest fel, adaugă-l în `.gitignore` sau întreabă.
- Nu folosi `--no-verify`. Dacă hook-ul `pre-commit` (verificarea DS) blochează, raportează încălcarea. Ocolirea e permisă doar la cererea explicită a utilizatorului, iar motivul se scrie în mesajul commit-ului.
- Înainte să închei sarcina verifică: `git status` fără modificări necomise (în afara fișierelor excluse intenționat) și `git log -1` arată commit-ul tău.
