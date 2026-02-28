# 🛡️ Bulletproof Security: A DevSecOps Journey

Hi there! I'm **Yiğit**, a 2nd-year Computer Engineering student at Süleyman Demirel University. This project is my "battlefield" where I learn how to build a truly secure, "bulletproof" full-stack application from the ground up.

---

### 📖 Developer's Journal (The Honest Truth)

I didn't write every single line of this project alone in one night. To be honest, as a **19-year-old sophomore**, I hit some walls with complex **Nginx CSP headers** and **Docker network isolation**. 

For efficiency and to speed up my learning process, I used **AI (Gemini)** as my mentor. We "fortified" some complex CSS layouts and Nginx configurations together. For me, the most important part was understanding *why* that code was there. **I remained the driver; AI was my co-pilot/navigator.** It showed me my mistakes, and I learned by fixing them.

There are still some "roadblocks" (like sophisticated **XSS details**) that I haven't fully solved yet. I'll be closing those gaps with help from my **senior backend developer cousin** and my professors, because I believe engineering is a journey of continuous improvement!

---

### 🚀 Quick Start (How to Run)

To run this project locally, you only need to have **Docker** and **Docker Compose** installed.

#### 1. Environment Configuration
Before starting the system, you must configure your security keys and database settings:

```bash
# Clone the repository
git clone [https://github.com/YigitEXP/bulletproof-auth.git](https://github.com/YigitEXP/bulletproof-auth.git)
cd bulletproof-auth

# Create your secret environment file from the template
cp .env.example .env
```
> ⚠️ **IMPORTANT:** Open the `.env` file and replace the placeholder keys with your own secret strings. Don't worry, `.env` is already in `.gitignore`!

#### 2. Deploy with Docker
You can fire up the entire ecosystem (**Frontend, Backend, Database, Redis, Nginx**) with a single command:

```bash
# Build and start the containers with bash script
bash operate.sh start
```
---

### 🛠️ Tech Stack & Security Hardening

* **Backend:** `FastAPI` (Python) - High performance and asynchronous.
* **Frontend:** `React` + `Vite` - Modern and fast UI.
* **Database:** `MongoDB` (Persistent Data) & `Redis` (Caching/Rate Limiting).
* **Proxy/Shield:** `Nginx` - Hardened with CSP, XSS protection, and Information Disclosure fixes.
* **Performance Testing:** `Grafana k6` - Reliability and load testing to ensure system stability under stress.
* **Security Auditing:** `OWASP ZAP` for dynamic scanning & `Trivy` for container vulnerability checks.

---

### 🚧 Current Roadblocks & Roadmap

* **UI Refinement:** Fixed a major 500px layout shift; currently working on pixel-perfect alignment.
* **Advanced XSS:** Planning a deep-dive "code review" session
* **CI/CD:** Exploring more automated security gates in GitHub Actions.

---

### 🏁 Architect's Note

This project represents a student's effort to build a "secure castle". I am wide open to any feedback, Pull Requests, or even a "you did this wrong" comment. **That's how I grow!** 🛡️
