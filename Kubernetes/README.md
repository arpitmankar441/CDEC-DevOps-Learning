# ☸️ Kubernetes Fundamentals — Student Learning Guide

This section teaches Kubernetes from core concepts to deploying and troubleshooting a practical application.

> **Learning method:** Understand → Declare → Apply → Observe → Troubleshoot → Improve

## Prerequisites

Before starting, students should understand:

- Linux commands and processes
- Basic networking, ports and DNS
- Git fundamentals
- Docker images, containers, registries, volumes and Dockerfiles
- Basic YAML syntax

## Learning outcomes

After completing this section, a student should be able to:

- Explain why container orchestration is needed.
- Describe the Kubernetes control plane and worker-node components.
- Use `kubectl` to inspect and manage cluster resources.
- Write valid manifests for Pods, Deployments and Services.
- Configure applications with ConfigMaps and Secrets.
- Use health probes, resource requests and limits.
- Perform scaling, rolling updates and rollbacks.
- Explain persistent storage, StatefulSets, DaemonSets and Jobs.
- Diagnose common scheduling, image, networking and configuration failures.
- Deploy a multi-component application on a local learning cluster.

## Roadmap

1. Kubernetes and container orchestration
2. Cluster architecture
3. Local learning environment and `kubectl`
4. Kubernetes objects and YAML
5. Pods
6. Labels, selectors and namespaces
7. ReplicaSets and Deployments
8. Services and networking
9. ConfigMaps and Secrets
10. Probes and resource management
11. Storage
12. StatefulSets, DaemonSets and Jobs
13. Scaling and application updates
14. Ingress and Gateway API
15. Security basics
16. Troubleshooting
17. Labs, assignment and mini project

---

# 1. Kubernetes and container orchestration

## What is Kubernetes?

Kubernetes, commonly called K8s, is an open-source container orchestration system for automating the deployment, scaling and management of containerized applications.

## Why is orchestration needed?

Running one container manually is simple. Running many application replicas across multiple machines creates additional problems:

- Where should each container run?
- What happens when a container or node fails?
- How do clients find changing container IP addresses?
- How do we scale applications?
- How do we update without unnecessary downtime?
- How do we provide configuration, secrets and persistent storage?

Kubernetes addresses these problems through declarative desired state and controllers that continuously reconcile actual state toward desired state.

## Docker versus Kubernetes

| Docker | Kubernetes |
|---|---|
| Builds and runs containers | Orchestrates containerized workloads across a cluster |
| Manages images, containers, local networks and volumes | Manages Pods, controllers, Services, configuration and cluster resources |
| Commonly used during application development and packaging | Commonly used for deployment, resilience and scaling |

Docker and Kubernetes are not direct replacements. Students can build an OCI-compatible image with Docker and run it through a Kubernetes-supported container runtime.

> Kubernetes no longer uses Docker Engine directly as a built-in runtime. Current clusters commonly use CRI-compatible runtimes such as containerd or CRI-O. Docker-built images still work because they follow standard image formats.

## What Kubernetes does not automatically provide

Kubernetes is not a complete platform by itself. Logging, monitoring, CI/CD, image registries, secret-management strategy and application-level data protection require additional design and tools.

---

# 2. Cluster architecture

A Kubernetes cluster contains a control plane and one or more worker nodes.

```text
User / CI system
       |
    kubectl
       |
  kube-apiserver
       |
  +----+--------------------+
  |    |                    |
etcd scheduler controller-manager
       |
  Worker nodes
  ├── kubelet
  ├── container runtime
  ├── network implementation
  └── Pods
```

## Control-plane components

| Component | Responsibility |
|---|---|
| `kube-apiserver` | Exposes the Kubernetes API and validates API requests |
| `etcd` | Stores cluster state as a consistent key-value data store |
| `kube-scheduler` | Selects a suitable node for each unscheduled Pod |
| `kube-controller-manager` | Runs controllers that reconcile desired and actual state |
| `cloud-controller-manager` | Integrates supported cloud-provider resources when applicable |

