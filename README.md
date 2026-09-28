# eleftheri.com — neue Hauptseite

Statische Website für ELEFTHERI. Kein Framework, kein Build-Schritt.
Gedacht für **GitHub Pages**, wie `check.eleftheri.com`.

Texte: `Website/02 Texte & Copy/2026-09-14_website-texte-eleftheri-com.md`

## Struktur

| Datei / Ordner | Zweck |
| --- | --- |
| `index.html` | Startseite mit „Zwei Wege“ und Fragebogen „15 Minuten mit mir“ |
| `styles.css` | Styles, exakte Markenfarben, Kontraste geprüft |
| `script.js` | Navigation, Einblenden, Fragebogen Schritt für Schritt, Einstufungsvorschlag A/B/C |
| `danke/` | Danke-Seite nach dem Absenden (zwei Fassungen: normal und „erst Check“) |
| `impressum/`, `datenschutz/` | Rechtstexte (vor Livegang prüfen lassen) |
| `fonts/` | lokale Schriften (Cormorant Garamond, Lato) — kein Google-CDN |
| `404.html`, `robots.txt`, `sitemap.xml` | Fehlerseite und Suchmaschinen |
| `.nojekyll` | schaltet Jekyll auf GitHub Pages ab |

Keine Cookies, kein Tracking, keine eingebetteten Fremdinhalte, keine Fotos (vorerst).

## Vor dem Livegang — Checkliste

### 1. Brevo: zweites Formular „Gesprächsanfragen“
1. **Kontakte → Einstellungen → Attribute** anlegen (Typ Text):
   `THEMA`, `STAND`, `ZEIT`, `ANLIEGEN`, `KONTAKTWEG`, `TELEFON`, `EINSTUFUNG_VORSCHLAG`
   (`VORNAME` und `SITUATION` gibt es schon)
2. **Liste** „Gesprächsanfragen“ anlegen.
3. **Formular** anlegen → Liste „Gesprächsanfragen“, **ohne Double-Opt-In**, alle Felder oben
   hinzufügen (EINSTUFUNG_VORSCHLAG als verstecktes Feld).
4. ✅ **erledigt am 28.09.2026:** Formular-URL ist in `index.html` eingetragen, Weiterleitung in
   Brevo auf `https://eleftheri.com/danke/` gesetzt. Mit drei Testanfragen geprüft: alle zehn
   Felder kommen an, auch `TELEFON` und `EINSTUFUNG_VORSCHLAG`. Pflichtfelder in Brevo sind nur
   `EMAIL` und `VORNAME` — so geht keine Anfrage verloren.
5. **Automation:** Kontakt zur Liste hinzugefügt → E-Mail senden →
   `Website/05 Technik & Domain/Eingangsbestaetigung Gespraechsanfrage.html`
6. **Benachrichtigung** an mail@eleftheri.com bei jeder neuen Anfrage einschalten.
7. Zwei Testanfragen senden: eine mit „Ich schaue erst mal nur“ (→ C, Check-Tipp), eine mit
   „Entscheidung treffen“ + „3 bis 5 Stunden“ (→ A).

### 2. GitHub
```bash
git add -A
git commit -m "Neue Hauptseite eleftheri.com"
git remote add origin https://github.com/tanjawissel/<repo-name>.git
git push -u origin main
```
Dann im Repo: **Settings → Pages → Branch `main` / Ordner `/`**.
Erst mit der github.io-Adresse testen.

### 3. Domain umziehen (erst ganz zum Schluss)
eleftheri.com zeigt heute noch auf WordPress bei cyon.ch.
1. Datei `CNAME` mit dem Inhalt `eleftheri.com` anlegen und pushen.
2. DNS bei cyon.ch: A-Records auf GitHub Pages (185.199.108.153, .109.153, .110.153, .111.153),
   `www` als CNAME auf `tanjawissel.github.io`. **`check` nicht anfassen.**
3. In GitHub Pages „Enforce HTTPS“ aktivieren.
4. Impressum-/Datenschutz-Links in beiden E-Mails auf eleftheri.com umstellen.
5. WordPress erst abschalten, wenn die neue Seite unter eleftheri.com läuft.

### 4. Rechtliches
Impressum und Datenschutzerklärung sind Entwürfe nach Vorlage der Check-Seite, ergänzt um die
Gesprächsanfrage (Brevo, Speicherdauer 6 Monate, Hinweis auf Gesundheitsdaten).
**Vor dem Livegang fachlich prüfen lassen.**

## Fragebogen — Einstufungsvorschlag

| Vorschlag | Regel | Sichtbar für Besucher |
| --- | --- | --- |
| **C** | „Ich schaue erst mal nur“ **oder** „erst verstehen“ **oder** „eigentlich keine“ Zeit | Tipp: erst Freiheits-Check |
| **A** | „Entscheidung treffen“ **und** 3 Stunden oder mehr | normale Bestätigung |
| **B** | alles andere | normale Bestätigung |

Jede Anfrage wird gesendet. Der Vorschlag ersetzt nicht die Einstufung im Vertriebssystem.
