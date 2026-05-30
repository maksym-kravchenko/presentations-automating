---
title: "PC Healthcheck Dashboard"
author: "Maksym Kravchenko"
date: "28.05.2026"
subject: "Projekt-Logbuch"
company: "M122: Abläufe mit Script/Makros automatisieren"
theme: "custom-slidev-theme-2"
---
# Projekt-Logbuch – PowerShell Gaming Healthcheck

## Inhaltsverzeichnis

- [Kapitel 1 – Idee](#kapitel-1--idee)
- [Kapitel 2 – Umsetzung](#kapitel-2--umsetzung)
- [Kapitel 3 – Vertiefung](#kapitel-3--vertiefung)
- [Kapitel 4 – Learnings](#kapitel-4--learnings)

---

# Kapitel 1 – Idee

Mein Projekt ist ein kleines Tool für Windows, das ich **PC Gaming Health Dashboard** nenne. Es ist ein PowerShell-Script, das ein Fenster öffnet und mir live anzeigt, wie es meinem Gaming-PC gerade geht. Also CPU-Auslastung, RAM, GPU, Temperaturen, Festplatte und das WLAN.

Die Grundidee ist der Performance-Tab im Task Manager. Den schaue ich beim Zocken an, wenn ein Spiel ruckelt oder der Lüfter laut wird. Der Task Manager zeigt aber ziemlich viel an und ist nicht auf Gaming ausgelegt. Ich wollte etwas Schlankeres, das mir auf einen Blick zeigt: läuft alles sauber oder gibt es ein Problem.

Ohne das Tool müsste ich mehrere Stellen von Hand prüfen. Auslastung, Temperatur über ein Zusatzprogramm, dann die WLAN-Verbindung und so weiter. Das Script nimmt mir das ab. Es liest die Werte selber aus und aktualisiert sie jede Sekunde. Dazu kommt eine Warnzeile unten im Fenster. Wenn ein Wert zu hoch wird, zum Beispiel die CPU über 90 Prozent oder die GPU-Temperatur über 85 Grad, wechselt die Zeile von "All systems nominal" auf eine Warnung.

Ich habe die Idee gewählt, weil ich selber gerne zocke und wissen wollte, woher der Task Manager diese Werte überhaupt nimmt. Beim Recherchieren habe ich gemerkt, dass Windows die Daten über WMI und Performance Counter bereitstellt und dass man die mit PowerShell abfragen kann. Das fand ich spannend, weil ich PowerShell vorher nur für kleine Befehle benutzt habe und nie für ein richtiges Projekt mit Oberfläche.

**Welche Probleme das Tool lösen soll:**

- Man sieht den Zustand vom PC auf einen Blick, ohne mehrere Programme zu öffnen.
- Man wird gewarnt, wenn etwas heiss läuft oder ausgelastet ist.
- Es braucht keine Installation und keine Adminrechte für die Grundfunktionen.

Für Gamer ist das nützlich, weil man so sieht, ob ein Ruckler vom Spiel kommt oder ob zum Beispiel der RAM voll ist oder die GPU zu heiss wird. Mit dem Dashboard auf dem zweiten Monitor sieht man das sofort.

> **Kleine Reflexion:** Am Anfang dachte ich, das wird ein Wochenend-Projekt. Es ist dann doch grösser geworden, vor allem wegen der Oberfläche. Aber genau das hat es interessant gemacht.

---

# Kapitel 2 – Umsetzung

Ich habe das Projekt in vier Meilensteine aufgeteilt: Analyse, Entwurf, Programmierung und am Schluss Integration und Qualitätssicherung. So konnte ich Schritt für Schritt vorgehen und musste nicht alles auf einmal lösen.

## Meilenstein 1 – Analyse

Bevor ich angefangen habe zu programmieren, habe ich erst überlegt, was das Script eigentlich genau können soll. Dafür habe ich die 6W-Fragen benutzt. Das hat mir geholfen, die Aufgabe klar zu machen.

| Frage | Antwort |
|---|---|
| **Was** soll es tun? | Wichtige PC-Werte (CPU, RAM, GPU, Festplatte, WLAN, Temperaturen) live anzeigen und bei Problemen warnen. |
| **Wer** nutzt es? | Ich selber und andere Gamer, die ihren PC beim Zocken im Auge behalten wollen. |
| **Wann / wie oft** läuft es? | Solange das Fenster offen ist. Es aktualisiert sich jede Sekunde. |
| **Wo** läuft es? | Lokal auf einem Windows-10- oder 11-PC, ohne Installation. |
| **Womit** liest es die Daten? | Mit PowerShell über WMI, Performance Counter und kleine Hilfsprogramme. |
| **Warum** braucht man es? | Der Task Manager zeigt zu viel an. Ich wollte etwas Schlankes nur für Gaming. |

**Eingaben und Ausgaben:** Das Script bekommt seine "Eingaben" nicht von der Tastatur, sondern direkt vom System. Es fragt die Sensoren und Zähler von Windows ab. Die Ausgabe ist das Fenster mit den Karten, den Fortschrittsbalken und der Warnzeile unten.

**Sonderfälle, die ich beachten musste:**

- Nicht jeder PC hat eine NVIDIA-GPU, also muss ich mehrere Wege für die GPU vorsehen.
- Die Temperatur gibt es ohne Zusatzprogramm oft gar nicht. Dann muss "-- C" stehen statt ein Fehler.
- Eine einzelne fehlerhafte Abfrage darf nicht das ganze Tool stoppen.

**Ergebnis** waren ein paar klare Anforderungen: jede Sekunde aktualisieren, ohne Installation laufen, ohne Adminrechte für die Grundwerte, und bei CPU/RAM/Disk über 90 Prozent oder GPU-Temperatur über 85 Grad warnen.

> Hier habe ich am Anfang zu schnell loslegen wollen. Erst als ich die Sonderfälle aufgeschrieben hatte, war mir klar, wie viel die GPU eigentlich kostet.

## Meilenstein 2 – Entwurf

Danach habe ich den Ablauf vom Script aufgezeichnet, bevor ich Code geschrieben habe. So sieht man die Logik vor sich und merkt schon beim Zeichnen, wo Entscheidungen nötig sind. Ich habe einen Programmablaufplan (PAP) gemacht: Ovale für Start und Ende, Rechtecke für Aktionen und Rauten für Entscheidungen.

Der grobe Ablauf ist: Fenster laden, Module starten, dann läuft jede Sekunde der gleiche Kreislauf. Werte holen, prüfen ob ein Wert zu hoch ist, Anzeige aktualisieren, kurz warten und wieder von vorne.

_Hier kommt mein Programmablaufplan rein:_

![Screenshot Programmablaufplan (PAP)](screens/pap.png)

> Das Zeichnen war zuerst mühsam, weil ich dachte, ich verliere Zeit. Aber beim Programmieren ging es danach viel schneller, weil ich den Plan einfach abarbeiten konnte.

## Meilenstein 3 – Programmierung

Jetzt habe ich den Ablauf aus dem Entwurf in PowerShell umgesetzt. Ich wollte nicht alles in eine riesige Datei schreiben, sondern es sauber aufteilen. Also gibt es eine Startdatei und Module im Ordner `src`: Themes für die Farben, Monitors für das Auslesen der Daten und Dashboard für das Fenster. Die Startdatei lädt die Teile über den Punkt-Operator (Dot-Sourcing), so sind die Funktionen danach überall verfügbar.

```powershell
Add-Type -AssemblyName PresentationFramework

# Module der Reihe nach laden (Reihenfolge ist wichtig)
. "$PSScriptRoot\src\Themes.ps1"
. "$PSScriptRoot\src\Monitors.ps1"
. "$PSScriptRoot\src\Dashboard.ps1"
```

Für jede Messung habe ich eine eigene Funktion gemacht, die nur den Wert zurückgibt und nichts von der Anzeige weiss. Die CPU-Auslastung hole ich zum Beispiel über einen Performance Counter. Beim ersten Aufruf liefert der immer 0, deshalb werfe ich den ersten Wert weg.

```powershell
$cpuCounter = New-Object System.Diagnostics.PerformanceCounter(
                  "Processor", "% Processor Time", "_Total")
$null = $cpuCounter.NextValue()   # erster Wert ist immer 0, also weg damit

function Get-CpuPct {
    if ($cpuCounter) {
        try { return [int]$cpuCounter.NextValue() } catch { }
    }
    return 0
}
```

Damit das Fenster sich von selber aktualisiert, läuft ein Timer, der jede Sekunde die Update-Funktion aufruft. Das ist die Schleife aus meinem Entwurf.

```powershell
$timer          = New-Object System.Windows.Threading.DispatcherTimer
$timer.Interval = [TimeSpan]::FromSeconds(1)
$timer.Add_Tick({ Update-Dashboard })
$timer.Start()
```

Wichtig war mir, nichts fest zu verdrahten. Pfade baue ich immer relativ zum Script-Ordner mit `$PSScriptRoot` zusammen, nie als fester Pfad wie `C:\Users\...`. Sonst würde das Script auf einem anderen PC nicht mehr laufen. Auch die Farben und Schwellenwerte stehen an einer Stelle, damit man sie leicht ändern kann.

**Problem und Lösung:** Die GPU war der schwierigste Teil. Es gibt nicht den einen Weg, der bei jeder Grafikkarte funktioniert. NVIDIA hat ein eigenes Tool namens `nvidia-smi`, AMD und Intel nicht. Ich habe darum mehrere Wege nacheinander eingebaut: zuerst `nvidia-smi`, dann die GPU-Counter von Windows und zuletzt OpenHardwareMonitor. Sobald einer klappt, gebe ich den Wert zurück.

> Das war am Anfang verwirrend, weil ich auf meinem Laptop einen anderen GPU-Typ habe als auf dem Desktop. Erst da habe ich gemerkt, dass ich mehrere Fälle abdecken muss.

![Screenshot Meilenstein 3](screens/meilenstein3.png)

## Meilenstein 4 – Integration und Qualitätssicherung

Zum Schluss habe ich überlegt: Wenn ich das Script nächste Woche einer Kollegin gebe, was muss dann dazugehören, damit sie es ohne mich benutzen kann?

**Integration:** Mein Tool ist bewusst portabel. Es ist nur eine `.ps1`-Datei mit den Modulen daneben, kein Installer und kein Hintergrunddienst. Man kann den Ordner einfach kopieren. Gestartet wird es mit `-ExecutionPolicy Bypass`, damit Windows das Script erlaubt, ohne dass man die Einstellung dauerhaft ändern muss. Wer will, legt eine Verknüpfung in den Autostart-Ordner (`shell:startup`), dann öffnet sich das Dashboard bei jedem Login. Diesen Weg habe ich gewählt, weil das Tool keine Adminrechte braucht und ein automatischer Start beim Login besser passt als eine geplante Aufgabe.

**Qualitätssicherung:** Damit das Tool stabil läuft, habe ich zwei Sachen gemacht. Erstens steckt die ganze Update-Funktion in einem `try`-Block. Wenn eine einzelne Abfrage einen Fehler wirft, läuft der Timer trotzdem weiter und friert nicht ein.

```powershell
function Update-Dashboard {
  try {
      # alle Werte holen und anzeigen ...
  } catch {
      # einzelner Fehler soll den Timer nicht stoppen
      $txtAlerts.Text = "WARNING: tick error - $($_.Exception.Message)"
  }
}
```

Zweitens habe ich die Sonderfälle aus der Analyse getestet, zum Beispiel einen PC ohne NVIDIA-GPU. Dort zeigt das Tool sauber "-- C" statt abzustürzen. Ausserdem frage ich langsame Werte nicht jede Sekunde ab, sondern nur alle paar Ticks. Das hat die Last gesenkt.

| Wie oft | Welche Werte |
|---|---|
| Jede Sekunde | CPU, RAM, GPU, Netzwerk, Uhr |
| Alle 3 Sekunden | Temperaturen, WLAN |
| Alle 5 Sekunden | Festplatte |
| Alle 10 Sekunden | Laufzeit vom System |

Dazu gehört auch eine `README.md` mit einer kurzen Installations- und Startanleitung, damit jemand anders das Tool ohne Nachfragen benutzen kann.

> Auf die Idee mit dem Tick-Zähler bin ich am meisten stolz. Es ist ein einfacher Trick, aber er hat die CPU-Last spürbar gesenkt.

![Screenshot Meilenstein 4](screens/meilenstein4.png)

---

# Kapitel 3 – Vertiefung

In diesem Kapitel gehe ich auf drei Kompetenzbänder genauer ein und zeige sie direkt an meinem Script.

> _Hinweis für mich selber: Die Texte sind so geschrieben, dass ich sie für das Fachgespräch leicht anpassen kann._

## Kompetenzband 1: G – Funktionen

In meinem Script habe ich fast alle wiederkehrende Logik in Funktionen ausgelagert. Ein gutes Beispiel ist `Format-Bytes`. Diese Funktion bekommt eine Zahl in Bytes und gibt einen lesbaren Text zurück, also "16.0 GB" statt einer riesigen Zahl. Ich brauche das beim RAM und bei der Festplatte, also an mehreren Stellen.

```powershell
function Format-Bytes {
    param([double]$bytes)
    if ($bytes -ge 1GB) { return "{0:F1} GB" -f ($bytes / 1GB) }
    if ($bytes -ge 1MB) { return "{0:F1} MB" -f ($bytes / 1MB) }
    return "{0:F0} KB" -f ($bytes / 1KB)
}
```

Hier sieht man auch Parameter und Rückgabewert. Der Parameter wird im `param()`-Block deklariert, den Rückgabewert gebe ich mit `return` zurück. Beim Aufruf übergebe ich den Wert hinter dem Funktionsnamen: `Format-Bytes $ramUsed`. Andere Funktionen wie `Get-GpuInfo` geben sogar eine ganze Hashtable mit Auslastung und Temperatur zurück, so hole ich mehrere zusammengehörende Werte mit einem Aufruf.

> Was ich gelernt habe: Eine Funktion sollte möglichst eine Sache tun. Die Monitor-Funktionen holen nur Daten und kümmern sich nicht um die Anzeige. Das hat das Testen einfacher gemacht.

## Kompetenzband 2: E – Bedingungen

Bedingungen sind überall, weil das Tool ständig entscheiden muss, was es anzeigt und ob es warnen soll. Das deutlichste Beispiel sind die Schwellenwerte für die Farbe:

```powershell
function Get-UsageBrush {
    param([int]$pct, [string]$accent)
    if ($pct -ge 90) { return ConvertTo-Brush "#ff6188" }   # rot ab 90%
    if ($pct -ge 70) { return ConvertTo-Brush "#ffd866" }   # gelb ab 70%
    return ConvertTo-Brush $accent                          # sonst normale Farbe
}
```

Ich prüfe auch oft, ob ein Wert überhaupt vorhanden ist, bevor ich ihn benutze. Bei der GPU kann es sein, dass gar keine Temperatur kommt. Dann darf ich nicht blind anzeigen:

```powershell
if ($null -ne $gpu.Temp) {
    $txtGpuTemp.Text = "$($gpu.Temp) C"
    if ($gpu.Temp -ge 85) { $alerts += "GPU TEMP $($gpu.Temp)C" }
} else {
    $txtGpuTemp.Text = "-- C"
}
```

Und der Tick-Zähler ist auch eine Bedingung: mit `$script:tick % 5 -eq 0` prüfe ich über einen Rechenrest, ob gerade der fünfte Tick dran ist.

> Am Anfang habe ich vergessen, auf `$null` zu prüfen, und dann ist bei der GPU manchmal ein leerer Wert durchgerutscht. Seit ich konsequent prüfe, ist das Tool stabiler.

## Kompetenzband 3: H – Systemintegration

Bei der Systemintegration geht es darum, wo mein Script liegt, mit welchen Rechten es läuft und wie es sich ins System einfügt. Mein Tool ist bewusst portabel: nur eine `.ps1`-Datei mit den Modulen daneben, kein Installer, keine Registry-Einträge, kein Hintergrunddienst. Man kann den Ordner einfach kopieren und es läuft.

Gestartet wird es so:

```powershell
powershell -ExecutionPolicy Bypass -File GamingDashboard.ps1
```

Das `-ExecutionPolicy Bypass` ist wichtig. Windows blockiert standardmässig fremde Scripts. Mit diesem Schalter erlaube ich das Script nur für diesen einen Start, ohne die Einstellung dauerhaft im System zu ändern. Das ist sicherer, als die Policy generell aufzumachen.

Für die Rechte gilt: Die Grundfunktionen brauchen **keine** Adminrechte, weil CPU, RAM, Festplatte und Netzwerk über normale Windows-APIs laufen. Nur die Temperaturen sind eine Ausnahme, dafür muss OpenHardwareMonitor als Administrator laufen. Mein Script liest dann nur die Daten, die dieses Programm bereitstellt. Wer will, kann das Tool über eine Verknüpfung im Autostart-Ordner (`shell:startup`) beim Login automatisch starten lassen.

> Das mit der ExecutionPolicy war für mich neu. Ich habe zuerst nicht verstanden, warum das Script nicht startet. Erst als ich gelesen habe, dass Windows das aus Sicherheit blockiert, hat es Klick gemacht.

## Weitere Kompetenzen

Zusätzlich sind im Script noch ein paar andere Kompetenzen drin, die ich kurz nenne:

- **D – Variablen:** Ich nutze Umgebungsvariablen wie `$env:COMPUTERNAME` für den PC-Namen. Andere Variablen verändern sich im Ablauf, etwa der Tick-Zähler, der bei jedem Update um eins hochgeht. Das `$script:` davor bedeutet, dass die Variable über die ganze Datei gilt.
- **F – Schleifen:** Beim Netzwerk laufe ich mit `foreach` über alle Netzwerkkarten und addiere die Geschwindigkeiten. `foreach` passt hier, weil ich eine fertige Liste habe. Eine `while`-Schleife würde ich nehmen, wenn ich nicht weiss, wie oft etwas läuft.
- **J – Debugging:** Zum Fehlersuchen habe ich vor allem Zwischenwerte mit `Write-Host` ausgegeben, gerade bei der GPU, um zu sehen, was `nvidia-smi` zurückgibt. In VS Code habe ich auch Breakpoints gesetzt.
- **M – Kommentare:** Ich kommentiere dort, wo etwas nicht selbsterklärend ist, und schreibe das "warum", nicht das "was". Zum Beispiel `# erster Wert ist immer 0, also weg damit`.

---

# Kapitel 4 – Learnings

**Was schwierig war:** Am schwierigsten war die GPU. Es gibt keinen einheitlichen Weg, der bei jeder Karte funktioniert. Ich habe lange gebraucht, bis ich akzeptiert habe, dass ich mehrere Wege nacheinander probieren muss und es bei manchen PCs trotzdem keine Temperatur gibt. Auch die Oberfläche mit XAML war zäh.

**Was einfacher war als gedacht:** Der Timer hat mich positiv überrascht. Ich dachte, eine Oberfläche, die sich live aktualisiert, ist kompliziert. Mit dem `DispatcherTimer` waren es am Ende nur ein paar Zeilen.

**Wie ich Probleme gelöst habe:** Mein Vorgehen war meistens gleich. Erst das Problem klein machen, also nur den einen Teil in einem leeren Script testen. Dann Zwischenwerte ausgeben, um zu sehen, wo es hakt. Und wenn ich nicht weiterkam, habe ich gesucht oder die KI gefragt.

**Wie ich KI benutzt habe:** Ich habe die KI als Nachschlagewerk und Sparringspartner benutzt, vor allem beim Finden der richtigen WMI-Klassen und bei Erklärungen, etwa warum der erste Counter-Wert 0 ist. Auch beim Aufräumen vom Code hat sie geholfen.

**Wo ich selber nachdenken musste:** Die KI hat mir oft eine Lösung gegeben, die zwar lief, aber nicht zu meinem Aufbau passte. Die Idee mit dem Tick-Zähler kam von mir, weil ich gemerkt habe, dass mein PC unter Last warm wurde. Und ich musste jeden Vorschlag verstehen, bevor ich ihn übernommen habe, sonst hätte ich im Fachgespräch nichts erklären können.

> Eine ehrliche Reflexion: Es ist verlockend, einfach Code zu übernehmen, der funktioniert. Aber ich habe gemerkt, dass ich nur das wirklich kann, was ich auch verstanden habe.

**Was ich beim nächsten Mal besser machen würde:**

- Früher mit der Fehlerbehandlung anfangen, nicht erst am Schluss.
- Die GPU-Erkennung von Anfang an auf mehreren PCs testen.
- Mir vorher mehr Gedanken zum Layout machen, statt direkt loszubasteln.

---

Das Projekt hat mir gezeigt, dass man mit PowerShell mehr machen kann als nur kurze Befehle. Aus einer einfachen Idee ist ein richtiges Tool mit Oberfläche geworden. Ich habe viel über das System gelernt und auch über mich selber, nämlich dass ich am besten lerne, wenn ich Dinge ausprobiere und dann verstehe, warum sie funktionieren. Ich benutze das Dashboard tatsächlich, wenn ich zocke.