## Worker-node components

| Component | Responsibility |
|---|---|
| `kubelet` | Ensures containers described by Pod specifications are running on the node |
| Container runtime | Pulls images and runs containers through the Container Runtime Interface |
| Network implementation | Provides Pod networking; behavior depends on the cluster networking setup |
| `kube-proxy` | Maintains Service networking rules where the cluster uses it |

## Desired-state workflow

1. A user submits a manifest to the API server.
2. The API server validates and stores the object state.
3. Controllers detect that resources must be created or changed.
4. The scheduler selects nodes for new Pods.
5. Kubelets start the requested containers.
6. Controllers continue watching and correcting differences.

---

# 3. Learning environment and `kubectl`

## Local cluster choices

- Minikube: beginner-friendly local cluster
- kind: Kubernetes nodes running as containers
- Docker Desktop Kubernetes: convenient desktop option when enabled

Use managed services such as Amazon EKS only after understanding local cluster fundamentals. Cloud clusters can create chargeable infrastructure.

Follow current official installation instructions:

- Tools: https://kubernetes.io/docs/tasks/tools/
- Minikube: https://minikube.sigs.k8s.io/docs/start/

Verify the client and cluster:

```bash
kubectl version --client
kubectl cluster-info
kubectl get nodes
kubectl config current-context
```

For Minikube:

```bash
minikube start
minikube status
kubectl get nodes
```

## Essential `kubectl` commands

```bash
kubectl get pods
kubectl get pods -A
kubectl get all
kubectl get pod POD -o wide
kubectl describe pod POD
kubectl logs POD
kubectl logs -f POD
kubectl logs POD -c CONTAINER
kubectl exec -it POD -- sh
kubectl get events --sort-by=.metadata.creationTimestamp
kubectl apply -f FILE.yaml
kubectl delete -f FILE.yaml
kubectl explain deployment.spec
```

Use short names carefully while learning:

```bash
kubectl get po
kubectl get deploy
kubectl get svc
kubectl get ns
```

---

# 4. Kubernetes objects and YAML

Kubernetes objects are records of intent stored through the Kubernetes API.

Most manifests contain:

```yaml
apiVersion: API_GROUP_AND_VERSION
kind: RESOURCE_KIND
metadata:
  name: RESOURCE_NAME
spec:
  # desired state
```

## Declarative and imperative approaches

Imperative example:

```bash
kubectl create deployment web --image=nginx:alpine
```

Declarative example:

```bash
kubectl apply -f deployment.yaml
```

Prefer declarative manifests for projects because they can be reviewed, version-controlled and reproduced.

Validate before applying:

```bash
kubectl apply --dry-run=client -f deployment.yaml
kubectl diff -f deployment.yaml
```

---

# 5. Pods

A Pod is the smallest deployable unit Kubernetes can create and manage. A Pod contains one or more tightly coupled containers that share networking and can share storage volumes.

## Pod manifest

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: student-web
  labels:
    app: student-web
spec:
  containers:
    - name: nginx
      image: nginx:alpine
      ports:
        - name: http
          containerPort: 80
```

Apply and inspect:

```bash
kubectl apply -f pod.yaml
kubectl get pod student-web -o wide
kubectl describe pod student-web
kubectl logs student-web
kubectl delete -f pod.yaml
```

## Multi-container Pods

Use multiple containers in one Pod only when they are tightly coupled and must share the Pod lifecycle or local resources. Common patterns include sidecar, adapter and ambassador-style helpers.

Containers in the same Pod:

- Share the same network namespace and Pod IP.
- Can communicate through `localhost` on different ports.
- Can mount shared volumes.
- Are scheduled together on the same node.

Do not place unrelated services in one Pod merely to reduce the number of objects.

## Pod lifecycle and restart behavior

Common Pod phases include Pending, Running, Succeeded, Failed and Unknown. A Pod is disposable; controllers usually replace failed Pods rather than repairing the same Pod identity.

---

# 6. Labels, selectors and namespaces

## Labels and selectors

Labels are key-value metadata used to organize and select objects.

```yaml
metadata:
  labels:
    app: student-api
    environment: development
