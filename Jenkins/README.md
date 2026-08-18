# ⚙️ Jenkins and CI/CD — Student Learning Guide

This section teaches Jenkins from CI/CD fundamentals to secure Pipeline-as-Code workflows using Git, Maven, Docker, AWS and Terraform.

> **Learning method:** Commit → Trigger → Build → Test → Package → Review → Deploy → Observe

## Prerequisites

Students should understand:

- Linux commands, users, services and permissions
- Git and GitHub fundamentals
- A build tool such as Maven, Gradle or npm
- Docker fundamentals before attempting Docker pipelines
- AWS and Terraform fundamentals before attempting infrastructure pipelines

## Learning outcomes

After completing this section, a student should be able to:

- Explain Continuous Integration, Continuous Delivery and Continuous Deployment.
- Describe Jenkins controller, node, agent, executor, workspace, job and build.
- Install and perform the initial setup of Jenkins safely.
- Create a Freestyle job and understand its limitations.
- Store a Declarative Pipeline in a version-controlled `Jenkinsfile`.
- Build, test, archive and publish real results.
- Use credentials without exposing secrets in Pipeline code or logs.
- Run builds on labelled agents instead of depending on the controller.
- Integrate Git webhooks or multibranch discovery.
- Build and push a Docker image safely.
- Create a reviewed Terraform plan before an approved apply.
- Troubleshoot common SCM, agent, tool, permission and Pipeline failures.

## Roadmap

1. CI/CD fundamentals
2. Jenkins architecture and terminology
3. Installation and initial security
4. Jobs, builds and workspaces
5. Freestyle fundamentals
6. Pipeline as Code
7. Build, test and artifact reporting
8. Parameters, environment and post actions
9. Credentials and secret safety
10. Agents, labels and executors
11. Git integration and multibranch Pipelines
12. Docker Pipeline
13. AWS artifact publishing
14. Terraform plan and approved apply
15. Pipeline reliability and security
16. Troubleshooting
17. Labs, assignment and mini project

---

# 1. CI/CD fundamentals

## Continuous Integration

Developers merge small changes frequently. Automated builds and tests provide rapid feedback about whether the integrated code remains healthy.

## Continuous Delivery

The software remains in a releasable state, and deployment to production normally requires an explicit business or technical approval.

## Continuous Deployment

Every change that passes the required automated controls can be deployed automatically to production.

Continuous Delivery and Continuous Deployment are related but not identical.

## Typical delivery flow

```text
Source checkout
      ↓
Dependency installation
      ↓
Build / compile
      ↓
Static analysis
      ↓
Automated tests
      ↓
Package artifact or image
      ↓
Publish artifact
      ↓
Deploy with approval/policy
      ↓
Verify and monitor
```

Jenkins orchestrates these activities. It does not replace Git, Maven, Gradle, npm, Docker, Terraform, testing frameworks or monitoring systems.

---

# 2. Jenkins architecture and terminology

| Term | Meaning |
|---|---|
| Controller | Jenkins service that manages configuration, scheduling, security and job orchestration |
| Node | Machine available to Jenkins for executing work |
| Agent | Process connected to the controller that executes tasks on a node |
| Executor | Slot that can run one task at a time on a node |
| Job/Item | Configured unit of work, such as a Pipeline or Freestyle project |
| Build | One execution of a job |
| Workspace | Directory where a build checks out and processes project files |
| Stage | Logical Pipeline phase such as Build, Test or Deploy |
| Step | Individual Pipeline operation inside a stage |
| Artifact | Build output retained for later download or publishing |
| Plugin | Extension that adds Jenkins capabilities or integrations |

## Controller and agent model

```text
Users / Git webhook
         |
  Jenkins controller
  ├── UI and API
  ├── Job configuration
  ├── Credentials metadata
  └── Scheduling
         |
   +-----+----------------+
   |                      |
Linux agent           Docker agent
executors             executors
```

For serious use, do not run general builds on the built-in controller node. Configure its executor count to `0` and use dedicated agents. This improves security, scalability and reliability.

An agent needs the tools required by its assigned job. Installing Maven on the controller does not make Maven available on every agent.

---

# 3. Installation and initial security

Jenkins and Java requirements change across releases. Follow the current official installation page:

- Linux installation: https://www.jenkins.io/doc/book/installing/linux/
- Java requirements: https://www.jenkins.io/doc/book/platform-information/support-policy-java/

Current Jenkins releases require a supported modern Java version. Java 21 is a suitable teaching baseline for current Jenkins LTS releases; always verify the exact LTS requirements before installation.

