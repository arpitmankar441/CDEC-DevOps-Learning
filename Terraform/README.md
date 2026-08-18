# 🏗️ Terraform and Infrastructure as Code — Student Learning Guide

This section teaches Infrastructure as Code and Terraform from first principles to a safe AWS infrastructure project.

> **Learning method:** Write → Format → Validate → Plan → Review → Apply → Verify → Destroy

## Prerequisites

Students should understand:

- Linux commands and files
- Git fundamentals
- Basic networking
- AWS Regions, IAM, EC2, VPC and security groups
- Basic HCL/YAML-style structured configuration

## Learning outcomes

After completing this guide, a student should be able to:

- Explain Infrastructure as Code and Terraform's role.
- Understand providers, resources, data sources and Terraform state.
- Write typed variables, local values and outputs.
- Follow the `init → fmt → validate → plan → apply` workflow.
- Read a plan before approving infrastructure changes.
- Organize configuration into reusable modules.
- Use `count`, `for_each`, conditions and lifecycle rules appropriately.
- Separate environments and configure remote state safely.
- Import existing resources and refactor addresses safely.
- Protect credentials, state files and sensitive values.
- Troubleshoot common initialization, planning and apply failures.

## Roadmap

1. Infrastructure as Code
2. Terraform architecture and workflow
3. Installation and project structure
4. HCL fundamentals
5. First local project
6. Variables, locals, outputs and data sources
7. State and dependency lock files
8. AWS authentication and first AWS project
9. Meta-arguments and lifecycle
10. Collections and loops
11. Modules
12. Environment strategies and workspaces
13. Remote state and locking
14. Importing and refactoring resources
15. Provisioners and safer alternatives
16. Security and team workflow
17. Troubleshooting
18. Labs, assignment and mini project

---

# 1. Infrastructure as Code

Infrastructure as Code (IaC) means defining and managing infrastructure through version-controlled configuration rather than relying only on manual console actions.

IaC can improve:

- Repeatability
- Reviewability
- Automation
- Consistency between environments
- Recovery and recreation
- Change history through Git

IaC does not automatically guarantee good infrastructure. Poorly reviewed code can consistently create insecure or expensive resources.

## Declarative versus imperative

- Imperative: describes a sequence of actions.
- Declarative: describes the desired result and lets the tool determine required changes.

Terraform is primarily declarative.

## Shell, Ansible and Terraform

| Tool | Primary strength | Typical use |
|---|---|---|
| Shell | Flexible command automation | Small operational tasks and glue scripts |
| Ansible | Configuration management and orchestration | Installing/configuring software across hosts |
| Terraform | Infrastructure provisioning and lifecycle | Networks, compute, storage, managed services and policies |

These tools can overlap. Shell scripts can be written idempotently, and Ansible can provision cloud resources. The distinction is their design focus, not an absolute technical limitation.

---

# 2. Terraform architecture and workflow

Terraform uses:

| Component | Purpose |
|---|---|
| Terraform CLI/Core | Reads configuration, builds dependency graphs, creates plans and manages state operations |
| Provider | Plugin that communicates with an API such as AWS, Azure, GitHub or Kubernetes |
| Configuration | HCL files describing desired infrastructure |
| State | Terraform's mapping between configuration addresses and managed real objects |
| Backend | Determines where state is stored and, when supported, how it is locked |
| Registry | Distributes providers and modules |

## Core workflow

```text
Write configuration
       ↓
terraform init
       ↓
terraform fmt + terraform validate
       ↓
terraform plan
       ↓
Human review
       ↓
terraform apply
       ↓
Verify and maintain
```

Important: `terraform plan` previews proposed actions. `terraform apply` can create, update or destroy real infrastructure.

## Desired state and reconciliation

Terraform compares:

1. Configuration
2. Prior state
3. Remote infrastructure as read through providers

It then proposes actions to make managed infrastructure match the configuration.

---

# 3. Installation and project structure

Use official installation instructions because package versions and repositories change:

- Install Terraform: https://developer.hashicorp.com/terraform/install
- AWS CLI: https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html

Verify:

```bash
terraform version
terraform -help
```