```

Query by label:

```bash
kubectl get pods -l app=student-api
kubectl get pods -l environment=development
```

Services and workload controllers rely on selectors. Selector labels must match the intended Pod-template labels.

## Namespaces

Namespaces provide a scope for names and help organize resources.

```bash
kubectl create namespace student
kubectl get namespaces
kubectl get pods -n student
kubectl config set-context --current --namespace=student
```

Namespaces alone are not security boundaries. Use RBAC, network policies and other controls where isolation is required.

---

# 7. ReplicaSets and Deployments

## ReplicaSet

A ReplicaSet maintains a specified number of matching Pod replicas. Students should understand it, but normally create Deployments instead of managing ReplicaSets directly.

ReplicationController is an older mechanism. It is useful as historical context, but ReplicaSets and Deployments are the relevant learning path for new applications.

## Deployment

A Deployment declaratively manages ReplicaSets and Pods for a usually stateless workload. It supports scaling, rolling updates and rollback.

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: student-web
spec:
  replicas: 2
  selector:
    matchLabels:
      app: student-web
  template:
    metadata:
      labels:
        app: student-web
    spec:
      containers:
        - name: nginx
          image: nginx:1.27-alpine
          ports:
            - name: http
              containerPort: 80
          resources:
            requests:
              cpu: 50m
              memory: 32Mi
            limits:
              cpu: 200m
              memory: 128Mi
```

Commands:

```bash
kubectl apply -f deployment.yaml
kubectl get deployments
kubectl get replicasets
kubectl get pods -l app=student-web
kubectl scale deployment student-web --replicas=3
kubectl rollout status deployment/student-web
kubectl rollout history deployment/student-web
kubectl rollout undo deployment/student-web
```

---

# 8. Services and networking

Pod IP addresses can change. A Service provides a stable virtual endpoint for a selected group of Pods.

## Service types

| Type | Purpose |
|---|---|
| `ClusterIP` | Internal cluster access; default type |
| `NodePort` | Exposes a port on each node; useful for some learning/testing scenarios |
| `LoadBalancer` | Requests an external load balancer where the environment supports it |
| `ExternalName` | Maps a Service DNS name to an external DNS name |

## ClusterIP Service

```yaml
apiVersion: v1
kind: Service
metadata:
  name: student-web
spec:
  selector:
    app: student-web
  ports:
    - name: http
      port: 80
      targetPort: http
  type: ClusterIP
```

Apply and inspect:

```bash
kubectl apply -f service.yaml
kubectl get services
kubectl describe service student-web
kubectl get endpointslices -l kubernetes.io/service-name=student-web
```

For local Minikube testing:

```bash
kubectl port-forward service/student-web 8080:80
```

Open `http://localhost:8080` while the command is running.

## Networking principles

- Every Pod receives an IP address from the cluster networking implementation.
- Containers inside one Pod share that Pod network identity.
- Services select backend Pods using labels.
- Cluster DNS allows workloads to reach Services by name.
- NetworkPolicy can restrict allowed traffic when supported by the cluster network plugin.

If a Service has no endpoints, first compare its selector with the Pod labels.

---

# 9. ConfigMaps and Secrets

## ConfigMap

A ConfigMap stores non-confidential configuration.

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: student-api-config
data:
  APP_ENV: development
  LOG_LEVEL: info
```

## Secret

A Secret stores sensitive values for controlled consumption by Pods.

Create one without writing the plaintext value into a manifest:

```bash
kubectl create secret generic student-api-secret \
  --from-literal=DATABASE_PASSWORD='replace-me'
