# Packliste Südafrika 2026 – Students

Eigenständige deutsche Ausgabe, abgeleitet von Irene (Design „Tramonto africano“). 95 Einträge für 2 Monate mit wöchentlicher Wäsche. Zusätzliche Bereiche: Wandern & Berge, Strand & Meer, Campus und Krankenhaus.

App: https://frsfrs147.github.io/sudafrica-2026-packliste/students/

## Bedienung und Installation

Kästchen 0,7 Sekunden halten; per Tastatur Enter oder Leertaste. Suche, Filter, Mengen, Notizen, Hinzufügen, Bearbeiten und Löschen wie in Irene. Auf Android im Browser „Installieren“ bzw. „Zum Startbildschirm hinzufügen“; auf iPhone in Safari Teilen → „Zum Home-Bildschirm“. Zuerst online öffnen, damit die Offline-Dateien gespeichert werden können.

## Zentrale Aktualisierungen ohne Verlust der Häkchen

- Speicher: `packliste_sudafrica_2026_v4_students`. Diese Kennung bei Updates niemals ändern. Keine Übernahme fremder Profile.
- Jeder zentrale Eintrag hat eine dauerhafte ID. Neue IDs werden unmarkiert ergänzt; vorhandene Häkchen, persönliche Texte, Mengen und eigene Einträge bleiben erhalten. Lokal gelöschte bekannte Einträge bleiben gelöscht (`knownBaseIds`).
- `index.html` enthält die zentralen Daten. Neue Einträge zu `PACKLISTE_SEED.items` hinzufügen, ggf. deutsche Texte und Mengen ergänzen. IDs nicht umbenennen oder wiederverwenden. Kategorien bestehender Einträge nicht entfernen, ohne eine Migration zu entwickeln.
- Release-Kennung in `index.html` und `version.json` gemeinsam erhöhen, Cache-Version im Service Worker ebenfalls erhöhen. Alle Dateien gemeinsam veröffentlichen.
- Online-Neuladen holt die aktuelle HTML-Datei (network-first). Beim Öffnen, Wiederverbinden und Zurückkehren prüft die App `version.json` ohne Cache. Eine offene alte Ausgabe meldet ein Update; „Online aktualisieren“ lädt es, sofern kein Bearbeitungsdialog offen ist. Kein unangekündigtes Neuladen während der Eingabe.
- Cache und Service-Worker-Geltungsbereich sind ausschließlich Students zugeordnet. Die vier Originalausgaben werden nicht verändert.

## Grenzen

Keine Konten, Cloud-Synchronisierung oder Sicherung persönlicher Häkchen. Browser, Geräte und ggf. installierte Apps haben getrennte Speicher. Browserdaten löschen, privater Modus, Speicherbereinigung oder App-Deinstallation können Daten entfernen. Ein Quellcode-Archiv sichert keine persönlichen Häkchen. Offline ist erst nach erfolgreicher erster Online-Nutzung verfügbar. Updates benötigen Internet und können durch Hosting-Caches verzögert werden. Zentral entfernte Einträge werden absichtlich nicht automatisch aus persönlichen Listen gelöscht. Gleichzeitiges Bearbeiten in mehreren Tabs wird nicht zusammengeführt.

Die Mengen sind Richtwerte; Klinikbekleidung und Ausrüstung mit der Abteilung abstimmen. Keine individuelle medizinische oder Einreiseberatung. Die App enthält keine Patientendaten.

## Tests am 06.11.2026

`node students/test.cjs` (Node 24): bestanden. Führt den tatsächlichen App-Code mit simuliertem DOM und Speicher aus: 95 eindeutige IDs, neue zentrale Einträge, Erhalt von Häkchen/Texten/eigenen Einträgen/lokalen Löschungen, wiederholtes Laden ohne Duplikate, Schutz beschädigter gespeicherter Daten, deutsche Pflichtinhalte, getrennte Cache-Kennung und Manifest-Scope.

Diese automatisierten Tests ersetzen keine Browser- oder Gerätetests. Physische iPhones und Android-Geräte stehen für diesen Lauf nicht zur Verfügung. Installation, echte Touch-Langdruck-Gesten und Offline-Betrieb auf diesen Geräten sind noch nicht bestätigt. Der lokale Browserzugriff war durch eine Verbindungszeitüberschreitung blockiert; die öffentliche Ausgabe wird nach dem Deployment separat geprüft.