Typical Ubuntu preparation begins with:

```bash
sudo apt update
sudo apt install -y fontconfig openjdk-21-jre
java -version
```

Then use the commands from the current Jenkins Linux installation documentation to add the official repository and install Jenkins. Do not copy an old repository-signing key from historical notes without verifying it.

Verify the service:

```bash
sudo systemctl status jenkins
sudo journalctl -u jenkins --no-pager -n 100
```

## Initial setup

1. Open Jenkins through the intended URL.
2. Retrieve the one-time initial administrator password from the path shown by the installer.
3. Create a named administrator account.
4. Install only required, maintained plugins.
5. Configure the public Jenkins URL.
6. Configure authentication and authorization.
7. Add HTTPS through an approved reverse proxy or platform design.
8. Back up `JENKINS_HOME` and test restoration.

## Minimum security principles

- Do not allow anonymous administration or builds.
- Do not expose Jenkins directly to the internet without appropriate protection.
- Use least-privilege authorization.
- Keep Jenkins core, Java and plugins updated using a tested upgrade process.
- Install only required plugins from trusted sources.
- Protect credentials, controller files and backups.
- Use CSRF protection and secure session configuration.
- Run untrusted builds only on isolated agents without trusted credentials.

---

# 4. Jobs, builds and workspaces

## Common job types

| Job type | Use |
|---|---|
| Freestyle | UI-configured introductory or simple automation job |
| Pipeline | Pipeline defined in the UI or, preferably, a Jenkinsfile |
| Multibranch Pipeline | Automatically discovers branches and pull requests containing Jenkinsfiles |
| Folder | Organizes jobs and supports scoped configuration/credentials |

## Workspace is not permanent storage

The workspace may be cleaned, reused or placed on a temporary agent. Important outputs should be:

- Archived for short-term Jenkins access
- Published to an artifact repository
- Pushed to a container registry
- Stored in an approved external system

Do not rely on a workspace as a backup.

## Build status

- Success: all required steps completed.
- Unstable: build completed, but quality signals such as tests may have failed.
- Failed: a required step returned an error or Pipeline logic marked failure.
- Aborted: stopped manually, by timeout or by superseding policy.

---

# 5. Freestyle fundamentals

A Freestyle job can teach Jenkins UI concepts. It does not define real Pipeline `stage` objects. It has configuration sections such as SCM, build steps and post-build actions.

## Safe classroom lab

### Create the job

1. Select **New Item**.
2. Enter `student-freestyle-demo`.
3. Select **Freestyle project**.
4. Choose an assigned learning agent label if configured.

### Source checkout

Under **Source Code Management**, select Git and provide a public learning repository or an approved student repository.

Avoid hard-coding `main` or `master` unless that repository actually uses the selected branch.

### Build step

Add **Execute shell**:

```bash
set -eu

mkdir -p build
printf 'Build number: %s\n' "$BUILD_NUMBER" > build/report.txt

test -n "$WORKSPACE"
test -f build/report.txt

echo "Real validation passed: build/report.txt exists"
```

This performs an actual shell assertion. Printing `10 tests passed` without running tests is not a valid test stage.

### Archive

Add **Archive the artifacts** with:

```text
build/report.txt
```

Do not archive `**/*`; that can retain source files, temporary data or secrets unnecessarily.

### Review

Run **Build Now**, open the build, inspect **Console Output**, and download only the expected artifact.

---

# 6. Pipeline as Code

A `Jenkinsfile` stored with application code provides review history, reproducibility and a single source of truth.

Jenkins supports Declarative and Scripted Pipeline syntax. Teach Declarative Pipeline first because its structure and validation are clearer for beginners.

## Minimal Declarative Pipeline

```groovy
pipeline {
    agent { label 'linux' }

    options {
        timestamps()
        timeout(time: 15, unit: 'MINUTES')
        disableConcurrentBuilds()
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Build') {
            steps {
                sh './scripts/build.sh'
            }
        }

        stage('Test') {
            steps {
                sh './scripts/test.sh'
            }
        }

        stage('Package') {
            steps {
                sh './scripts/package.sh'
            }
        }
    }

    post {
        always {
            archiveArtifacts artifacts: 'dist/**/*', allowEmptyArchive: true
        }
        cleanup {
            deleteDir()
        }
    }
}
```

`checkout scm` checks out the revision associated with the Pipeline trigger. This is safer for branch and pull-request jobs than hard-coding a repository and branch in every Jenkinsfile.

