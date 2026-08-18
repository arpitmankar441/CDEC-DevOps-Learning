# ☁️ AWS Fundamentals

Welcome to the **AWS Fundamentals** section.

AWS (Amazon Web Services) is a cloud computing platform used to build, deploy, manage and scale applications.

AWS is an important skill for DevOps engineers because many DevOps environments use AWS for servers, storage, networking, security and monitoring.

---

# 📚 AWS Learning Roadmap

Students should follow this order:

```text
1. Cloud Computing Fundamentals
        ↓
2. What is AWS?
        ↓
3. AWS Global Infrastructure
        ↓
4. Regions & Availability Zones
        ↓
5. IAM
        ↓
6. EC2
        ↓
7. EBS
        ↓
8. S3
        ↓
9. VPC
        ↓
10. Security Groups
        ↓
11. Load Balancer
        ↓
12. Auto Scaling
        ↓
13. Route 53
        ↓
14. CloudWatch
        ↓
15. AWS CLI
        ↓
16. Practical Labs
        ↓
17. Assignment
        ↓
18. Mini Project
```

---

# 🎯 AWS Learning Outcome

After completing this AWS section, students should be able to:

- Understand cloud computing fundamentals
- Understand AWS core concepts
- Understand AWS Regions and Availability Zones
- Create and manage IAM users and permissions
- Launch and manage EC2 instances
- Understand EBS storage
- Store objects using Amazon S3
- Understand basic AWS networking
- Configure security groups
- Understand load balancing and auto scaling
- Understand Route 53
- Monitor resources using CloudWatch
- Use the AWS CLI
- Perform basic AWS administration tasks
- Build basic cloud infrastructure
- Use AWS confidently in DevOps environments

---

# 1. Cloud Computing Fundamentals

## What is Cloud Computing?

Cloud computing is the delivery of computing resources over the internet.

These resources can include:

- Servers
- Storage
- Databases
- Networking
- Software
- Security
- Monitoring

Instead of purchasing and maintaining physical servers, organizations can use cloud services when needed.

---

## Benefits of Cloud Computing

Cloud computing provides:

- On-demand resources
- Scalability
- Flexibility
- High availability
- Global access
- Pay-as-you-go pricing
- Reduced hardware management

---

## Traditional Infrastructure vs Cloud

### Traditional Infrastructure

```text
Company
   ↓
Buy Physical Server
   ↓
Install Hardware
   ↓
Configure Server
   ↓
Deploy Application
```

### Cloud Infrastructure

```text
User
   ↓
Cloud Provider
   ↓
Cloud Resources
   ↓
Deploy Application
```

---

## 🎯 Student Practice

Students should be able to answer:

1. What is cloud computing?
2. What resources can be provided through the cloud?
3. What are the benefits of cloud computing?
4. What is the difference between traditional infrastructure and cloud infrastructure?

---

# 2. What is AWS?

AWS stands for **Amazon Web Services**.

AWS provides cloud services that organizations can use to build and run applications.

Common AWS services include:

- EC2
- S3
- IAM
- VPC
- EBS
- CloudWatch
- Route 53
- Elastic Load Balancing

---

## Why AWS is Important for DevOps

AWS provides infrastructure and services required to:

- Deploy applications
- Run servers
- Store data
- Configure networks
- Manage security
- Monitor applications
- Automate infrastructure

---

# 3. AWS Global Infrastructure

AWS has a global infrastructure that allows applications to run in different geographical locations.

The main components include:

- Regions
- Availability Zones
- Edge Locations

---

## AWS Region

A Region is a geographical area where AWS has multiple Availability Zones.

Examples:

- Mumbai
- Singapore
- Tokyo
- Frankfurt
- London
- North Virginia

Example Region:

```text
ap-south-1
```

---

## Availability Zone

An Availability Zone (AZ) is one or more isolated data centers within an AWS Region.

A Region normally contains multiple Availability Zones.

Example:

```text
AWS Region
     |
     +---- Availability Zone 1
     |
     +---- Availability Zone 2
     |
     +---- Availability Zone 3
```

Using multiple Availability Zones can improve application availability and fault tolerance.

---

# 4. IAM

IAM stands for **Identity and Access Management**.

IAM is used to control access to AWS resources.

IAM can manage:

- Users
- Groups
- Roles
- Policies
- Permissions

Example:

```text
IAM User
    ↓
IAM Policy
    ↓
AWS Resource
```

---

# 5. Amazon EC2

EC2 stands for **Elastic Compute Cloud**.

Amazon EC2 provides virtual servers in the AWS cloud.

These virtual servers are called **instances**.

EC2 is commonly used to:

- Host applications
- Run web servers
- Run Linux servers
- Deploy DevOps tools
- Run Docker containers
- Build development environments

---

## EC2 Basic Architecture

```text
User
  ↓
AWS
  ↓
EC2 Instance
  ↓
Operating System
  ↓
Application
```

---

# 6. Amazon EBS

EBS stands for **Elastic Block Store**.

Amazon EBS provides persistent block storage for EC2 instances.

It can be used to store:

- Operating system files
- Application files
- Databases
- Logs
- Other persistent data

---

## EBS and EC2

An EBS volume can be attached to an EC2 instance.

```text
EC2 Instance
     |
     ↓
EBS Volume
     |
     ↓
Persistent Storage
```

---

# 7. Amazon S3

S3 stands for **Simple Storage Service**.

Amazon S3 is an object storage service used to store and retrieve data.

S3 can store:

- Images
- Videos
- Documents
- Backups
- Logs
- Application files
- Static website files

---

## S3 Basic Architecture

```text
User / Application
        ↓
       S3
        ↓
     Bucket
        ↓
     Objects
```

---

# 🧪 Hands-On Practice

Students should practice AWS using a safe learning environment.

Recommended options:

- AWS Free Tier where eligible
- AWS Console
- AWS CLI
- EC2 Linux instance

> **Important:** Always check AWS pricing and free-tier eligibility before creating resources. Stop or delete resources when they are no longer needed.

---

# 🚀 DevOps Learning Path

After completing Linux, Git and AWS fundamentals, continue with:

```text
Linux
   ↓
Git & GitHub
   ↓
AWS
   ↓
Docker
   ↓
Jenkins
   ↓
Kubernetes
   ↓
Terraform
   ↓
Ansible
   ↓
DevOps Projects
```