```

Consume configuration and Secret values:

```yaml
env:
  - name: APP_ENV
    valueFrom:
      configMapKeyRef:
        name: student-api-config
        key: APP_ENV
  - name: DATABASE_PASSWORD
    valueFrom:
      secretKeyRef:
        name: student-api-secret
        key: DATABASE_PASSWORD
```

> Base64 encoding is not encryption. Kubernetes Secrets require appropriate RBAC, encryption at rest and careful access controls. Do not commit real credentials to Git.

Commands:

```bash
kubectl get configmaps
kubectl describe configmap student-api-config
kubectl get secrets
kubectl describe secret student-api-secret
```

Avoid printing or sharing decoded Secret contents during demonstrations.

---

# 10. Probes and resource management

## Probes

| Probe | Question answered |
|---|---|
| Startup probe | Has the application finished starting? |
| Readiness probe | Should this Pod currently receive Service traffic? |
| Liveness probe | Is the application stuck and should its container restart? |

Example:

```yaml
startupProbe:
  httpGet:
    path: /health
    port: http
  failureThreshold: 30
  periodSeconds: 2
readinessProbe:
  httpGet:
    path: /ready
    port: http
  periodSeconds: 5
livenessProbe:
  httpGet:
    path: /health
    port: http
  periodSeconds: 10
```

Poorly designed liveness probes can create restart loops. A readiness failure removes the Pod from eligible Service traffic without necessarily restarting it.

## Requests and limits

```yaml
resources:
  requests:
    cpu: 100m
    memory: 128Mi
  limits:
    cpu: 500m
    memory: 256Mi
```

- The scheduler uses requests when placing Pods.
- Limits constrain permitted resource usage.
- Exceeding a memory limit can cause an `OOMKilled` container.
- CPU limits can cause throttling.

---

# 11. Persistent storage

## Main objects

| Object | Purpose |
|---|---|
| PersistentVolume (PV) | Cluster storage resource |
| PersistentVolumeClaim (PVC) | Workload request for storage |
| StorageClass | Describes a storage class and commonly enables dynamic provisioning |

Example claim:

```yaml
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: student-data
spec:
  accessModes:
    - ReadWriteOnce
  resources:
    requests:
      storage: 1Gi
```

Mount it in a Pod template:

```yaml
volumeMounts:
  - name: data
    mountPath: /data
volumes:
  - name: data
    persistentVolumeClaim:
      claimName: student-data
```

Storage behavior depends on the cluster and StorageClass. Deleting a workload does not necessarily delete its PVC or underlying storage. Understand reclaim policies before deleting production resources.

---

# 12. Other workload controllers

## StatefulSet

Use a StatefulSet when workloads need stable identities, ordered behavior or stable per-replica storage. Typical examples include clustered databases and stateful distributed systems.

Do not assume every database must run in Kubernetes; managed database services are often operationally simpler.

## DaemonSet

A DaemonSet ensures a Pod runs on all or selected nodes. Common uses include node-level log collectors, monitoring agents and networking components.

## Job and CronJob

- Job: runs work to completion.
- CronJob: creates Jobs according to a schedule.

```yaml
apiVersion: batch/v1
kind: CronJob
metadata:
  name: student-report
spec:
  schedule: "0 2 * * *"
  jobTemplate:
    spec:
      template:
        spec:
          restartPolicy: OnFailure
          containers:
            - name: report
              image: busybox:1.36
              command: ["sh", "-c", "date; echo generating-report"]
```

---

# 13. Scaling and application updates

## Manual scaling

```bash
kubectl scale deployment student-web --replicas=4
```

## Horizontal Pod Autoscaler

HPA adjusts replica count using observed metrics. CPU-based scaling normally requires:

- Metrics Server or another supported metrics source
- Resource requests on the target Pods
- A scalable controller such as a Deployment

```bash
kubectl autoscale deployment student-web \
  --cpu-percent=60 \
  --min=2 \
  --max=10