## Recommended beginner structure

```text
student-project/
├── versions.tf
├── providers.tf
├── main.tf
├── variables.tf
├── outputs.tf
├── terraform.tfvars.example
├── .gitignore
└── README.md
```

Terraform loads all `.tf` files in one directory as one module. Filenames help humans organize code; they do not create execution order.

## `.gitignore`

```gitignore
.terraform/
*.tfstate
*.tfstate.*
crash.log
crash.*.log
*.tfvars
*.tfplan
.terraform.tfstate.lock.info
```

Commit `.terraform.lock.hcl`. It records selected provider versions and checksums, helping teams install consistent dependencies.

Do not commit real secrets in `.tfvars` files. A non-secret `terraform.tfvars.example` can document expected inputs.

---

# 4. HCL fundamentals

Terraform configuration uses HashiCorp Configuration Language (HCL).

## Terraform and provider requirements

```hcl
terraform {
  required_version = ">= 1.10, < 2.0"

  required_providers {
    local = {
      source  = "hashicorp/local"
      version = "~> 2.5"
    }
  }
}
```

## Common blocks

| Block | Purpose |
|---|---|
| `terraform` | Terraform version, providers and backend/cloud settings |
| `provider` | Provider-specific configuration |
| `resource` | Infrastructure Terraform creates or manages |
| `data` | Reads existing information without managing its lifecycle |
| `variable` | Defines module inputs |
| `locals` | Defines reusable expressions inside a module |
| `output` | Exposes selected values from a module |
| `module` | Calls another Terraform module |
| `moved` | Records a resource-address refactor |
| `import` | Declaratively associates an existing object with a resource address |

## Resource address

```hcl
resource "local_file" "welcome" {
  filename = "${path.module}/welcome.txt"
  content  = "Hello Terraform"
}
```

The resource type is `local_file`, its local name is `welcome`, and its address is:

```text
local_file.welcome
```

## Expressions and references

```hcl
locals {
  project_name = "student-terraform"
}

output "file_path" {
  value = local_file.welcome.filename
}
```

References normally create implicit dependencies. Avoid unnecessary `depends_on` when Terraform can infer the relationship from references.

---

# 5. First project without cloud charges

Create `versions.tf`:

```hcl
terraform {
  required_version = ">= 1.10, < 2.0"

  required_providers {
    local = {
      source  = "hashicorp/local"
      version = "~> 2.5"
    }
  }
}
```

Create `main.tf`:

```hcl
resource "local_file" "welcome" {
  filename = "${path.module}/welcome.txt"
  content  = "Terraform created this file."
}
```

Run:

```bash
terraform init
terraform fmt -recursive
terraform validate
terraform plan -out=tfplan
terraform show tfplan
terraform apply tfplan
terraform output
terraform destroy
```

Students should inspect the created file and then confirm that `terraform destroy` removes the managed file.

> Saved plan files can contain configuration, state and sensitive values. Do not commit them.

---

# 6. Variables, locals, outputs and data sources

## Typed variable

```hcl
variable "environment" {
  description = "Deployment environment name"
  type        = string
  default     = "dev"

  validation {
    condition     = contains(["dev", "stage", "prod"], var.environment)
    error_message = "Environment must be dev, stage, or prod."
  }
}
```

## Local values

```hcl
locals {
  common_tags = {
    Project     = "student-platform"
    Environment = var.environment
    ManagedBy   = "Terraform"
  }
}
```

## Output

```hcl
output "environment" {
  description = "Selected environment"
  value       = var.environment
}
```

## Data source

```hcl
data "aws_caller_identity" "current" {}

output "aws_account_id" {
  value = data.aws_caller_identity.current.account_id
}
```

Data sources read information. They do not mean Terraform manages the lifecycle of the referenced object.

## Variable precedence

Values can come from defaults, environment variables, variable files, command-line options and other mechanisms. Avoid relying on complicated precedence. Keep environment inputs explicit and documented.

Do not pass secrets directly on a shared shell command line because shell history and process inspection may expose them.

---

# 7. Terraform state

Terraform state maps resource addresses to real infrastructure objects and stores metadata needed for planning.

