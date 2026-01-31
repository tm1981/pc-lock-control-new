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
    Copy `.env.example` to `.env` (or create one) and set your database URL:
    ```bash
    DATABASE_URL="postgresql://user:password@localhost:5432/pclock?schema=public"
    ```

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

### Build the Image
```bash
docker build -t pc-lock-control .
```

### Run the Container
Replace the `DATABASE_URL` with your actual PostgreSQL connection string.
```bash
docker run --rm -p 3000:3000 -e DATABASE_URL="postgresql://user:password@hostname:5432/dbname?schema=public" pc-lock-control:latest
```

### Docker Compose
You can also use Docker Compose. Create a `docker-compose.yml` file:

```yaml
services:
  app:
    build: .
    image: pc-lock-control:latest
    ports:
      - "3000:3000"
    environment:
      - DATABASE_URL=postgresql://user:password@hostname:5432/dbname?schema=public
    restart: always
```
Then run:
```bash
docker-compose up -d
```
