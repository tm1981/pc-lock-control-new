# Product Context

## Problem Statement
Parents or administrators need a reliable way to manage PC usage time and enforce limits without physically accessing the machine or relying on easily bypassed local controls.

## Solution
A decoupled control system consisting of:
1.  **Client App (Windows)**: A background service/app running on the target PC that enforces a full-screen lock screen and exposes a REST API.
2.  **Controller App (This Project)**: A Next.js web application that acts as the "remote control". It stores the list of PCs and communicates with them to send commands and update policies.

## User Experience
- **Home**: A grid of "cards" representing each PC. Indicators show if a PC is online/reachable.
- **PC Detail**: Large, clear buttons for "Lock" and "Unlock". Status of the current lock state.
- **Schedule**: A form to set the "Lock Window" (e.g., Start time 22:00, End time 07:00). This schedule is synced to the PC and stored in the database.
- **Configuration**: Easy setup form requiring IP/Hostname, Port, and a Shared Password.

## Constraints
- **Connectivity**: The web app must be able to reach the target PCs over the network (LAN or VPN).
- **Web App Authentication**: Single shared password (`APP_PASSWORD`) required to access the control panel. Cookie-based session, 24-hour expiry. No usernames — anyone with the password can log in.
- **PC API Authentication**: Usage of a per-PC shared password (API Password) to authorize commands sent to each target machine.
- **State**: The "truth" of the lock state is on the PC, but the "truth" of the policy (schedule) is effectively managed here and pushed to the PC.