Common commands:

```bash
terraform state list
terraform state show RESOURCE_ADDRESS
terraform show
```

## State safety rules

- Never manually edit a state file.
- Never commit state to Git.
- Treat state as sensitive data.
- Back up and version remote state.
- Use locking when supported.
- Restrict backend access using least privilege.
- Do not run concurrent applies against the same unlocked state.

Marking a variable `sensitive = true` redacts normal CLI/UI display, but the value can still be stored in state and plan files. Sensitive does not mean encrypted or omitted.

Terraform versions that support ephemeral values and write-only arguments can prevent compatible temporary values from being persisted, but provider/resource support and version requirements must be checked.

## Drift

Drift occurs when real infrastructure changes outside the expected Terraform workflow.

```bash
terraform plan
terraform plan -refresh-only
```

Review refresh-only changes before applying them. Avoid the deprecated standalone `terraform refresh` workflow for new teaching material.

---

# 8. AWS authentication and first AWS project

## Cost and permission warning

AWS resources can generate charges. Before applying:

1. Confirm the active AWS account and Region.
2. Review current pricing and Free Tier eligibility.
3. Inspect the full Terraform plan.
4. Use a learning account or sandbox where possible.
5. Destroy resources after the lab.
6. Verify deletion in both Terraform output and AWS.

## Authentication

Do not place access keys in `.tf` files.

Prefer short-lived credentials, IAM roles, AWS IAM Identity Center or an approved credential process. For a configured local AWS CLI profile:

```bash
aws sts get-caller-identity
aws configure list
```

## AWS provider

```hcl
terraform {
  required_version = ">= 1.10, < 2.0"

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 6.0"
    }
  }
}

provider "aws" {
  region = var.aws_region

  default_tags {
    tags = local.common_tags
  }
}
```

## Region and AMI inputs

Avoid copying an AMI ID from another Region. AMI IDs are region-specific and change over time.

```hcl
variable "aws_region" {
  description = "AWS Region for the lab"
  type        = string
  default     = "ap-south-1"
}

data "aws_ami" "amazon_linux" {
  most_recent = true
  owners      = ["amazon"]

  filter {
    name   = "name"
    values = ["al2023-ami-2023.*-x86_64"]
  }

  filter {
    name   = "virtualization-type"
    values = ["hvm"]
  }
}
```

## Learning EC2 example

The following example assumes the selected Region has a default VPC.

```hcl
data "aws_vpc" "default" {
  default = true
}

resource "aws_security_group" "web" {
  name_prefix = "student-web-"
  description = "Allow HTTP for the learning lab"
  vpc_id      = data.aws_vpc.default.id

  ingress {
    description = "HTTP"
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

resource "aws_instance" "web" {
  ami                    = data.aws_ami.amazon_linux.id
  instance_type          = "t3.micro"
  vpc_security_group_ids = [aws_security_group.web.id]

  user_data = <<-EOT
    #!/bin/bash
    dnf install -y nginx
    systemctl enable --now nginx
    echo 'Hello from Terraform' > /usr/share/nginx/html/index.html
  EOT

  metadata_options {
    http_tokens = "required"
  }
}

output "web_url" {
  value = "http://${aws_instance.web.public_ip}"
}
```

Security note: public HTTP is used only to keep this beginner lab understandable. Production designs should address HTTPS, restricted ingress, private subnets, load balancing, patching, logging and other security requirements.

Run:

```bash
terraform init
terraform fmt -recursive
terraform validate
terraform plan -out=tfplan
terraform show tfplan
terraform apply tfplan
terraform output web_url
terraform destroy
```

Never assume `terraform destroy` completed successfully. Read its output and verify the account for remaining chargeable resources.

---

# 9. Meta-arguments and lifecycle

Common meta-arguments include:

- `count`
- `for_each`
- `depends_on`
- `provider`
- `lifecycle`

## Lifecycle example

```hcl
resource "aws_instance" "web" {
  # ...

  lifecycle {
    create_before_destroy = true
  }
}
```

Lifecycle rules change resource behavior and must be chosen deliberately. `prevent_destroy` is a safety guard, not a substitute for backups or access control.

