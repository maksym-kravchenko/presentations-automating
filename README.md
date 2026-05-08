<div align="center">

# 🎯 Presentations-automating

### *Stop making slides by hand. Start shipping ideas.*

<img width="280" alt="still-developing" src="https://github.com/user-attachments/assets/2970b2cb-357d-4bc4-8c4d-88e13fa5c23d" />

</div>

---

## ✨ What's New in v1.2

> **Two powerful export modes, zero hassle.**

| Feature | Description |
|---|---|
| 📄 **PDF Export** | Export your presentation as a clean, shareable PDF in one command |
| 🌐 **Live Slideshow** | Serve your slides as an online presentation via `localhost` — perfect for presenting directly from your machine |

---

## 🚀 Features at a Glance

- ⚡ **Automated slide generation** — describe your content, get a full deck
- 📄 **PDF export** — one command, publication-ready output
- 🌍 **Localhost live presentation** — run slides in the browser, no PowerPoint needed
- 🔧 **Task-based workflow** — powered by [go-task](https://taskfile.dev) for repeatable, scriptable builds
- 🎨 **Slidev under the hood** — markdown-first, developer-friendly slide engine

---

## 🛠️ Installation (only for Windows **now**)

### Step 1 — Install Scoop (Windows Package Manager)

Open **PowerShell as your current user** and run:

```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
Invoke-RestMethod -Uri https://get.scoop.sh | Invoke-Expression
```

---

### Step 2 — Install Core Dependencies

```powershell
scoop install task      # go-task: the task runner
scoop install nodejs    # Node.js (skip if already installed)
```
---

### Step 3 — Install Slidev

```powershell
npm install -g @slidev/cli          # Slidev CLI, globally
```

---

### Step 4 — Clone the Repo

```bash
git clone https://github.com/your-username/presentations-automating.git
cd presentations-automating
```

---

### Step 5 — Verify Your Setup

Run these to confirm everything is installed correctly:

```powershell
task --version
node --version
slidev --version
```
---

### Step 6 - Install Chromium for PDF export
Navigate to you pulled project folder and run this npm install command:
```powershell
npm install -D playwright-chromium  # Headless Chromium for PDF export
```

## 🧑‍💻 Quick Start

```bash
cd /presentations   # Navigate to core 
task run            # Generate & serve slides at localhost
task export         # Export slides to PDF
```

---

## 📁 Project Structure

```
presentations-automating/
├── Taskfile.yml       # Task definitions
├── slides.md          # Your presentation content
├── output/            # Exported PDFs land here
└── ...
```

---

## 🤝 Contributing

Pull requests are welcome! For major changes, please open an issue first to discuss what you'd like to change.

---

<div align="center">

Made with ☕ and way too many slides.

[⭐ Star on GitHub](https://github.com/maksym-kravchenko/presentations-automating)
[🐛 Report a Bug](https://github.com/maksym-kravchenko/presentations-automating/issues/new?labels=bug)
[💡 Request a Feature](https://github.com/maksym-kravchenko/presentations-automating/issues/new?labels=enhancement)

</div>