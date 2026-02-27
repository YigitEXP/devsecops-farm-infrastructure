🛡️ Fortified FARM Stack: A DevSecOps Case Study
Hi! I'm Yiğit Can Aktürk, a 2nd-year Computer Engineering student at Süleyman Demirel University. This project is my hands-on laboratory for exploring System Architecture and DevSecOps.

🏗️ Architectural Blueprint
I designed this infrastructure using Clean Architecture principles to ensure strict separation between the frontend, backend, and security proxy layers.

Nginx (The Shield): Acts as a Reverse Proxy, handling SSL termination (planned) and security headers (CSP, X-Frame, HSTS).

FastAPI (The Core): Managed with Pydantic for strict data validation and type safety.

Redis (The Gatekeeper): Implements rate-limiting to neutralize brute-force attacks.

Docker Orchestration: All services communicate within a private app-network, isolating the database and backend from direct public exposure.

🚦 Smart Automation (operate.sh)
I developed a custom Bash script to automate the entire DevSecOps lifecycle:

start / stop: Container orchestration.

trivy-scan: Automated vulnerability scanning for Docker images.

k6-test: Performance & Load testing with automatic dependency resolution.

hard-start: Full system purge and no-cache rebuild for clean deployments.
