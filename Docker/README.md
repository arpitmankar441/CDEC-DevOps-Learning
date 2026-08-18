# 🐳 Docker Fundamentals — Student Learning Guide

This section teaches Docker from fundamentals to a practical multi-container application.

> **Learning method:** Understand → Run → Inspect → Break → Troubleshoot → Build

## Learning outcomes

After completing this section, a student should be able to:

- Explain images, containers, registries, volumes and networks.
- Install and verify Docker safely.
- Create, start, inspect, stop and remove containers.
- Build reproducible images with a Dockerfile.
- Persist data with named volumes and share development files with bind mounts.
- Connect services with a user-defined bridge network.
- Define a multi-container application with Docker Compose.
- Diagnose common container, port, image, network and storage problems.

## Roadmap

1. Containerization and Docker architecture
2. Installation and verification
3. Container lifecycle and commands
4. Images and registries
5. Port publishing and environment variables
6. Networking
7. Persistent storage
8. Dockerfiles and image builds
9. Docker Compose
10. Troubleshooting
11. Practical labs
12. Assignment and mini project

---

# 1. Containerization fundamentals

## Traditional deployment

An application is installed directly on a server with its runtime, libraries and configuration. Different applications can create dependency conflicts on the same server.

## Virtual machines and containers

| Area | Virtual machine | Container |
|---|---|---|
| Isolation | Separate guest operating system | Isolated processes sharing the host kernel |
| Startup | Usually slower | Usually faster |
| Size | Generally larger | Generally smaller |
| Typical use | Strong OS-level isolation and different kernels | Portable application packaging and rapid deployment |

Containers are not simply “lightweight virtual machines.” They isolate applications differently and normally share the host kernel.

## What is Docker?

Docker is a platform for building, distributing and running applications in containers.

### Core objects

| Object | Meaning |
|---|---|
| Dockerfile | Instructions used to build an image |
| Image | Immutable template containing an application and its required files |
| Container | A running or stopped instance of an image |
| Registry | Service that stores and distributes images |
| Volume | Docker-managed persistent data storage |
| Network | Communication boundary connecting containers |
| Compose file | YAML definition of a multi-container application |

## Docker architecture

The Docker CLI sends requests to the Docker daemon. The daemon builds images and manages containers, networks and volumes. Images can be pulled from or pushed to a registry such as Docker Hub or Amazon ECR.

```text
Docker CLI → Docker daemon → Images / Containers / Networks / Volumes
                              ↕
                           Registry
```

---

# 2. Install and verify Docker

Use the official installation instructions for your operating system because package names and supported versions change:

- Ubuntu: https://docs.docker.com/engine/install/ubuntu/
- Other Linux distributions: https://docs.docker.com/engine/install/
- Docker Desktop: https://docs.docker.com/desktop/

After installation, verify:

```bash
docker version
docker info
sudo systemctl status docker
sudo docker run --rm hello-world
```

## Run Docker without typing `sudo` every time

On a personal learning machine, add the current user to the Docker group:

```bash
sudo usermod -aG docker "$USER"
```

Log out and log back in, then test:

```bash
docker run --rm hello-world
```

> **Security warning:** Membership in the `docker` group grants root-level capabilities. Use it only for trusted users. Consider Docker rootless mode where appropriate.

## Unsafe instruction to avoid

Do **not** teach this as a normal fix:

```bash
sudo chmod 777 /var/run/docker.sock
```

It gives every local user read/write access to the Docker socket and creates a serious privilege risk. Fix group membership or use rootless mode instead.

---

# 3. Container lifecycle

## First container

```bash
docker run --name student-nginx -d -p 8080:80 nginx:alpine
```

Open `http://localhost:8080`.

The options mean:

| Option | Meaning |
|---|---|
| `--name student-nginx` | Gives the container a readable name |
| `-d` | Runs it in the background |
| `-p 8080:80` | Maps host port 8080 to container port 80 |
| `nginx:alpine` | Image name and tag |