## Replace a resource

Do not teach deprecated `terraform taint` as the main workflow. Review a replacement plan instead:

```bash
terraform plan -replace="aws_instance.web"
terraform apply -replace="aws_instance.web"
```

Targeting (`-target`) is for exceptional recovery or troubleshooting, not routine deployment. It can produce an incomplete view of the configuration.

---

# 10. Collections and loops

## `count`

Useful for conditional creation or nearly identical indexed instances.

```hcl
resource "local_file" "indexed" {
  count    = 3
  filename = "${path.module}/file-${count.index}.txt"
  content  = "Index ${count.index}"
}
```

## `for_each`

Prefer `for_each` when instances have meaningful stable keys.

```hcl
variable "files" {
  type = map(string)
  default = {
    dev   = "development"
    stage = "staging"
  }
}

resource "local_file" "environment" {
  for_each = var.files
  filename = "${path.module}/${each.key}.txt"
  content  = each.value
}
```

## `for` expression

```hcl
locals {
  uppercase_names = [for name in keys(var.files) : upper(name)]
}
```

Do not switch an existing resource between `count` and `for_each` without planning address migration. Otherwise Terraform may propose unintended destroy/create actions.

---

# 11. Modules

A module is a collection of Terraform configuration managed together. Every configuration directory is a module; the directory where Terraform runs is the root module.

## Structure

```text
project/
├── main.tf
├── variables.tf
├── outputs.tf
└── modules/
    └── web-instance/
        ├── main.tf
        ├── variables.tf
        ├── outputs.tf
        └── README.md
```

## Calling a local module

```hcl
module "web" {
  source = "./modules/web-instance"

  environment   = var.environment
  instance_type = "t3.micro"
}
```

Good modules:

- Have a focused responsibility.
- Define typed, described inputs.
- Expose only useful outputs.
- Avoid hard-coded environment-specific values.
- Document requirements, behavior and examples.
- Pin external module versions.
- Avoid unnecessary provider configurations inside reusable child modules.

Do not create a module for every individual resource. Extract a module when a meaningful group of resources needs reuse or a stable interface.

---

# 12. Environments and workspaces

Common strategies include:

1. Separate root directories with separate state/backends.
2. Reusable modules called by environment-specific roots.
3. HCP Terraform/Enterprise workspaces.
4. CLI workspaces for suitable cases requiring multiple states for one configuration.

## Variable files

```text
environments/
├── dev.tfvars
├── stage.tfvars
└── prod.tfvars
```

```bash
terraform plan -var-file=environments/dev.tfvars
```

Variable files change input values; they do not automatically create separate state. State isolation must be designed separately.

## CLI workspaces

```bash
terraform workspace list
terraform workspace new dev
terraform workspace select dev
terraform workspace show
```

CLI workspaces provide multiple state instances for one configuration. They are not appropriate when environments require separate credentials, access controls, ownership or strong isolation.

For serious dev/stage/prod separation, separate roots/backends and credentials are often clearer.

---

# 13. Remote state and locking

Local state is acceptable for the first isolated lab. Teams generally need a protected remote backend with locking support.

## S3 backend example

The bucket must exist before this backend is initialized. Bootstrap backend infrastructure separately.

```hcl
terraform {
  backend "s3" {
    bucket       = "replace-with-existing-state-bucket"
    key          = "student-platform/dev/terraform.tfstate"
    region       = "ap-south-1"
    encrypt      = true
    use_lockfile = true
  }
}
```

Current S3 backend guidance supports S3 lockfiles through `use_lockfile`. DynamoDB-based locking is deprecated in current Terraform documentation.

Protect the state bucket with:

- Block Public Access
- Versioning
- Encryption
- Least-privilege IAM
- Logging/monitoring appropriate to the organization
- Recovery procedures tested before an incident

Do not hard-code backend credentials. After changing backend configuration:

```bash
terraform init -migrate-state
```

Read the migration prompt and back up state before performing a real migration.

Do not disable locking with `-lock=false` as a normal fix. Investigate whether another operation is active before considering force-unlock.

---