kubectl get hpa
```

HPA scales Pods. Node scaling is a separate cluster-infrastructure concern.

## Rolling update and rollback

```bash
kubectl set image deployment/student-web nginx=nginx:1.27-alpine
kubectl rollout status deployment/student-web
kubectl rollout history deployment/student-web
kubectl rollout undo deployment/student-web
```

Use readiness probes so traffic is sent only to ready replicas during updates.

---

# 14. Ingress and Gateway API

Ingress routes HTTP(S) traffic to Services, but an Ingress resource requires an Ingress controller. Creating only an Ingress manifest does not create a working traffic implementation.

The Ingress API remains stable, but its API is frozen. The Kubernetes project recommends Gateway API for newer, more extensible traffic-routing designs. Gateway API is an add-on and requires a compatible implementation.

For beginners:

1. Learn Service networking first.
2. Learn an Ingress controller because Ingress is still widely used.
3. Then understand Gateway, GatewayClass and HTTPRoute.

Never assume controller-specific annotations work with every Ingress implementation.

---

# 15. Security basics

Student manifests should begin with these practices:

- Use trusted images and explicit image tags.
- Run containers as a non-root user when the image supports it.
- Disable privilege escalation where possible.
- Set resource requests and limits.
- Do not use privileged containers without a justified requirement.
- Keep configuration separate from images.
- Store confidential values in Secrets, not ConfigMaps.
- Apply least-privilege RBAC.
- Avoid mounting service-account tokens when they are unnecessary.
- Use NetworkPolicy where supported and required.
- Scan images and keep cluster components updated.

Example security context:

```yaml
securityContext:
  runAsNonRoot: true
  seccompProfile:
    type: RuntimeDefault
containers:
  - name: app
    securityContext:
      allowPrivilegeEscalation: false
      capabilities:
        drop:
          - ALL
