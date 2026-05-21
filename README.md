# PC Lock Control

A modern web dashboard for managing and scheduling lock states on remote Windows PCs. This application works in tandem with the PC Lock Client (Windows App) to provide remote parental control and usage scheduling.

## Features

- **Dashboard**: View status of all configured PCs.
- **Remote Control**: Instantly Lock and Unlock PCs securely.
- **Scheduling**: Set daily "Lock Windows" (e.g., 10 PM - 7 AM) which are enforced by the target PC.
- **Management**: Easy interface to Add/Edit/Remove PCs.
- **Resilient**: Uses local database for persistence and secure API password for communication.

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Database**: PostgreSQL with Prisma ORM
- **UI**: Tailwind CSS + Shadcn/UI
- **Forms**: React Hook Form + Zod

## Getting Started

1.  **Environment Setup**:
    Create a `.env` file in the root directory and configure the environment variables:
    ```bash
    DATABASE_URL="postgresql://user:password@localhost:5432/pclock?schema=public"
    APP_PASSWORD="your-secure-dashboard-password"
    ```
    *Note: `APP_PASSWORD` is the single shared password required to authenticate/log in to the web control panel.*

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
Run the container by passing the `DATABASE_URL` and `APP_PASSWORD` environment variables.

#### Interactive Mode (for testing)
```bash
docker run --rm -p 3000:3000 \
  -e DATABASE_URL="postgresql://user:password@hostname:5432/dbname?schema=public" \
  -e APP_PASSWORD="your-secure-dashboard-password" \
  pc-lock-control
```

#### Detached Mode (runs in background)
```bash
docker run -d --name pc-lock-control -p 3000:3000 \
  -e DATABASE_URL="postgresql://user:password@hostname:5432/dbname?schema=public" \
  -e APP_PASSWORD="your-secure-dashboard-password" \
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
    restart: always
```

Start the application with:
```bash
docker compose up -d
```

