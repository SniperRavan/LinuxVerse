# 🐧 LinuxVerse

> **Experience Linux. Instantly.** — A high-fidelity Ubuntu desktop environment running live in your browser. No install. No VM. No waiting.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Built with](https://img.shields.io/badge/Built%20with-HTML%20%7C%20CSS%20%7C%20JS-orange)](https://github.com/SniperRavan)
[![Status](https://img.shields.io/badge/Status-MVP%20Active-brightgreen)]()

---

## 📸 What Is This?

LinuxVerse is a browser-based Linux experience platform. It simulates a real Ubuntu desktop — boot screen, lock screen, login, dock, windows, and a functional terminal — all running in your browser tab.

The **GUI is a simulation** (fast, smooth, no backend needed).  
The **Terminal is real** (commands route through a Node.js backend to a Docker container running actual Ubuntu).

---

## 🗂️ Project Structure

```
linuxverse/
│
├── frontend/                        # All client-side code
│   ├── index.html                   # Landing / marketing homepage
│   ├── styles.css                   # Homepage styles
│   ├── server.js                    # Homepage JS (cursor, scroll, animations)
│   │
│   ├── pages/
│   │   ├── ubuntu.html              # 🟠 Ubuntu OS experience (boot → login → desktop)
│   │   ├── fedora.html              # 🔵 Fedora OS experience (coming soon)
│   │   └── mint.html                # 🟢 Linux Mint OS experience (coming soon)
│   │
│   ├── components/
│   │   ├── terminal.js              # xterm.js terminal component
│   │   ├── window-manager.js        # Drag/resize/focus window logic
│   │   ├── dock.js                  # Dock interaction & app launcher
│   │   ├── topbar.js                # Top bar clock, notifications
│   │   ├── file-manager.js          # File manager UI
│   │   ├── notes.js                 # Notes app with localStorage
│   │   └── browser-app.js           # Simulated browser (iframe + install gate)
│   │
│   ├── styles/
│   │   ├── ubuntu-desktop.css       # Ubuntu desktop theme variables & layout
│   │   ├── windows.css              # Window chrome, dragging, animations
│   │   ├── terminal.css             # Terminal colors, fonts, scrollbar
│   │   └── animations.css           # Boot, login, desktop reveal animations
│   │
│   └── assets/
│       ├── wallpapers/
│       │   ├── ubuntu-default.jpg   # Default Ubuntu wallpaper
│       │   └── ubuntu-dark.jpg      # Dark variant
│       └── icons/
│           └── ubuntu-logo.svg      # Ubuntu circle-of-friends logo
│
├── backend/                         # Node.js server (real terminal execution)
│   ├── index.js                     # Entry point — Express + WebSocket server
│   ├── package.json
│   │
│   ├── services/
│   │   ├── command-executor.js      # Runs commands inside Docker container
│   │   ├── command-filter.js        # Blocklist + allowlist enforcement
│   │   └── session-manager.js       # Maps user sessions → containers
│   │
│   ├── routes/
│   │   └── health.js                # GET /health — uptime check
│   │
│   └── middleware/
│       ├── rate-limiter.js          # Prevent abuse (max N commands/min)
│       └── cors.js                  # CORS config for frontend domain
│
├── docker/
│   ├── Dockerfile                   # Ubuntu container image definition
│   └── docker-compose.yml           # Local dev: backend + container together
│
├── docs/
│   ├── PRD.md                       # Product Requirements Document
│   ├── ARCHITECTURE.md              # Deep-dive system architecture
│   └── SECURITY.md                  # Security model & threat analysis
│
└── README.md                        # ← You are here
```

---

## ✨ Features

| Feature | Status | Notes |
|---|---|---|
| Boot screen with fake system logs | ✅ Done | Animated, realistic |
| Lock screen (time + click-to-unlock) | ✅ Done | Blurred wallpaper |
| Login screen (password validation) | ✅ Done | Password: `switch-to-linux` |
| Ubuntu GNOME desktop layout | ✅ Done | Topbar, dock, workspace |
| Draggable + resizable windows | ✅ Done | Pure JS, no libs |
| Terminal with command simulation | ✅ Done | 15+ commands |
| Real Docker terminal execution | 🚧 Phase 2 | Backend not yet deployed |
| File manager app | ✅ Done | Simulated FS tree |
| Notes app (localStorage) | ✅ Done | Auto-save |
| Browser app + install gate | ✅ Done | `sudo apt install firefox` unlocks it |
| Notifications | ✅ Done | Toast-style |
| Command history (↑↓ keys) | ✅ Done | In-session |
| Fedora distro | 🔜 Planned | Phase 3 |
| Linux Mint distro | 🔜 Planned | Phase 3 |

---

## 🏗️ Architecture

```
User Browser
     │
     ▼
frontend/ubuntu.html  (HTML + CSS + JS — no framework, zero dependencies)
     │
     │  WebSocket (Phase 2 — real terminal)
     ▼
backend/index.js  (Node.js + Express + ws)
     │
     ├── command-filter.js  — blocks dangerous commands before execution
     │
     ▼
Docker Container  (Ubuntu 22.04, restricted user, CPU/RAM/disk limits)
     │
     ▼
Real Linux Kernel output → streamed back via WebSocket → xterm.js
```

**Phase 1 (current):** All terminal commands are simulated in the browser. No backend required.  
**Phase 2:** WebSocket connects to a Node.js backend that executes commands in Docker.  
**Phase 3:** Per-user containers, session persistence, container pooling.

---

## 🚀 Getting Started

### Run the frontend locally (no backend needed)

```bash
git clone https://github.com/SniperRavan/linuxverse
cd linuxverse
# Just open the file — no build step needed
open frontend/index.html
# Or serve with any static server:
npx serve frontend/
```

Then open `http://localhost:3000` in your browser and click **Launch Ubuntu**.

### Run with the backend (Phase 2)

```bash
# Prerequisites: Node.js 18+, Docker
cd backend
npm install
npm run dev          # starts on port 3001

# In another terminal, spin up the Ubuntu container:
cd docker
docker-compose up -d
```

Set `VITE_WS_URL=ws://localhost:3001` in `frontend/.env` if you extract the WS URL.

---

## 🔐 Security Model

Three layers protect the host system:

**Layer 1 — Command Filtering (backend)**  
A blocklist prevents dangerous commands from ever reaching Docker:
- `rm -rf`, `dd`, `mkfs`, `shutdown`, `reboot`, `:(){ :|:& };:` (fork bomb), `chmod 777 /`, and more.

**Layer 2 — Docker Isolation**  
Each session runs in a container with:
- Non-root user (`sniper`, UID 1000)
- No `--privileged` flag
- `--cap-drop=ALL` (all Linux capabilities stripped)
- Seccomp profile applied

**Layer 3 — Resource Limits**
| Resource | Limit |
|---|---|
| CPU | 0.5 core |
| RAM | 256 MB |
| Disk | 100 MB |
| Network | Blocked (outbound) |
| Session | 30 min TTL |

---

## 🧪 Terminal Commands (Phase 1 — Simulated)

```bash
help          # list all commands
ls [-la]      # list directory contents
cd <dir>      # change directory
pwd           # print working directory
echo <text>   # print text
cat <file>    # read file contents
uname [-a]    # system information
whoami        # current user
date          # current date and time
clear         # clear terminal output
history       # command history
neofetch      # system info (ASCII art)
fortune       # random programming quote
cowsay <msg>  # ASCII cow
exit          # log out → lock screen
sudo apt install <pkg>  # simulated package install
```

**Allowed packages:** `firefox`, `brave-browser`, `vim`, `nano`, `htop`, `git`, `tree`

---

## 🗺️ Roadmap

```
MVP (Now)
  ✅ Homepage (index.html)
  ✅ Ubuntu boot → login → desktop flow
  ✅ Simulated terminal (15+ commands)
  ✅ Window management (drag, resize, focus)
  ✅ File manager, Notes, Browser apps
  ✅ Notifications

Phase 2 (Next)
  ⬜ Node.js + WebSocket backend
  ⬜ Docker container execution
  ⬜ Real apt simulation
  ⬜ xterm.js integration
  ⬜ Deploy backend to Railway

Phase 3 (Future)
  ⬜ Per-user container isolation
  ⬜ Session persistence (30 min)
  ⬜ Fedora distro
  ⬜ Linux Mint distro
  ⬜ Container pool + load balancing
  ⬜ User accounts + save state
```

---

## 🛠️ Tech Stack

**Frontend (current)**
- Vanilla HTML + CSS + JavaScript — zero frameworks, zero build tools
- Ubuntu font family (Google Fonts)
- CSS custom properties for theming
- Web Animations API + CSS transitions

**Frontend (Phase 2 target)**
- React + Vite + TypeScript
- Tailwind CSS
- Framer Motion
- xterm.js (terminal emulator)

**Backend**
- Node.js + Express
- `ws` (WebSocket)
- Docker SDK (`dockerode`)

**Infrastructure**
- Frontend → Vercel
- Backend → Railway
- CDN → Cloudflare

---

## 👤 Author

**Akash Das Dhibar** (SniperRavan)

- GitHub: [@SniperRavan](https://github.com/SniperRavan)
- LinkedIn: [akash-das-dhibar](https://www.linkedin.com/in/akash-das-dhibar)

---

## 📄 License

MIT — do whatever you want, just keep the attribution.

---

> *"The best way to learn Linux is to use Linux."*  
> LinuxVerse lets you start before you're ready.