## Declarative structure

| Directive | Purpose |
|---|---|
| `pipeline` | Defines the Declarative Pipeline |
| `agent` | Selects where work runs |
| `options` | Configures timeout, timestamps, concurrency and other behavior |
| `environment` | Defines non-secret or credential-backed environment values |
| `parameters` | Defines build inputs |
| `stages` | Contains logical stages |
| `stage` | Names one logical phase |
| `steps` | Contains executable steps |
| `when` | Applies conditional stage execution |
| `post` | Defines actions after success, failure, unstable result or completion |

---

# 7. Real build, test and artifacts

## Maven example

Expected repository:

```text
project/
├── Jenkinsfile
└── backend/
    ├── pom.xml
    └── src/
```

Pipeline:

```groovy
pipeline {
    agent { label 'maven' }

    tools {
        jdk 'jdk21'
        maven 'maven3'
    }

    options {
        timestamps()
        timeout(time: 20, unit: 'MINUTES')
        disableConcurrentBuilds()
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Build and Test') {
            steps {
                dir('backend') {
                    sh 'mvn --batch-mode clean verify'
                }
            }
        }
    }

    post {
        always {
            junit testResults: 'backend/target/surefire-reports/*.xml',
                  allowEmptyResults: false
        }
        success {
            archiveArtifacts artifacts: 'backend/target/*.jar',
                             fingerprint: true
        }
        cleanup {
            deleteDir()
        }
    }
}
```

Do not use `-DskipTests` in the main CI verification stage. A separate packaging workflow may skip tests only when an earlier trusted stage has already executed and recorded them for the exact same revision.

## Artifact versus stash

| Feature | Purpose |
|---|---|
| `archiveArtifacts` | Retains downloadable build outputs beyond the Pipeline run |
| `stash` / `unstash` | Transfers temporary files between stages/agents in the same Pipeline run |

Large or long-lived artifacts belong in a dedicated repository such as Nexus, Artifactory, cloud object storage or a container registry.

---

# 8. Parameters, environment and post actions

## Parameters

```groovy
parameters {
    choice(name: 'ENVIRONMENT',
           choices: ['dev', 'stage'],
           description: 'Approved deployment environment')
    booleanParam(name: 'RUN_DEPLOY',
                 defaultValue: false,
                 description: 'Request deployment after verification')
}
```

Validate user-controlled parameters before passing them to shell commands. Avoid Groovy interpolation of untrusted values into `sh`.

## Conditional deployment

```groovy
stage('Deploy') {
    when {
        allOf {
            branch 'main'
            expression { params.RUN_DEPLOY }
        }
    }
    steps {
        input message: "Deploy to ${params.ENVIRONMENT}?",
              ok: 'Approve deployment'
        sh './scripts/deploy.sh'
    }
}
```

An `input` step is an educational approval gate, not a complete enterprise release-control system. Authorization, separation of duties and audit requirements must also be designed.

## Post actions

```groovy
post {
    always {
        junit testResults: '**/target/surefire-reports/*.xml',
              allowEmptyResults: false
    }
    failure {
        echo 'Build failed. Review console output and test reports.'
    }
    cleanup {
        deleteDir()
    }
}
```

---

# 9. Credentials and secret safety

Store credentials in Jenkins Credentials and reference credential IDs. Do not write secrets directly into a Jenkinsfile.

## Secret-text example

```groovy
withCredentials([string(credentialsId: 'registry-token', variable: 'REGISTRY_TOKEN')]) {
    sh '''
        set +x
        some-command --token "$REGISTRY_TOKEN"
    '''
}
```

Use single-quoted Groovy strings so the shell expands the environment variable. Do not use a Groovy GString such as `"${REGISTRY_TOKEN}"` for secrets.

Credential masking reduces accidental disclosure but does not make arbitrary Pipeline code safe. Untrusted Pipeline code with access to a secret can intentionally exfiltrate it.

## Docker registry login

Do not use:

```bash
docker login -u username -p PASSWORD
```

The password may appear in process arguments or logs.

Use a Jenkins username/password credential:

```groovy
withCredentials([usernamePassword(
    credentialsId: 'docker-registry',
    usernameVariable: 'REGISTRY_USER',
    passwordVariable: 'REGISTRY_PASSWORD'
)]) {
    sh '''
        set +x
        printf '%s' "$REGISTRY_PASSWORD" |
          docker login --username "$REGISTRY_USER" --password-stdin
    '''
}
```

Log out during cleanup where appropriate, and do not allow untrusted builds to share a Docker credential directory.

