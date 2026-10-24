# PC Lock Control

A modern web dashboard for managing and scheduling lock states on remote Windows PCs. This application works in tandem with the PC Lock Client (Windows App) to provide remote parental control and usage scheduling.

## Features

- **Dashboard**: Live online/locked status of all configured PCs.
- **Remote Control**: Lock and Unlock PCs; the detail page refreshes every 5 seconds.
- **Scheduling**: Set daily "Lock Windows" (e.g., 10 PM - 7 AM) which are enforced by the target PC. The PC is the source of truth; the database copy is kept in sync. Shows when tonight was skipped because someone unlocked during the window.
- **Management**: Add/Edit/Remove PCs. PC API passwords never leave the server.
- **Secure**: Signed, expiring session cookies; every server action checks the session; login attempts are throttled.

Requires the PC Lock Windows app with the updated API (`GET /api/status` with `Authorization: Bearer`, partial `POST /api/schedule`).

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Database**: PostgreSQL with Prisma ORM
- **UI**: Tailwind CSS + Shadcn/UI
- **Forms**: React Hook Form + Zod

## Getting Started

1.  **Environment Setup**:
    Copy `.env.example` to `.env` (or create `.env`) and configure the environment variables:
    ```bash
    DATABASE_URL="postgresql://user:password@localhost:5432/pclock?schema=public"
    APP_PASSWORD="your-secure-dashboard-password"
    # optional
    SESSION_SECRET="long-random-string"
    INSECURE_COOKIES=true   # only for production over plain http (no HTTPS)
    ```
    *Note: `APP_PASSWORD` is the single shared password required to log in to the web control panel.
    `SESSION_SECRET` signs the login cookie (derived from `APP_PASSWORD` if unset).*

2.  **Install Dependencies**:
    ```bash
    npm install
    ```

3.  **Database Migration**:
    ```bash
    npx prisma migrate dev
    ```

4.  **Run Development Server**:
    ```bash
    npm run dev
    ```

5.  **Build for Production**:
    ```bash
    npm run build
    npm start
    ```

6.  **Check the PC API client** against a running PC Lock app (does lock, unlock and changes the schedule!):
    ```bash
    npm run check:pc-api -- <host> <port> <password>
    ```

## Usage

1.  Open the dashboard at `http://localhost:3000`.
2.  Click **Add PC**.
3.  Enter the Name, IP Address, Port (default 8765), and the API Password configured on the target PC app.
4.  Once added, use the **Control** button to manage the PC.

## Docker Deployment

### 1. Build the Image
Build the Docker image using the following command:
```bash
docker build -t pc-lock-control .
```

### 2. Publish to Docker Hub
To publish the image to Docker Hub under `tm81/pc-lock-control`:

1. **Log in to Docker Hub**:
   ```bash
   docker login
   ```

2. **Tag the Image**:
   ```bash
   docker tag pc-lock-control tm81/pc-lock-control:latest
   ```
   *(Or build it directly with the tag: `docker build -t tm81/pc-lock-control:latest .`)*

3. **Push the Image**:
   ```bash
   docker push tm81/pc-lock-control:latest
   ```

### 3. Run the Container
Run the container by passing the `DATABASE_URL` and `APP_PASSWORD` environment variables. `INSECURE_COOKIES=true` is needed when the dashboard is opened over plain http; drop it behind HTTPS.

#### Interactive Mode (for testing)
```bash
docker run --rm -p 3000:3000 \
  -e DATABASE_URL="postgresql://user:password@hostname:5432/dbname?schema=public" \
  -e APP_PASSWORD="your-secure-dashboard-password" \
  -e INSECURE_COOKIES=true \
  pc-lock-control
```

#### Detached Mode (runs in background)
```bash
docker run -d --name pc-lock-control -p 3000:3000 \
  -e DATABASE_URL="postgresql://user:password@hostname:5432/dbname?schema=public" \
  -e APP_PASSWORD="your-secure-dashboard-password" \
  -e INSECURE_COOKIES=true \
  --restart unless-stopped \
  pc-lock-control
```

### 4. Docker Compose
Alternatively, you can manage the application using Docker Compose. Create a `docker-compose.yml` file in the root directory:

```yaml
services:
  app:
    build: .
    image: pc-lock-control:latest
    container_name: pc-lock-control
    ports:
      - "3000:3000"
    environment:
      - DATABASE_URL=postgresql://user:password@hostname:5432/dbname?schema=public
      - APP_PASSWORD=your-secure-dashboard-password
      # remove if you serve the app over HTTPS
      - INSECURE_COOKIES=true
    restart: always
```

Start the application with:
```bash
docker compose up -d
```

