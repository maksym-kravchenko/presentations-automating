# 📽️ Presentations Automation

> Write Markdown → Get beautiful presentations.  
> Powered by [Slidev](https://sli.dev), [Go Task](https://taskfile.dev), and Node.js.

---

## ✨ What this does

Write a `.md` file, run one command, get a presentation. No PowerPoint. No dragging boxes around. Just text.

- 🎨 **Custom local themes** — multiple themes to choose from, applied per presentation
- 🗂️ **Organised by subfolders** — `slides/work/q2.md`, `slides/school/math.md`, etc.
- 🔁 **Live preview** — edit Markdown, see slides update instantly in the browser
- 📄 **Export to PDF or PPTX** — one command, open instantly with `-o`
- ⚙️ **Config injection** — set your name, company, date once in `config.json`, injected everywhere
- 📋 **Manage presentations** — list, rename, duplicate from the terminal

---

## 🚀 First-time setup

### 1. Install Scoop (Windows package manager)

Open **PowerShell as Administrator**:

```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
Invoke-RestMethod -Uri https://get.scoop.sh | Invoke-Expression
```

### 2. Install Go Task

```powershell
scoop install task
```

### 3. Install pnpm

```powershell
npm i -g pnpm
pnpm setup
```

> ⚠️ **Close and reopen PowerShell** after running `pnpm setup` so PATH is updated.

### 4. Clone the project

```powershell
git clone <your-repo-url>
cd presentations
```

### 5. Run setup

```powershell
task setup
```

This installs all dependencies (including local themes), approves Playwright build scripts, and installs the Chromium browser used for PDF/PPTX export.

---

## ⚙️ Configuration

Edit `config.json` in the project root. These values are automatically injected into every new presentation:

```json
{
  "theme": "my-theme-name",
  "author": "Your Name",
  "date": "01.01.2026",
  "subject": "Presentation Subject",
  "company": "Your Company / School"
}
```

- **`theme`** — default theme used when no `t=` is passed to `task new`
- All other fields appear in the header, footer, cover slide, and thank-you slide automatically

---

## 📁 Project structure

```
presentations/
├── Taskfile.yml            ← all commands live here
├── config.json             ← your name, date, subject, company, default theme
├── template.md             ← base template for new presentations (with examples)
├── template_empty.md       ← minimal blank template
├── package.json
├── pnpm-workspace.yaml     ← registers all themes/ as local packages
│
├── themes/                 ← your custom Slidev themes
│   ├── emerald-theme/
│   │   ├── package.json    ← declares name
│   │   ├── global-top.vue
│   │   ├── global-bottom.vue
│   │   └── styles/
│   │       └── index.css
│   └── lightblue-theme/
│       ├── package.json
│       ├── global-top.vue
│       ├── global-bottom.vue
│       └── styles/
│           └── index.css
│
├── slides/                 ← your .md source files
│   ├── my-talk.md
│   └── react/
│       └── hooks.md
│
├── output/                 ← built files land here (gitignored)
│
└── scripts/                ← internal Node scripts
    ├── new.cjs
    ├── inject.cjs
    ├── inject_theme.cjs
    ├── list.cjs
    ├── rename.cjs
    └── duplicate.cjs
```

---

## 🛠️ Commands

All commands use short single-letter parameters — no long flags to remember.

| Parameter | Meaning | Example |
|---|---|---|
| `n=` | presentation name / path | `n=react/hooks` |
| `t=` | theme name | `t=custom-slidev-theme-1` |
| `o=true` | open file after export | `o=true` |
| `doc=false` | skip documentation template | `doc=false` |
| `s=` | source (for rename/duplicate) | `s=old-name` |
| `to=` | to (for rename/duplicate) | `to=new-name` |

---

### Create a new presentation

```powershell
task new n=my-talk
task new n=subfolder/my-talk
task new n=my-talk t=custom-slidev-theme-1
task new n=my-talk doc=false
task new n=my-talk t=custom-slidev-theme-1 doc=false
```

- Creates `slides/my-talk.md` from `template.md` (with usage examples)
- Pass `doc=false` (or `doc=0` / `doc=f`) to use `template_empty.md` instead — a clean blank slate with no documentation
- Pass `t=theme-name` to override the default theme from `config.json`
- Injects all values from `config.json` automatically

---

### Live preview

```powershell
task watch n=my-talk
task watch n=subfolder/my-talk
task watch n=subfolder/my-talk t=custom-slidev-theme-1
```

Opens a browser at `http://localhost:3030`. Edit the `.md` file and slides update instantly in the browser.

**Useful browser shortcuts while presenting:**

| Key | Action |
|---|---|
| `→` / `Space` | Next slide / animation |
| `←` | Previous slide |
| `P` | Presenter mode (notes + timer) |
| `O` | Slides overview |
| `F` | Fullscreen |

---

### Export to PDF

```powershell
task pdf n=my-talk
task pdf n=subfolder/my-talk
task pdf n=my-talk o=true
task pdf n=my-talk o=true t=custom-slidev-theme-1
```

Output: `output/my-talk.pdf`  
Pass `o=true` to open the file immediately after export.

---

### Export to PPTX

```powershell
task pptx n=my-talk
task pptx n=my-talk o=true
task pptx n=my-talk o=true t=custom-slidev-theme-1
```

Output: `output/my-talk.pptx`  
Slides are exported as images — layout is pixel-perfect but not editable in PowerPoint.  
Pass `o=true` to open the file immediately after export.

---

### List all presentations

```powershell
task list
```

Prints a table of all presentations with their subject, author, date, theme, and which exports already exist.

---

### Re-inject config

If you update `config.json` while `task watch` is running, open a second terminal and run:

```powershell
task inject n=my-talk
task inject n=my-talk t=custom-slidev-theme-1
```

The browser will hot-reload automatically.

---

### Rename a presentation

```powershell
task rename s=old-name to=new-name
task rename s=react/hooks to=react/hooks-v2
```

Renames the `.md` file and any existing output files (PDF, PPTX, HTML folder) to match.

---

### Duplicate a presentation

```powershell
task duplicate s=source-talk to=new-talk
task duplicate s=react/hooks to=vue/hooks
```

Copies the source `.md` to a new path and injects fresh config values into it.

---

## 🎨 Themes

Themes live in the `themes/` folder. Each is a local Slidev theme — a small npm package registered via `pnpm-workspace.yaml`.

### Switching themes

Set the default in `config.json`:

```json
{
  "theme": "custom-slidev-theme-1"
}
```

Or override per presentation when creating:

```powershell
task new n=my-talk t=custom-slidev-theme-2
```

### Customising a theme

Each theme has its own CSS variables in `themes/your-theme/styles/index.css`:

```css
:root {
  --c-bg:        #F8FAFC;   /* slide background  */
  --c-primary:   #0F766E;   /* headings, accents */
  --c-secondary: #0D9488;   /* sub-headings      */
  --c-text:      #0F172A;   /* body text         */
  --c-muted:     #CCFBF1;   /* borders, dividers */
  --c-accent:    #F0FDFA;   /* subtle backgrounds */
}
```

The header (`global-top.vue`) and footer (`global-bottom.vue`) inside each theme folder control what is shown on every slide. Changes take effect immediately in `task watch` without restarting.

### Adding a new theme

1. Copy an existing theme folder and rename it
2. Update `name` in the theme's `package.json` to match the folder name
3. Run `pnpm install` from the project root to register it
4. Use it with `t=your-theme-name`

---

## 🔧 Troubleshooting

**`pnpm` not found after install**  
Run `pnpm setup`, then close and reopen PowerShell completely.

**`task` not found in VS Code terminal**  
Press `Ctrl+Shift+P` → `Terminal: Select Default Profile` → choose PowerShell. Reopen the terminal.

**PDF/PPTX export fails with Playwright error**

```powershell
pnpm approve-builds   # select playwright-chromium
pnpm exec playwright install chromium
```

**Theme not applying (no styling, no header/footer)**  
Run `pnpm install` from the project root — this registers all local theme packages. Then restart `task watch`.

**Config values not updating on slides**  
Run `task inject n=your-talk` in a second terminal while watch is running.

**Slidev tries to install theme from npm and fails**  
Your theme name in `config.json` or the slide frontmatter doesn't match the folder name in `themes/`. Check that the `name` field in `themes/your-theme/package.json` exactly matches what you have in `config.json`.

---

## 📦 Tech stack

| Tool | Role |
|---|---|
| [Slidev](https://sli.dev) | Markdown → presentations |
| [Go Task](https://taskfile.dev) | Task runner / automation |
| [pnpm](https://pnpm.io) | Package manager with workspace support |
| [Playwright](https://playwright.dev) | Headless browser for PDF/PPTX export |
| Node.js | Config injection and management scripts |

---

## 📄 License

MIT