# 14. Importing and refactoring resources

## Import block

Define the destination resource configuration and an import block:

```hcl
resource "aws_s3_bucket" "existing" {
  bucket = "existing-example-bucket"
}

import {
  to = aws_s3_bucket.existing
  id = "existing-example-bucket"
}
```

Then run `terraform plan` and reconcile configuration with the actual object. Import associates an object with state; it does not automatically produce a complete, maintainable design.

## Moved block

Use a moved block when changing a resource address:

```hcl
moved {
  from = aws_instance.web
  to   = module.web.aws_instance.this
}
```

This records intent and helps avoid unnecessary replacement during refactoring.

## Removed block

Use a reviewed `removed` block when Terraform should stop managing an object without destroying it. State-manipulation commands are powerful and should not be taught as casual fixes.

---

# 15. Provisioners and safer alternatives

Terraform provisioners include `local-exec`, `remote-exec` and `file`. They are a last resort because Terraform cannot reliably model all side effects they create.

Prefer:

- Cloud-init or instance user data
- Image-building tools
- Configuration-management tools
- Provider-native resources
- Managed deployment services

If a provisioner is unavoidable:

- Document why no purpose-built alternative fits.
- Avoid secrets in command strings and logs.
- Make operations repeatable.
- Define connection/security behavior carefully.
- Test failure and replacement behavior.

Never put private-key contents directly in a committed `.tf` file.

---

# 16. Security and team workflow

## Credentials

- Do not hard-code cloud credentials.
- Prefer short-lived credentials and role-based access.
- Verify account and Region before planning/applying.
- Apply least privilege to users, roles and CI systems.

## Sensitive values

```hcl
variable "database_password" {
  description = "Database password supplied securely at runtime"
  type        = string
  sensitive   = true
}
```

`sensitive = true` hides normal display but does not keep the value out of state. Protect state accordingly.

## Review workflow

A basic team flow:

1. Create a branch.
2. Run `terraform fmt -check -recursive`.
3. Run `terraform validate`.
4. Generate a plan in an approved environment.
5. Review code and plan.
6. Approve through the team's process.
7. Apply the reviewed plan using controlled credentials.
8. Record results and monitor infrastructure.

Avoid uncontrolled `-auto-approve` use in production. Automation should include policy, review and approval appropriate to the risk.

## Files to commit

Normally commit:

- `.tf` configuration
- `.terraform.lock.hcl`
- Non-secret examples
- Module documentation
- CI validation configuration

Normally do not commit:

- `.terraform/`
- State and state backups
- Saved plan files
- Crash logs
- Secret `.tfvars`
- Credentials and private keys

---

# 17. Troubleshooting

## Standard diagnostic sequence

```bash
terraform version
terraform fmt -check -recursive
terraform init
terraform validate
terraform plan
```

## Provider installation or checksum problems

- Check network/proxy access.
- Check `.terraform.lock.hcl` changes.
- Run `terraform init -upgrade` only when an intentional provider upgrade is planned.
- Do not delete the lock file as a routine fix.

## Authentication failure

Verify identity outside Terraform:

```bash
aws sts get-caller-identity
```

Check profile, role session, expiration, Region and permissions without printing secrets.

## Resource already exists

Determine whether:

- Terraform should import and manage it.
- The configuration should use a data source.
- The object should remain externally managed.
- A naming collision exists.

Do not blindly rename or delete production infrastructure.

## State lock error

Confirm that no other plan/apply operation is active. Force-unlock only a verified stale lock and only with the exact lock ID.

## Unexpected destroy or replacement

Stop and inspect:

- Resource-address changes
- `count`/`for_each` key changes
- Provider-version upgrades
- Immutable arguments
- Changed data-source results
- Lifecycle settings
- Drift

Do not apply until the proposed action is understood.

## Useful commands

```bash
terraform providers
terraform state list
terraform state show ADDRESS
terraform console
terraform graph
terraform show
terraform output
```

Logs may contain sensitive information. Enable detailed Terraform logging only for controlled troubleshooting and remove generated logs afterward.

---

# 18. Practical labs

## Lab 1 — Local file lifecycle

