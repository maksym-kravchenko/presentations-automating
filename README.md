# 📽️ Presentations Automation

> Write Markdown → Get beautiful presentations.  
> Powered by [Slidev](https://sli.dev), [Go Task](https://taskfile.dev), and Node.js.

---

## ✨ What this does

Write a `.md` file, run one command, get a presentation. No PowerPoint. No dragging boxes around. Just text.

- 🎨 **Consistent styling** — custom local theme applied to every presentation automatically
- 🗂️ **Organised by subfolders** — `slides/work/q2.md`, `slides/school/math.md`, etc.
- 🔁 **Live preview** — edit Markdown, see slides update instantly in the browser
- 📄 **Export to PDF or PPTX** — one command
- ⚙️ **Config injection** — set your name, company, date once in `config.json`, injected everywhere

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

This installs all dependencies (including the local theme), approves Playwright build scripts, and installs the Chromium browser used for PDF/PPTX export.

---

## ⚙️ Configuration

Edit `config.json` in the project root before creating a new presentation:

```json
{
  "theme": "1-slidev-theme-mine",
  "author": "Your Name",
  "date": "01.01.2026",
  "subject": "Presentation Subject",
  "company": "Your Company / School"
}
```

These values are automatically injected into every slide's frontmatter and shown in the header and footer.

> ⚠️ Do not remove `"theme": "slidev-theme-mine"` — this wires up the custom styling.

---

## 📁 Project structure

```
presentations/
├── Taskfile.yml          ← all commands live here
├── config.json           ← your name, date, subject, company
├── template.md           ← base template for new presentations
├── template.pptx         ← reference template for pptx-edit command
├── package.json
├── pnpm-workspace.yaml   ← registers theme/ as a local package
│
├── theme/                ← custom Slidev theme (local npm package)
│   ├── package.json      ← declares name: slidev-theme-mine
│   ├── global-top.vue    ← header shown on every slide
│   ├── global-bottom.vue ← footer + pagination on every slide
│   └── styles/
│       └── index.css     ← all slide styling lives here
│
├── slides/               ← your .md source files
│   ├── my-talk.md        ← flat file
│   └── react/            ← or organised in subfolders
│       └── hooks.md
│
├── output/               ← built files land here (gitignored)
│   └── react/
│       └── hooks.pdf
│
└── scripts/              ← internal Node scripts (don't edit)
    ├── new.cjs
    ├── inject.cjs
    └── build-all.cjs
```

---

## 🛠️ Commands

### Create a new presentation

```powershell
task new -- my-talk
task new -- subfolder/my-talk
```

Copies `template.md` to `slides/my-talk.md` (creating subfolders as needed) and injects your `config.json` values.

---

### Live preview

```powershell
task watch -- my-talk
task watch -- subfolder/my-talk
```

Opens a browser at `http://localhost:3030`. Edit the `.md` file and slides update instantly.

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
task pdf -- my-talk
task pdf -- subfolder/my-talk
```

Output: `output/my-talk.pdf`

---

### Export to PPTX (screenshot-based)

```powershell
task pptx -- my-talk
```

Output: `output/my-talk.pptx`

> Slides are exported as images — layout is pixel-perfect but not editable in PowerPoint.

---

### Export to editable PPTX (via Pandoc)

```powershell
task pptx-edit -- my-talk
```

Output: `output/my-talk.pptx`

> Requires [Pandoc](https://pandoc.org) installed: `scoop install pandoc`  
> Produces real PowerPoint objects — text, bullets, and headings are all editable.  
> Layout fidelity is limited: Pandoc maps headings mechanically and does not support custom positioning or multi-column slides.

#### 🔬 Better editable PPTX — coming soon

A Python-based exporter using `python-pptx` is in development. It will read the `.md` file and build a fully structured PPTX with proper layouts, fonts, and positioning — giving complete control over the output while keeping it fully editable in PowerPoint. This will replace the Pandoc approach once ready.

---

### Build to HTML

```powershell
task build -- my-talk
```

Output: `output/my-talk/` — a self-contained HTML presentation you can host or share.

---

### Build all presentations

```powershell
task build-all
```

Builds every `.md` file in `slides/` and all subfolders.

---

### Re-inject config

If you change `config.json` while watch is running, open a second terminal and run:

```powershell
task inject -- my-talk
```

The browser will hot-reload automatically.

---

## 🎨 Customising the theme

The theme lives in `theme/styles/index.css`. Edit the CSS variables at the top to change the look globally:

```css
:root {
  --c-bg:        #F8FAFC;   /* slide background  */
  --c-primary:   #0F766E;   /* headings, accents */
  --c-secondary: #0D9488;   /* sub-headings      */
  --c-text:      #0F172A;   /* body text         */
}
```

The header (`global-top.vue`) and footer (`global-bottom.vue`) are also in the `theme/` folder and can be edited to change what is displayed on every slide.

Changes take effect immediately in `task watch` without restarting.

---

## 🔧 Troubleshooting

**`pnpm` not found after install**  
Run `pnpm setup`, then close and reopen PowerShell completely.

**`task` not found in VS Code terminal**  
Press `Ctrl+Shift+P` → `Terminal: Select Default Profile` → choose PowerShell. Then close and reopen the terminal.

**PDF/PPTX export fails with Playwright error**

```powershell
pnpm approve-builds   # select playwright-chromium
pnpm exec playwright install chromium
```

**Theme not applying (no styling, no header/footer)**  
Run `pnpm install` from the project root — this registers the local theme package into `node_modules`. Then restart `task watch`.

**Config values not updating on slides**  
Run `task inject -- your-talk` in a second terminal while watch is running.

---

## 📦 Tech stack

| Tool | Role |
|---|---|
| [Slidev](https://sli.dev) | Markdown → presentations |
| [Go Task](https://taskfile.dev) | Task runner / automation |
| [pnpm](https://pnpm.io) | Package manager with workspace support |
| [Playwright](https://playwright.dev) | Headless browser for PDF/PPTX export |
| [Pandoc](https://pandoc.org) | Markdown → editable PPTX (current) |
| [python-pptx](https://python-pptx.readthedocs.io) | Markdown → editable PPTX (in development) |
| Node.js | Config injection scripts |

---

## 📄 License

MIT