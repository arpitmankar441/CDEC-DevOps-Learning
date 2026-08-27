# Docker Image and Networking Mini Project

This beginner project runs a small web application in two Docker containers:

- **Frontend container:** Nginx serves an HTML page.
- **API container:** Node.js returns a JSON message.
- **Docker network:** Allows the frontend container to contact the API container.

## Learning Objectives

After completing this project, students should be able to:

1. Explain the difference between an image and a container.
2. Build a custom image from a Dockerfile.
3. Run multiple containers with Docker Compose.
4. Connect containers through a user-defined bridge network.
5. Use a Compose service name as a DNS hostname.
6. Inspect images, containers, networks, and logs.

## Prerequisites

- Docker Desktop, or Docker Engine with the Compose plugin
- A terminal
- A web browser

Check the installation:

```bash
docker --version
docker compose version
```

## Project Structure

```text
docker-networking-student-project/
├── api/
│   ├── .dockerignore
│   ├── Dockerfile
│   ├── package.json
│   └── server.js
├── frontend/
│   ├── .dockerignore
│   ├── Dockerfile
│   ├── index.html
│   └── nginx.conf
├── compose.yaml
└── README.md
```

## Architecture

```text
Browser (localhost:8080)
          |
          v
Frontend container (Nginx:80)
          |
          | student-network
          v
API container (Node.js:3000)
```

Only the frontend port is published to the host. The API is not published. Nginx reaches it internally using `api:3000`.

## Step 1: Build the Images

Open a terminal in this project directory and run:

```bash
docker compose build
```

List the new images:

```bash
docker image ls
```

Expected image names:

- `student-docker-frontend:1.0`
- `student-docker-api:1.0`

## Step 2: Start the Application

```bash
docker compose up -d
```

Check the running containers:

```bash
docker compose ps
```

Open this URL:

```text
http://localhost:8080
```

Click **Contact API Container**. The message returned by the API container should appear.

## Step 3: Inspect the Network

List Docker networks:

```bash
docker network ls
```

Find the network whose name ends in `student-network`, then inspect it:

```bash
docker network inspect <network-name>
```

In the output, find both the `frontend` and `api` containers.

## Step 4: Test Container DNS

The frontend can use the service name `api` as a hostname. Run:

```bash
docker compose exec frontend wget -qO- http://api:3000/health
```

Expected result:

```json
{"status":"healthy"}
```

Docker's internal DNS translates `api` into the API container's current IP address.

## Step 5: View Logs

```bash
docker compose logs
docker compose logs api
docker compose logs frontend
```

Follow logs live:

```bash
docker compose logs -f
```

Press `Ctrl + C` to stop following the logs. This does not stop the containers.

## Step 6: Stop and Clean Up

Stop and remove the project containers and network:

```bash
docker compose down
```

Optional: remove the two project images:

```bash
docker image rm student-docker-frontend:1.0 student-docker-api:1.0
```

Do not use broad cleanup commands on a shared or production machine.

## How the Networking Works

The `compose.yaml` file creates a user-defined bridge network called `student-network`. Both services join it.

This Nginx line sends API requests to the other container:

```nginx
proxy_pass http://api:3000;
```

Here:

- `api` is the Compose service name and internal hostname.
- `3000` is the API container's internal port.
- The browser never needs the API container's IP address.
- Container IP addresses may change, so service names should be used.

## Important Concepts

| Concept | Meaning in this project |
|---|---|
| Dockerfile | Instructions used to build an image |
| Image | Read-only template for a container |
| Container | Running instance of an image |
| Port mapping | Maps host port `8080` to frontend port `80` |
| Bridge network | Private network shared by the two containers |
| Service name | Stable hostname used for container communication |
| Docker Compose | Defines and runs the multi-container application |

## Student Tasks

Complete these tasks after the basic project works:

1. Change the API message and rebuild only the API service.
2. Change the page heading and rebuild only the frontend service.
3. Find both containers in the network inspection output.
4. Explain why `http://api:3000` works inside the frontend container but normally not in the host browser.
5. Temporarily remove the API service from `student-network`, start the project, and record the error. Restore it afterward.
6. Add a new API route `/api/student` that returns your name and course.
7. Display the new response on the frontend.

Useful rebuild commands:

```bash
docker compose build api
docker compose build frontend
docker compose up -d
```

## Submission Evidence

Submit a short PDF or Word document containing:

1. Student name and date
2. Screenshot of `docker image ls`
3. Screenshot of `docker compose ps`
4. Browser screenshot showing the API message
5. Screenshot of the network inspection showing both containers
6. Screenshot of the container DNS test
7. Source-code screenshot for the added `/api/student` route
8. A short explanation of image, container, port mapping, and Docker network
9. Screenshot of `docker compose down`

Do not include passwords, tokens, private registry credentials, or unrelated system information in screenshots.

## Troubleshooting

### Port 8080 is already in use

Change this line in `compose.yaml`:

```yaml
ports:
  - "8081:80"
```

Then open `http://localhost:8081`.

### The page opens but the API request fails

Check the service status and logs:

```bash
docker compose ps
docker compose logs api
docker compose logs frontend
```

Rebuild and restart:

```bash
docker compose down
docker compose up -d --build
```

### A file change is not visible

Images do not automatically update after source files change. Rebuild the affected image:

```bash
docker compose up -d --build
```

## Interview Questions

1. What is the difference between a Docker image and a container?
2. What does the `FROM` instruction do?
3. Why is `0.0.0.0` used by the API server?
4. What is a user-defined bridge network?
5. How do containers resolve Compose service names?
6. What is the difference between `EXPOSE 3000` and publishing a port?
7. Why is the API port not mapped to the host?
8. What does `docker compose down` remove?

## Expected Result

The student should be able to open the frontend, click the button, and receive a response from the API container through the private Docker network.
