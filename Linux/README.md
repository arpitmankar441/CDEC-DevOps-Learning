# 🐧 Linux Fundamentals

Welcome to the **Linux Fundamentals** section.

Linux is one of the most important skills for a DevOps Engineer.

Before learning AWS, Docker, Kubernetes, Jenkins, Terraform and Ansible, students should build a strong understanding of Linux.

The goal of this section is:

> **Learn → Understand → Practice → Troubleshoot → Build**

---

# 📚 Linux Learning Roadmap

Students should follow this order:

```text
1. Operating System Basics
        ↓
2. Linux Fundamentals
        ↓
3. Linux Architecture
        ↓
4. Linux File System
        ↓
5. Basic Linux Commands
        ↓
6. Files & Directories
        ↓
7. Users & Groups
        ↓
8. File Permissions
        ↓
9. Processes
        ↓
10. Package Management
        ↓
11. Networking
        ↓
12. Vim Editor
        ↓
13. grep, sed & awk
        ↓
14. Archive & Compression
        ↓
15. Cron Jobs
        ↓
16. Practical Labs
        ↓
17. Assignment
        ↓
18. Mini Project
# 1. Operating System Basics

## What is an Operating System?

An Operating System (OS) is system software that acts as an interface between the user and computer hardware.

It manages hardware resources and provides services for applications.

### Examples of Operating Systems

- Linux
- Windows
- macOS
- Android
- iOS

---

## Main Responsibilities of an Operating System

An operating system manages:

- CPU
- Memory
- Storage
- Files
- Processes
- Users
- Devices
- Networking
- Security

---

## Linux vs Windows

| Feature | Linux | Windows |
|---|---|---|
| Type | Open-source | Proprietary |
| Source Code | Available | Closed |
| Command Line | Very powerful | PowerShell / CMD |
| Server Usage | Very common | Common |
| Customization | Highly customizable | More limited |
| Cost | Mostly free | Usually licensed |
| DevOps Usage | Very common | Less common |

---

## Why Linux is Important for DevOps

Linux is widely used in DevOps and cloud environments because it is:

- Open-source
- Stable
- Secure
- Lightweight
- Highly customizable
- Automation-friendly
- Widely supported by cloud platforms

### Common Linux Distributions

- Ubuntu
- Amazon Linux
- Red Hat Enterprise Linux (RHEL)
- Debian
- Rocky Linux

---

## 🎯 Student Practice

Before moving to the next topic, students should be able to answer:

1. What is an Operating System?
2. What are the responsibilities of an OS?
3. What is Linux?
4. What is the difference between Linux and Windows?
5. Why is Linux important for DevOps?
6. Name three Linux distributions.

---

# 2. Linux Architecture

Linux follows a layered architecture that allows users and applications to interact with computer hardware.

The main components are:

```text
+----------------------+
|        User          |
+----------------------+
           ↓
+----------------------+
| Application / Tools  |
+----------------------+
           ↓
+----------------------+
|        Shell         |
+----------------------+
           ↓
+----------------------+
|        Kernel        |
+----------------------+
           ↓
+----------------------+
|       Hardware       |
+----------------------+

---