## Essential commands

```bash
docker ps
docker ps -a
docker logs student-nginx
docker logs -f student-nginx
docker inspect student-nginx
docker stats
docker exec -it student-nginx sh
docker stop student-nginx
docker start student-nginx
docker restart student-nginx
docker rm -f student-nginx
```

## `run`, `create`, `start` and `exec`

- `docker create` creates a stopped container.
- `docker start` starts an existing stopped container.
- `docker run` creates and starts a new container.
- `docker exec` runs another command inside an already-running container.

## Container lifecycle

```text
Created → Running → Stopped → Removed
             ↕
           Paused
```

Removing a container does not automatically remove its image or named volumes.

---

# 4. Images and registries

## Image naming

```text
[registry/][namespace/]repository[:tag]
```

Examples:

```text
nginx:alpine
username/student-api:v1
123456789012.dkr.ecr.ap-south-1.amazonaws.com/student-api:v1
```

If no tag is supplied, Docker commonly uses `latest`. `latest` does not mean “newest verified version”; it is only a tag.

## Image commands

```bash
docker image ls
docker pull nginx:alpine
docker image inspect nginx:alpine
docker tag student-api:v1 username/student-api:v1
docker push username/student-api:v1
docker image rm nginx:alpine
docker history student-api:v1
```

Use trusted images, prefer explicit tags and never put passwords or API keys inside an image.

`docker commit` can capture changes from a container, but it is not the normal reproducible workflow. Use a Dockerfile for application images.

---

# 5. Ports and configuration

## Port publishing

```bash
docker run -d -p 127.0.0.1:8080:80 nginx:alpine
```

Format:

```text
[host-address:]host-port:container-port
```

Binding to `127.0.0.1` limits access to the Docker host. Publishing without a host address can expose the port through all host interfaces, depending on host configuration.

## `EXPOSE` versus `-p`

- `EXPOSE 3000` documents that the image expects to listen on port 3000.
- `docker run -p 8080:3000 ...` publishes that port on the host.
- `EXPOSE` alone does not make the application publicly accessible.

## Environment variables

```bash
docker run --rm -e APP_ENV=development alpine env
```

For sensitive values, use an appropriate secrets mechanism. Do not commit `.env` files containing secrets.

---

# 6. Docker networking

## Common drivers

| Driver | Beginner use |
|---|---|
| `bridge` | Containers communicating on one Docker host |
| `host` | Container shares the host network namespace; Linux-specific trade-offs |
| `none` | Container has no external network connectivity |
| `overlay` | Multi-host communication in Docker Swarm |

For a normal multi-container project on one host, create a user-defined bridge network.

```bash
docker network create student-net

docker run -d --name database \
  --network student-net \
  -e MARIADB_ROOT_PASSWORD=learning-only \
  mariadb:11

docker run --rm --network student-net busybox ping -c 3 database
```

Containers on the same user-defined bridge network can discover each other by container name or network alias.

Useful commands:

```bash
docker network ls
docker network inspect student-net
docker network connect student-net CONTAINER
docker network disconnect student-net CONTAINER
docker network rm student-net
```

Do not create custom subnets unless the project requires them. Avoid CIDR ranges that overlap with the host, VPN, cloud VPC or other Docker networks.

---

# 7. Persistent storage

Container writable layers are not the right place for important persistent data.

## Named volume

Docker creates and manages the storage location.

```bash
docker volume create student-data

docker run --rm \
  --mount source=student-data,target=/data \
  alpine sh -c 'echo "persistent" > /data/message.txt'

docker run --rm \
  --mount source=student-data,target=/data \
  alpine cat /data/message.txt
```

## Bind mount

A specific host path is mounted into a container.

```bash
docker run --rm \
  --mount type=bind,source="$(pwd)",target=/workspace,readonly \
  alpine ls /workspace
```

## Volume versus bind mount