## AWS credentials

For Jenkins agents running on AWS, prefer an appropriately scoped IAM role with short-lived credentials. Avoid `sudo -u jenkins aws configure` with long-lived access keys as the standard teaching method.

If a non-AWS learning environment must use stored credentials, use an approved Jenkins credential binding with minimum permissions and rotation. Never print credential values.

Verify identity before cloud actions:

```bash
aws sts get-caller-identity
```

---

# 10. Agents, labels and executors

## Labels

Labels describe agent capabilities:

```groovy
agent { label 'linux && docker' }
```

Do not use a label as proof of security. It is a scheduling expression; agent hardening and authorization remain separate concerns.

## Executor planning

- One executor per agent is a safe starting point.
- Increase only after monitoring CPU, memory, disk and I/O contention.
- Separate high-risk or high-resource workloads.
- Prefer ephemeral agents where practical.

## Docker access warning

Adding the Jenkins user to the host Docker group normally grants root-equivalent control of that host. Do not use `chmod 777 /var/run/docker.sock`.

Prefer isolated build agents and assess rootless/containerized build alternatives according to your environment.

## Tool configuration

Tools may be:

- Installed on the agent image
- Configured under **Manage Jenkins → Tools**
- Provided by a containerized agent

The name in the Jenkinsfile must exactly match the configured Jenkins tool name.

---

# 11. Git integration and multibranch Pipelines

## Recommended repository structure

```text
application/
├── Jenkinsfile
├── src/
├── tests/
├── scripts/
└── README.md
```

## Webhook flow

```text
Git push / pull request
        ↓
Provider webhook
        ↓
Jenkins job discovery/trigger
        ↓
Checkout exact revision
        ↓
Pipeline execution
```

Protect the webhook endpoint, verify provider configuration and avoid unrestricted public access to Jenkins.

## Multibranch Pipeline

A Multibranch Pipeline discovers branches and pull requests that contain a Jenkinsfile. It is preferable to manually creating a separate Pipeline job for each branch.

Security warning: Pull requests from forks or untrusted contributors must not automatically receive production credentials or deploy permissions.

Use branch protection so required CI checks must pass before merge.

---

# 12. Docker Pipeline

## Safe learning flow

```text
Checkout → Test → Build image → Scan → Push immutable tag
```

Avoid using only `latest`. Tag an image with an immutable revision such as the Git commit.

```groovy
pipeline {
    agent { label 'linux && docker' }

    environment {
        IMAGE_REPOSITORY = 'example/student-frontend'
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Test') {
            steps {
                dir('frontend') {
                    sh './scripts/test.sh'
                }
            }
        }

        stage('Build Image') {
            steps {
                dir('frontend') {
                    sh '''
                        docker build \
                          --tag "$IMAGE_REPOSITORY:$GIT_COMMIT" \
                          .
                    '''
                }
            }
        }

        stage('Push Image') {
            when { branch 'main' }
            steps {
                withCredentials([usernamePassword(
                    credentialsId: 'docker-registry',
                    usernameVariable: 'REGISTRY_USER',
                    passwordVariable: 'REGISTRY_PASSWORD'
                )]) {
                    sh '''
                        set +x
                        printf '%s' "$REGISTRY_PASSWORD" |
                          docker login --username "$REGISTRY_USER" --password-stdin
                        docker push "$IMAGE_REPOSITORY:$GIT_COMMIT"
                    '''
                }
            }
        }
    }

    post {
        always {
            sh 'docker logout || true'
            deleteDir()
        }
    }
}
```

Add an image-scanning stage using an approved scanner before publishing or deployment. Define how failures are handled; do not install scanners dynamically from unverified shell URLs inside every build.

Do not deploy with `docker run -it` in CI: `-it` requests an interactive terminal and can block the build. Deployment should use a controlled platform and idempotent process.

---

# 13. Publishing an artifact to AWS S3

S3 can store learning artifacts, but a dedicated artifact repository may provide stronger package metadata, retention and dependency features.

## Prerequisites

- Agent has AWS CLI.
- Jenkins/AWS identity has only the required bucket actions.
- Bucket encryption, versioning, public-access controls and retention are configured.
- Artifact path includes a unique version or build identifier.

## Pipeline stage

```groovy
stage('Publish Artifact') {
    when { branch 'main' }
    steps {
        sh '''
            set -eu
            aws sts get-caller-identity
            aws s3 cp \
              backend/target/student-app.jar \
              "s3://student-artifacts/backend/$BUILD_NUMBER/student-app.jar"
        '''
    }
}
```