```

Security settings must be compatible with the selected image; validate them during testing.

---

# 16. Troubleshooting workflow

Start with observation rather than deleting and recreating everything:

```bash
kubectl get pods -A
kubectl get pod POD -o wide
kubectl describe pod POD
kubectl logs POD
kubectl logs POD --previous
kubectl get events --sort-by=.metadata.creationTimestamp
kubectl get deployment,replicaset,pod
kubectl get service,endpointslice
kubectl get configmap,secret
kubectl top pods
kubectl top nodes
```

## Common states

### `Pending`

Check scheduling events, resource requests, node selectors, taints, PVC binding and available nodes.

### `ImagePullBackOff` or `ErrImagePull`

Check image name, tag, registry access and image-pull credentials.

### `CrashLoopBackOff`

Check current and previous logs, command/arguments, configuration, probes and application startup dependencies.

```bash
kubectl logs POD --previous
kubectl describe pod POD
```

### `CreateContainerConfigError`

Check referenced ConfigMaps, Secrets and their key names.

### Service has no traffic

Check:

1. Service selector matches Pod labels.
2. EndpointSlices contain ready endpoints.
3. `targetPort` matches the application listening port.
4. Readiness probes are succeeding.
5. Network policies allow the traffic.

### `OOMKilled`

Inspect memory usage, application behavior and configured memory requests/limits. Do not blindly increase limits without understanding the cause.

## Safe cleanup

Prefer deleting resources created from a known manifest:

```bash
kubectl delete -f manifest.yaml
```

Before deleting a namespace, PVC, StatefulSet or cloud `LoadBalancer` Service, understand which workloads, data or paid cloud resources may be affected.

---

# 17. Practical labs

## Lab 1 — Cluster and kubectl

1. Start a local cluster.
2. Inspect nodes, namespaces and cluster information.
3. Switch between namespaces.
4. Use `kubectl explain` to explore an object specification.

## Lab 2 — Pod observation

1. Apply the Nginx Pod manifest.
2. Inspect its IP, node, events and logs.
3. Enter the container.
4. Delete the Pod and explain why it does not return.

## Lab 3 — Deployment and self-healing

1. Create a Deployment with two replicas.
2. Delete one managed Pod.
3. Watch the Deployment replace it.
4. Scale to four replicas.

## Lab 4 — Service discovery

1. Expose the Deployment through ClusterIP.
2. Verify its EndpointSlices.
3. Access it using port-forwarding.
4. Break the Service selector, observe the result and repair it.

## Lab 5 — Configuration

1. Create a ConfigMap and Secret.
2. Consume them from a Deployment.
3. Verify the non-sensitive configuration without exposing Secret values.
4. Update configuration and observe whether a rollout is required.

## Lab 6 — Health and resources

1. Add startup, readiness and liveness probes.
2. Add CPU and memory requests/limits.
3. Intentionally break a readiness path.
4. Observe the Service endpoints and Pod events.

## Lab 7 — Update and rollback

1. Deploy a working image.
2. update to another valid version.
3. inspect rollout history.
4. deploy an invalid image tag.
5. diagnose and roll back.

---

# 18. Assignment and mini project

## Assignment questions

1. Why is Kubernetes needed when containers already exist?
2. Explain the control plane and worker-node components.
3. What is desired-state reconciliation?
4. Why should most applications use Deployments instead of standalone Pods?
5. Explain labels and selectors.
6. Compare ClusterIP, NodePort and LoadBalancer Services.
7. Explain ConfigMap versus Secret.
8. Why is base64 not security?
9. Compare readiness and liveness probes.
10. Explain requests versus limits.
11. Compare Deployment, StatefulSet and DaemonSet.
12. How would you troubleshoot `CrashLoopBackOff`?
13. Why can a Service have no endpoints?
14. What does HPA scale, and what prerequisites does it need?
15. Why does an Ingress resource require a controller?

## Mini project — Kubernetes application deployment

Deploy:

```text
Client → Service → API Deployment → Database
```

Requirements:

- Store all manifests in Git.
- Use a Namespace for project resources.
- Run the API through a Deployment with at least two replicas.
- Expose the API through a Service.
- Use ConfigMap for non-confidential configuration.
- Use a Secret for the database credential without committing a real credential.
- Add startup/readiness/liveness probes suitable for the application.
- Configure CPU and memory requests/limits.
- Use persistent storage if the database is hosted inside the learning cluster.
- Demonstrate a rolling update and rollback.
- Include architecture, setup, verification and troubleshooting documentation.

> For a first local project, running a database inside the cluster is acceptable for learning. It should not be presented as a complete production database architecture.

## Completion checklist

- [ ] I can explain Kubernetes architecture.
- [ ] I can write and apply manifests.
- [ ] I can manage Pods through Deployments.
- [ ] I can expose workloads through Services.
- [ ] I can use ConfigMaps and Secrets appropriately.
- [ ] I can configure probes and resources.
- [ ] I can perform scaling, updates and rollbacks.
- [ ] I can troubleshoot common Pod and Service failures.
- [ ] I completed the mini project.

---

# Official references

- Kubernetes documentation: https://kubernetes.io/docs/
- Cluster architecture: https://kubernetes.io/docs/concepts/architecture/
- Kubernetes components: https://kubernetes.io/docs/concepts/overview/components/
- Pods: https://kubernetes.io/docs/concepts/workloads/pods/
- Deployments: https://kubernetes.io/docs/concepts/workloads/controllers/deployment/
- Services and networking: https://kubernetes.io/docs/concepts/services-networking/
- ConfigMaps: https://kubernetes.io/docs/concepts/configuration/configmap/
- Secrets: https://kubernetes.io/docs/concepts/configuration/secret/
- Autoscaling: https://kubernetes.io/docs/concepts/workloads/autoscaling/
- Security checklist: https://kubernetes.io/docs/concepts/security/security-checklist/
- Install tools: https://kubernetes.io/docs/tasks/tools/

> Kubernetes evolves continuously. Check the documentation for the version used by your cluster, and keep `kubectl` within the supported version skew for that cluster.