| Area | Named volume | Bind mount |
|---|---|---|
| Managed by | Docker | User/host filesystem |
| Portability | Better | Depends on host path |
| Common use | Databases and application data | Development source code and configuration |
| Host coupling | Lower | Higher |

Prefer `--mount` in teaching examples because its fields are explicit.

Commands:

```bash
docker volume ls
docker volume inspect student-data
docker volume rm student-data
docker volume prune
```

> `docker volume prune` removes unused volumes. Inspect the target environment before confirming cleanup.

---

# 8. Dockerfiles

A Dockerfile makes image creation repeatable and reviewable.

## Node.js example

```dockerfile
FROM node:22-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --omit=dev

COPY . .

ENV NODE_ENV=production
EXPOSE 3000

USER node
CMD ["node", "server.js"]
```

Build and run:

```bash
docker build -t student-api:v1 .
docker run --rm -p 3000:3000 student-api:v1
```

## Important instructions

| Instruction | Purpose |
|---|---|
| `FROM` | Selects the base image |
| `WORKDIR` | Sets the working directory |
| `COPY` | Copies files from the build context |
| `RUN` | Executes a command while building |
| `ENV` | Defines runtime environment variables |
| `ARG` | Defines build-time variables; not suitable for secrets |
| `EXPOSE` | Documents the intended listening port |
| `USER` | Selects the runtime user |
| `CMD` | Provides the default container command |
| `ENTRYPOINT` | Configures the executable run for the container |

## `RUN`, `CMD` and `ENTRYPOINT`

- `RUN` executes during image build and creates an image layer.
- `CMD` supplies the default runtime command or default arguments.
- `ENTRYPOINT` makes the container behave like a specific executable.

Prefer JSON/exec form:

```dockerfile
CMD ["node", "server.js"]
```

## `.dockerignore`

```text
node_modules
.git
.env
npm-debug.log
README.md
```

## Basic good practices

- Use a small, trusted base image suitable for the application.
- Pin deliberate versions/tags and update them regularly.
- Copy dependency manifests before source code to improve build cache reuse.
- Use multi-stage builds where they materially reduce the final image.
- Run as a non-root user when possible.
- Never copy credentials, private keys or `.env` secrets into the image.
- Keep the build context small with `.dockerignore`.

---

# 9. Docker Compose

Docker Compose defines and runs a multi-container application using YAML.

Use the modern command:

```bash
docker compose version
```

The older `docker-compose` command belongs to Compose v1 and should not be the main command in new notes.

## Example `compose.yaml`

```yaml
services:
  api:
    build: ./api
    ports:
      - "127.0.0.1:3000:3000"
    environment:
      DB_HOST: database
      DB_PORT: "5432"
    depends_on:
      database:
        condition: service_healthy

  database:
    image: postgres:17-alpine
    environment:
      POSTGRES_DB: studentdb
      POSTGRES_USER: student
      POSTGRES_PASSWORD: learning-only
    volumes:
      - database-data:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U student -d studentdb"]
      interval: 5s
      timeout: 3s
      retries: 10

volumes:
  database-data:
```

Compose automatically creates a project network. The API connects to PostgreSQL using hostname `database`, not `localhost`.

## Compose commands

```bash
docker compose config
docker compose up --build
docker compose up -d --build
docker compose ps
docker compose logs -f
docker compose exec api sh
docker compose stop
docker compose down
docker compose down --volumes
```

`docker compose down --volumes` deletes named volumes declared by the project and can destroy database data. Use it only when that deletion is intended.

`depends_on` controls startup order. Application readiness requires a health check and, in real systems, retry logic in the dependent application.

---

# 10. Troubleshooting workflow

Use this sequence instead of randomly reinstalling Docker:

```bash
docker ps -a
docker logs CONTAINER
docker inspect CONTAINER
docker stats
docker network ls
docker volume ls
docker system df
```

For Compose:

```bash
docker compose config
docker compose ps
docker compose logs -f SERVICE
```

## Common problems

### Port already in use

Choose another host port or stop the process/container already using it.

