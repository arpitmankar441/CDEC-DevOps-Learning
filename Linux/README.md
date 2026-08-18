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
```

---

# 🎯 Linux Learning Outcome

After completing this Linux section, students should be able to:

- Understand Linux fundamentals
- Navigate the Linux file system
- Use essential Linux commands
- Create and manage files and directories
- Manage users and groups
- Understand and configure file permissions
- Monitor and manage processes
- Install and manage software packages
- Understand basic Linux networking
- Edit files using Vim
- Search and process text using grep, sed and awk
- Create and extract archives
- Schedule tasks using cron
- Troubleshoot common Linux problems
- Perform basic Linux administration tasks
- Use Linux confidently in DevOps environments

---

# 1. Operating System Basics

## What is an Operating System?

An Operating System (OS) is system software that manages computer hardware and provides an interface between the user and the computer.

Examples:

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

## Why Linux is Important for DevOps

Linux is widely used in DevOps because it is:

- Open-source
- Stable
- Secure
- Lightweight
- Automation-friendly
- Highly customizable
- Widely supported by cloud platforms

---

## Common Linux Distributions

Some popular Linux distributions are:

- Ubuntu
- Debian
- Red Hat Enterprise Linux (RHEL)
- Amazon Linux
- Rocky Linux

---

## 🎯 Student Practice

Before moving to the next topic, students should be able to answer:

1. What is an Operating System?
2. What are the main responsibilities of an OS?
3. What is Linux?
4. Why is Linux important for DevOps?
5. Name three Linux distributions.

---

# 🧪 Hands-On Practice

Students should practice Linux commands regularly instead of only reading theory.

Recommended practice environments:

- Ubuntu Linux
- Virtual Machine
- AWS EC2 Linux instance
- WSL (Windows Subsystem for Linux)

Example:

```bash
mkdir linux-practice
cd linux-practice
pwd
ls
```

---

# 🚀 Next Step

After completing Linux Fundamentals, students can continue with:

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
---

# 2. Linux Architecture

Linux follows a layered architecture that allows users and applications to interact with computer hardware.

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
```

## Linux Architecture Components

### 1. Hardware

Hardware is the physical part of a computer.

Examples:

- CPU
- RAM
- Hard Disk / SSD
- Keyboard
- Mouse
- Network Card

---

### 2. Kernel

The Kernel is the **core of the Linux operating system**.

It acts as a bridge between hardware and software.

The Kernel manages:

- CPU
- Memory
- Processes
- Devices
- File Systems
- Networking

### Example

When you run a command such as:

```bash
ls
```

the Shell communicates with the Kernel, and the Kernel helps access the required files and directories.

---

### 3. Shell

The Shell provides an interface between the user and the Kernel.

It accepts commands from the user and passes them to the operating system.

Common Linux shells include:

- Bash
- Zsh
- Fish

Example:

```bash
pwd
ls
cd /home
```

---

### 4. Applications and Tools

Applications are programs that users run to perform specific tasks.

Examples:

- Vim
- Git
- Python
- Docker
- SSH
- Package managers

---

## 🎯 Student Practice

Students should be able to answer:

1. What is Linux Architecture?
2. What is the Kernel?
3. What is a Shell?
4. What is the purpose of the Shell?
5. Name three Linux Shells.
6. What is the difference between Kernel and Shell?

---
---

# 3. Linux File System

The Linux file system is the way Linux organizes and stores files and directories.

Linux uses a **hierarchical file system**, which means files and directories are organized like a tree.

The top-level directory is:

```text
/
```

This is called the **root directory**.

## Linux Directory Structure

```text
/
├── bin
├── boot
├── dev
├── etc
├── home
├── lib
├── media
├── mnt
├── opt
├── proc
├── root
├── run
├── sbin
├── srv
├── sys
├── tmp
├── usr
└── var
```

## Important Linux Directories

| Directory | Purpose |
|---|---|
| `/` | Root directory |
| `/home` | Personal files of normal users |
| `/root` | Home directory of the root user |
| `/etc` | Configuration files |
| `/var` | Logs and frequently changing data |
| `/tmp` | Temporary files |
| `/usr` | User programs and utilities |
| `/bin` | Essential user commands |
| `/sbin` | System administration commands |
| `/boot` | Files required for system boot |
| `/dev` | Device files |
| `/proc` | Information about processes and the kernel |
| `/sys` | Information about devices and hardware |
| `/opt` | Optional or third-party software |
| `/mnt` | Temporary mount point |
| `/media` | Mounted removable devices |