1. Create a file with the local provider.
2. Format, validate and plan.
3. Apply and inspect state.
4. Change the content and review the update plan.
5. Destroy the managed file.

## Lab 2 — Variables and collections

1. Create typed inputs with validation.
2. Build files using `for_each`.
3. Produce a useful output.
4. Change a map key and explain the plan.

## Lab 3 — AWS identity and plan safety

1. Configure approved AWS credentials.
2. Verify account identity and Region.
3. Use a data source to display the account ID.
4. Run a plan without creating resources.

## Lab 4 — EC2 web server

1. Create the learning security group and instance.
2. Use a data source for the regional AMI.
3. Install Nginx through user data.
4. Verify the web page.
5. Destroy and verify removal.

## Lab 5 — Modules

1. Extract the web instance into a focused module.
2. Define typed variables and outputs.
3. Call the module from the root configuration.
4. Use a moved block where address migration is required.

## Lab 6 — Environment and remote state design

1. Compare separate directories, variable files and workspaces.
2. Design separate dev and prod state paths.
3. Configure a pre-created S3 backend with locking.
4. Explain access, versioning, recovery and cost considerations.

---

# 19. Assignment and mini project

## Assignment questions

1. What problem does Infrastructure as Code solve?
2. Explain Terraform Core, provider, configuration, state and backend.
3. What is the difference between a resource and a data source?
4. Explain `terraform init`, `validate`, `plan` and `apply`.
5. Why must a plan be reviewed?
6. Why should `.terraform.lock.hcl` be committed?
7. Why must state not be committed to Git?
8. Does `sensitive = true` remove a value from state?
9. Compare `count` and `for_each`.
10. When should `depends_on` be used?
11. What is a module?
12. Why are CLI workspaces unsuitable for some environment designs?
13. Why is state locking required?
14. Why is `terraform taint` not the preferred workflow?
15. Why should provisioners be a last resort?
16. What should you inspect if Terraform proposes an unexpected destroy?

## Mini project — AWS highly available web foundation

Build a controlled learning project containing:

```text
VPC
├── Public subnets in two Availability Zones
├── Internet gateway and routing
├── Application Load Balancer
└── Auto Scaling Group
    └── Launch Template → Web instances
```

Requirements:

- Use reusable modules with documented inputs and outputs.
- Use typed variables, validation and consistent tags.
- Discover appropriate Availability Zones and AMI data rather than copying region-specific IDs.
- Permit only necessary inbound traffic.
- Require IMDSv2 on EC2 instances.
- Use user data or an image, not SSH provisioners, for application bootstrap.
- Use a protected remote backend and locking.
- Keep credentials, state and plan files out of Git.
- Include `fmt`, validation and plan review steps.
- Document estimated cost and teardown procedure before apply.
- Demonstrate a controlled update and final destruction in a sandbox account.
- Verify that chargeable resources are removed.

> This is a learning foundation, not automatically a production-ready architecture. Production requirements may include HTTPS certificates, private application subnets, NAT strategy, WAF, centralized logging, backups, security monitoring, policy enforcement and disaster recovery.

---

# Official references

- Terraform documentation: https://developer.hashicorp.com/terraform/docs
- Terraform install: https://developer.hashicorp.com/terraform/install
- Core workflow: https://developer.hashicorp.com/terraform/intro/core-workflow
- Terraform language: https://developer.hashicorp.com/terraform/language
- Terraform CLI: https://developer.hashicorp.com/terraform/cli
- State: https://developer.hashicorp.com/terraform/language/state
- Backends: https://developer.hashicorp.com/terraform/language/backend
- S3 backend: https://developer.hashicorp.com/terraform/language/backend/s3
- Modules: https://developer.hashicorp.com/terraform/language/modules
- Workspaces: https://developer.hashicorp.com/terraform/language/state/workspaces
- Sensitive data: https://developer.hashicorp.com/terraform/language/manage-sensitive-data
- AWS provider: https://registry.terraform.io/providers/hashicorp/aws/latest/docs

> Terraform and providers evolve independently. Check the documentation and upgrade guides for the exact versions used by your project.