Do not hard-code a personal bucket, repository or fixed SNAPSHOT filename in reusable teaching notes. Parameterize or document expected values.

The Pipeline: AWS Steps plugin can also provide AWS-specific steps, but every plugin increases maintenance and attack surface. Use it only when its features are needed and keep it updated.

---

# 14. Terraform plan and approved apply

Terraform in CI must preserve the plan-review boundary.

Do not teach this as the default:

```groovy
sh 'terraform apply -auto-approve'
```

## Reviewed example

```groovy
pipeline {
    agent { label 'linux && terraform' }

    options {
        timestamps()
        disableConcurrentBuilds()
        timeout(time: 30, unit: 'MINUTES')
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Terraform Validate') {
            steps {
                dir('infrastructure') {
                    sh '''
                        terraform fmt -check -recursive
                        terraform init -input=false
                        terraform validate
                    '''
                }
            }
        }

        stage('Terraform Plan') {
            steps {
                dir('infrastructure') {
                    sh '''
                        terraform plan \
                          -input=false \
                          -out=tfplan
                        terraform show -no-color tfplan > tfplan.txt
                    '''
                }
            }
        }

        stage('Approval') {
            when { branch 'main' }
            steps {
                input message: 'Apply the reviewed Terraform plan?',
                      ok: 'Apply'
            }
        }

        stage('Terraform Apply') {
            when { branch 'main' }
            steps {
                dir('infrastructure') {
                    sh 'terraform apply -input=false tfplan'
                }
            }
        }
    }

    post {
        always {
            archiveArtifacts artifacts: 'infrastructure/tfplan.txt',
                             allowEmptyArchive: true
            deleteDir()
        }
    }
}
```

Security notes:

- Saved plans can contain sensitive values; access and retention must be protected.
- Text plans may also expose sensitive context.
- Use remote state with locking.
- Verify AWS account and Region.
- Use one controlled apply per state.
- A production design should separate plan and apply permissions and ensure that the exact approved plan is applied.
- Do not run Terraform apply automatically for untrusted pull requests.

---

# 15. Pipeline reliability and security

## Reliability practices

- Add timeouts.
- Prevent unsafe concurrent deployments.
- Use retry only for genuinely transient operations.
- Preserve real test results.
- Use immutable artifact versions.
- Clean workspaces without deleting required external state.
- Make deployments idempotent.
- Add verification after deployment.
- Design rollback or recovery procedures.

## Security practices

- Store Jenkinsfiles in reviewed repositories.
- Restrict who may modify deployment Pipelines.
- Scope credentials to the minimum jobs and environments.
- Separate trusted and untrusted builds.
- Use agents with minimum privileges.
- Avoid secrets in parameters, command lines and console output.
- Keep plugin count low and versions maintained.
- Avoid running builds on the controller.
- Protect Jenkins backups as sensitive data.
- Audit administrative and credential access.

## Quality gates

A pipeline should fail based on real tool exit codes or policy results, not printed messages.

Possible gates:

- Unit/integration test failures
- Linting or formatting failures
- Static analysis thresholds
- Dependency or image vulnerability policy
- Infrastructure-plan policy
- Manual approval for protected environments

---

# 16. Troubleshooting

## Start with this evidence

1. Open the exact failed build.
2. Identify the first failing stage and command.
3. Read console output around the first error.
4. Confirm which node/agent executed the step.
5. Verify workspace paths and tool versions on that agent.
6. Check Jenkins controller logs only when the failure is controller/plugin related.

## Jenkins service not starting

```bash
java -version
sudo systemctl status jenkins
sudo journalctl -u jenkins --no-pager -n 200
```

Check Java compatibility, port conflict, file permissions and configuration changes.

## Pipeline waits indefinitely

Possible causes:

- No online agent matches the label.
- All executors are busy.
- A previous build holds a lock/resource.
- An interactive command such as `docker run -it` is blocking.
- A step has no timeout.

## `command not found`

The command must exist on the executing agent, not merely on the controller or your laptop.

```groovy
sh '''
    java -version
    git --version
    mvn -version
    docker version
'''
```

Run only the checks relevant to that labelled agent.

## Git checkout failure

Check:

- Repository URL and branch
- Credential scope
- Host-key/TLS verification
- Network and DNS
- Permission to the exact repository
- Whether the webhook revision still exists

## Permission denied on Docker socket

Do not use `chmod 777`. Verify the agent design and required Docker access. Remember that Docker group membership is root-equivalent on the host.