---

## Root Directory `/`

The `/` directory is the starting point of the Linux file system.

All other directories are located under `/`.

Example:

```text
/
└── home
    └── student
        └── documents
```

---

## Home Directory

The `/home` directory contains personal directories for normal users.

Example:

```text
/home/student
```

A user can store personal files and directories inside their home directory.

---

## Configuration Directory `/etc`

The `/etc` directory contains system configuration files.

Examples:

```text
/etc/hosts
/etc/passwd
/etc/ssh/
```

---

## Log Directory `/var`

The `/var` directory contains data that changes frequently.

One important directory is:

```text
/var/log
```

It contains system and application log files.

---

## Temporary Directory `/tmp`

The `/tmp` directory is used for temporary files.

Example:

```text
/tmp
```

Applications can create temporary files here.

---

## 🎯 Student Practice

Students should be able to answer:

1. What is the Linux root directory?
2. What is the purpose of `/home`?
3. What is stored inside `/etc`?
4. What is `/var/log` used for?
5. What is the purpose of `/tmp`?
6. What is the difference between `/root` and `/home`?

---

## 💻 Practice Commands

Try these commands in a Linux terminal:

```bash
pwd
ls
ls /
ls /home
ls /etc
ls /var
cd /
pwd
```

> **Tip:** Never delete files from system directories while practicing. Use a personal practice directory inside your home directory.

---

# 4. Basic Linux Commands

Linux provides many commands that allow users to manage files, directories, processes, users, and system resources.

Students should first learn the most commonly used commands.

---

## 4.1 `pwd` — Print Working Directory

Shows the current directory.

```bash
pwd
```

Example:

```text
/home/student
```

---

## 4.2 `ls` — List Files

Lists files and directories.

```bash
ls
```

Useful options:

```bash
ls -l
ls -a
ls -lh
```

- `-l` → detailed information
- `-a` → shows hidden files
- `-h` → human-readable sizes

---

## 4.3 `cd` — Change Directory

Used to move between directories.

```bash
cd /home
```

Go to the parent directory:

```bash
cd ..
```

Go to the home directory:

```bash
cd ~
```

---

## 4.4 `clear` — Clear Terminal

Clears the terminal screen.

```bash
clear
```

---

## 4.5 `whoami` — Current User

Shows the currently logged-in user.

```bash
whoami
```

---

## 4.6 `hostname` — System Hostname

Shows the hostname of the computer.

```bash
hostname
```

---

## 4.7 `uname` — Kernel Information

Shows information about the Linux kernel.

```bash
uname -a
```

---

## 4.8 `cat` — Display File Content

Displays the contents of a file.

```bash
cat filename
```

Example:

```bash
cat /etc/os-release
```

---

## 4.9 `echo` — Display Text

Prints text to the terminal.

```bash
echo "Hello Linux"
```

You can also check environment variables:

```bash
echo $SHELL
```

---

## 4.10 `history` — Command History

Shows previously executed commands.

```bash
history
```

---

## 4.11 `date` — Display Date and Time

Shows the current date and time.

```bash
date
```

---

## 4.12 `free` — Memory Information

Shows memory usage.

```bash
free -h
```

The `-h` option displays human-readable values.

---

## 4.13 `df` — Disk Space

Shows available disk space.

```bash
df -h
```

---

## 4.14 `du` — Directory/File Size

Shows the size of files and directories.

```bash
du -sh filename
```

Example:

```bash
du -sh /home/student
```

---

## 4.15 `ps` — Running Processes

Shows currently running processes.

```bash
ps
```

A commonly used command is:

```bash
ps aux
```

---

## 4.16 `top` — Monitor Processes

Displays running processes and system resource usage.

```bash
top
```

Press:

```text
q
```

to exit.

---

## 4.17 `exit` — Exit Terminal

Closes the current shell session.

```bash
exit
```

---

# 📋 Basic Linux Commands Cheat Sheet

| Command | Purpose |
|---|---|
| `pwd` | Show current directory |
| `ls` | List files |
| `cd` | Change directory |
| `clear` | Clear terminal |
| `whoami` | Show current user |
| `hostname` | Show hostname |
| `uname -a` | Show kernel information |
| `cat` | Display file content |
| `echo` | Display text |
| `history` | Show command history |
| `date` | Show date and time |
| `free -h` | Show memory usage |
| `df -h` | Show disk usage |
| `du -sh` | Show file/directory size |
| `ps aux` | Show processes |
| `top` | Monitor processes |
| `exit` | Exit shell |

---

