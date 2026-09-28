# Lokale Schriften

Ersetzt die Einbindung von Google Fonts über das CDN. Es werden keine Daten
mehr an Google übertragen – der entsprechende Abschnitt in der
Datenschutzerklärung entfällt damit.

## Enthalten

- **Cormorant Garamond** – 400, 500, 600 sowie kursiv 400, 500
- **Lato** – 300, 400, 700
- Subsets: `latin` + `latin-ext` (deckt Deutsch inkl. Umlauten und
  typografischen Zeichen ab; Kyrillisch, Griechisch, Vietnamesisch entfernt)

Eingebunden in `index.html` über `<link rel="stylesheet" href="fonts/fonts.css">`.

## Neu erzeugen / Gewichte ergänzen

1. Ziel-CSS von Google holen (moderner User-Agent → liefert woff2):
   ```
   curl -A "Mozilla/5.0 ... Chrome/120 ..." \
     "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400;1,500&family=Lato:wght@300;400;700&display=swap"
   ```
2. Aus jedem `@font-face` mit Kommentar `/* latin */` oder `/* latin-ext */`
   die `.woff2`-URL herunterladen und lokal speichern.
3. In `fonts.css` die `src: url(...)` auf die lokalen Dateien umbiegen.

Hinweis: `styles.css` verwendet an einigen Stellen `font-weight: 700` für
Cormorant Garamond. Dieses Gewicht ist – wie schon bei der bisherigen
Google-Fonts-Einbindung – nicht geladen; der Browser stellt es synthetisch
dar. Wer echtes Bold möchte, ergänzt `0,700` in der URL oben und legt die
Dateien nach.