## Credentials not found

Check credential ID, credential type, folder/domain scope and job permissions. Do not solve it by copying the secret into the Jenkinsfile.

## Build succeeds but tests were not run

Check for flags such as `-DskipTests`, ignored shell exit codes, empty test patterns and fake `echo` statements. Confirm that Jenkins records actual test reports.

## Disk-space problems

Inspect workspaces, build retention, Docker images/caches and artifact strategy. Configure intentional retention rather than destructive global cleanup commands.

---

# 17. Practical labs

## Lab 1 — Jenkins installation and security

1. Install a supported Java and Jenkins LTS.
2. Complete initial setup with a named administrator.
3. Configure authentication and authorization.
4. Review installed plugins and Jenkins URL.
5. Document the backup location and restoration approach.

## Lab 2 — Freestyle job

1. Create the safe Freestyle lab.
2. Produce a real artifact.
3. Fail one `test` command intentionally.
4. Observe build status and console output.

## Lab 3 — Pipeline as Code

1. Commit a Jenkinsfile.
2. Run checkout, build, test and package stages.
3. Add timeout and timestamps.
4. Archive only expected artifacts.

## Lab 4 — Maven CI

1. Build using `mvn clean verify`.
2. Record JUnit reports.
3. Archive the JAR only after success.
4. Intentionally break a test and observe the result.

## Lab 5 — Docker image workflow

1. Build after tests pass.
2. Tag with Git commit.
3. Authenticate with `--password-stdin`.
4. Scan and push only from the protected branch.

## Lab 6 — Terraform review flow

1. Format and validate Terraform.
2. Create a saved plan.
3. Review the plan text securely.
4. Add a protected approval.
5. Apply the exact saved plan in a sandbox.

---

# 18. Assignment and mini project

## Assignment questions

1. Compare Continuous Integration, Delivery and Deployment.
2. Explain controller, agent, node and executor.
3. Why should general builds not run on the controller?
4. Compare Freestyle and Pipeline jobs.
5. Why should Jenkinsfiles be stored in Git?
6. Explain stage versus step.
7. Why is printing “tests passed” not a real test?
8. Compare artifact and stash.
9. Why should `docker login -p` be avoided?
10. Why should untrusted pull requests not receive deployment credentials?
11. Why is the Docker group security-sensitive?
12. Why should Docker images use immutable tags?
13. Why should Terraform plan and apply be separated by review?
14. Why can saved Terraform plans be sensitive?
15. How would you troubleshoot a Pipeline waiting for an agent?

## Mini project — Secure multi-stage delivery Pipeline

Build this flow:

```text
Git push / pull request
        ↓
Checkout exact revision
        ↓
Build application
        ↓
Run and record tests
        ↓
Static/security checks
        ↓
Package artifact
        ↓
Build and scan image
        ↓
Push immutable image
        ↓
Protected deployment approval
        ↓
Deploy and verify
```

Requirements:

- Store the Jenkinsfile in Git.
- Use a dedicated labelled agent.
- Add timeout, timestamps and safe concurrency control.
- Run real tests and publish reports.
- Archive only expected artifacts.
- Store secrets in Jenkins Credentials.
- Use immutable artifact/image versions.
- Do not expose secrets through Groovy interpolation or command arguments.
- Restrict publishing and deployment to an approved branch.
- Include an approval for the protected environment.
- Verify deployment health.
- Document rollback, retention and troubleshooting procedures.
- Do not use personal repository URLs, usernames, passwords or bucket names in reusable documentation.

---

# Official references

- Jenkins documentation: https://www.jenkins.io/doc/
- Installing Jenkins: https://www.jenkins.io/doc/book/installing/
- Linux installation: https://www.jenkins.io/doc/book/installing/linux/
- Jenkins Pipeline: https://www.jenkins.io/doc/book/pipeline/
- Using a Jenkinsfile: https://www.jenkins.io/doc/book/pipeline/jenkinsfile/
- Pipeline syntax: https://www.jenkins.io/doc/book/pipeline/syntax/
- Credentials: https://www.jenkins.io/doc/book/using/using-credentials/
- Managing nodes: https://www.jenkins.io/doc/book/managing/nodes/
- Jenkins security: https://www.jenkins.io/doc/book/security/
- Pipeline steps: https://www.jenkins.io/doc/pipeline/steps/

> Jenkins core, Java requirements and plugins evolve independently. Verify compatibility before installing or upgrading, and test upgrades before production rollout.