## 🎯 Student Practice

Practice these commands one by one:

```bash
pwd
ls
ls -la
whoami
hostname
uname -a
date
echo "Hello Linux"
free -h
df -h
ps aux
```

Students should understand what each command does before moving to the next topic.

---

## 🧪 Mini Practice Task

Run the following commands and observe the output:

```bash
pwd
whoami
hostname
uname -a
free -h
df -h
```

Then answer:

1. What is your current directory?
2. Which user are you logged in as?
3. What is your hostname?
4. What Linux kernel information is displayed?
5. How much memory is available?
6. How much disk space is available?

---
---

# 5. Files & Directories

Linux provides commands to create, view, copy, move, rename, and delete files and directories.

---

## 5.1 Create a Directory — `mkdir`

The `mkdir` command creates a new directory.

```bash
mkdir project
```

Create multiple directories:

```bash
mkdir dir1 dir2 dir3
```

Create nested directories:

```bash
mkdir -p project/src/app
```

---

## 5.2 Create a File — `touch`

The `touch` command creates an empty file.

```bash
touch file.txt
```

Create multiple files:

```bash
touch file1.txt file2.txt file3.txt
```

---

## 5.3 View Files — `ls`

List files and directories:

```bash
ls
```

Detailed listing:

```bash
ls -l
```

Show hidden files:

```bash
ls -la
```

---

## 5.4 Copy Files — `cp`

Copy a file:

```bash
cp file.txt backup.txt
```

Copy a file into a directory:

```bash
cp file.txt project/
```

Copy a directory:

```bash
cp -r project project-backup
```

The `-r` option means recursive.

---

## 5.5 Move Files — `mv`

Move a file:

```bash
mv file.txt project/
```

Move a file back:

```bash
mv project/file.txt .
```

---

## 5.6 Rename Files

The `mv` command is also used to rename files.

```bash
mv oldname.txt newname.txt
```

---

## 5.7 Remove a File — `rm`

Delete a file:

```bash
rm file.txt
```

Delete multiple files:

```bash
rm file1.txt file2.txt
```

> Be careful with `rm`. Deleted files may not be recoverable easily.

---

## 5.8 Remove an Empty Directory — `rmdir`

Remove an empty directory:

```bash
rmdir project
```

---

## 5.9 Remove a Directory and Its Contents

To remove a directory and everything inside it:

```bash
rm -r project
```

> Use `rm -r` carefully, especially when working as the root user.

---

## 5.10 View File Content — `cat`

Display the contents of a file:

```bash
cat file.txt
```

---

## 5.11 Add Text to a File

Using `echo`:

```bash
echo "Hello Linux" > file.txt
```

The `>` operator creates or overwrites the file.

To append text without overwriting:

```bash
echo "Welcome to DevOps" >> file.txt
```

---

## 5.12 View Large Files — `less`

The `less` command allows you to read large files page by page.

```bash
less file.txt
```

Press:

```text
q
```

to exit.

---

# 📋 Files & Directories Cheat Sheet

| Command | Purpose |
|---|---|
| `mkdir` | Create directory |
| `mkdir -p` | Create nested directories |
| `touch` | Create file |
| `ls` | List files |
| `cp` | Copy files |
| `cp -r` | Copy directories |
| `mv` | Move or rename |
| `rm` | Delete file |
| `rmdir` | Delete empty directory |
| `rm -r` | Delete directory and contents |
| `cat` | Display file content |
| `less` | View file page by page |
| `>` | Create/overwrite file |
| `>>` | Append to file |

---

# 🧪 Hands-On Practice

Create a practice environment:

```bash
mkdir linux-files-practice
cd linux-files-practice
```

Create directories:

```bash
mkdir projects documents backups
```

Create files:

```bash
touch file1.txt file2.txt
```

Check the contents:

```bash
ls -la
```

Add text:

```bash
echo "Linux Practice" > file1.txt
```

Read the file:

```bash
cat file1.txt
```

Create a backup:

```bash
cp file1.txt backups/
```

Rename a file:

```bash
mv file2.txt notes.txt
```

Check everything:

```bash
ls -la
ls -la backups
```

---

## 🎯 Student Practice

Students should be able to:

1. Create a directory.
2. Create a file.
3. Copy a file.
4. Move a file.
5. Rename a file.
6. Delete a file.
7. Create nested directories.
8. Add text to a file.
9. Read the contents of a file.
10. Explain the difference between `>` and `>>`.

---

> **Important:** Learn each technology step-by-step. Practice before moving to the next topic.