```bash
docker ps --format 'table {{.Names}}\t{{.Ports}}'
```

### Container exits immediately

Containers stop when their main process exits.

```bash
docker ps -a
docker logs CONTAINER
docker inspect CONTAINER
```

### Permission denied on Docker socket

Verify group membership, log out and back in, or use `sudo` temporarily. Do not solve it with socket permissions set to `777`.

### Services cannot communicate

Check that both containers share a network and use the service/container name as the hostname.

```bash
docker network inspect NETWORK
```

### Data disappeared

Check whether the application wrote to a named volume or only to the container writable layer.

```bash
docker volume ls
docker inspect CONTAINER
```

## Cleanup safety

Avoid publishing commands such as the following as routine student cleanup:

```bash
docker rm -f $(docker ps -aq)
docker rmi -f $(docker images -aq)
```

They target every container or image visible to the current Docker daemon. Teach students to list and remove specific resources first.

---

# 11. Practical labs

## Lab 1 — Container lifecycle

1. Run Nginx on host port 8080.
2. Open it in a browser.
3. inspect its logs and metadata.
4. Stop, start and remove it.

## Lab 2 — Persistent data

1. Create a named volume.
2. Write a file into it from one container.
3. Remove that container.
4. Read the same file from another container.
5. Explain why the data survived.

## Lab 3 — Container networking

1. Create a user-defined bridge network.
2. Run two containers on it.
3. Resolve one container by name from the other.
4. Disconnect one container and observe the failure.

## Lab 4 — Build an image

1. Create a small Node.js or static Nginx application.
2. Write a Dockerfile and `.dockerignore`.
3. Build an explicitly tagged image.
4. Run and test it.
5. Inspect its image history.

## Lab 5 — Compose application

1. Define an API and database in `compose.yaml`.
2. Add a named database volume.
3. Add a database health check.
4. Start the application.
5. Read logs and enter the API container.
6. Stop without deleting data, restart and verify persistence.

---

# 12. Assignment and mini project

## Assignment questions

1. Explain image versus container.
2. Explain `docker run` versus `docker exec`.
3. Explain `EXPOSE` versus `-p`.
4. Compare named volumes and bind mounts.
5. Why is a user-defined bridge network useful?
6. Explain `RUN`, `CMD` and `ENTRYPOINT`.
7. Why should secrets not be copied into an image?
8. What does `docker compose down --volumes` remove?
9. Why is `depends_on` alone insufficient for readiness?
10. Why is `chmod 777 /var/run/docker.sock` unsafe?

## Mini project — Three-tier application

Build and document:

```text
Browser → Frontend → API → Database
```

Requirements:

- Frontend and API each have a Dockerfile.
- Database uses an official image and named volume.
- Services run through `compose.yaml`.
- Only required ports are published.
- Internal services communicate by Compose service name.
- Database includes a health check.
- Secrets are not committed to Git.
- README includes setup, architecture, commands, screenshots and troubleshooting notes.

## Completion checklist

- [ ] I can explain every core Docker object.
- [ ] I can run and inspect containers.
- [ ] I can build a reproducible image.
- [ ] I can choose between a volume and bind mount.
- [ ] I can connect containers by service name.
- [ ] I can run a multi-container application with Compose.
- [ ] I can troubleshoot using logs and inspect commands.
- [ ] I completed the mini project.

---

# Official references

- Docker Engine installation: https://docs.docker.com/engine/install/
- Linux post-installation: https://docs.docker.com/engine/install/linux-postinstall/
- Docker networking: https://docs.docker.com/engine/network/
- Docker volumes: https://docs.docker.com/engine/storage/volumes/
- Bind mounts: https://docs.docker.com/engine/storage/bind-mounts/
- Docker Compose: https://docs.docker.com/compose/
- Dockerfile best practices: https://docs.docker.com/build/building/best-practices/

> This guide should be used with hands-on practice. Commands that delete resources or expose host access must be understood before execution.
