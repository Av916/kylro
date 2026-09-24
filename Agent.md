# Kylro - Project & Feature Tracking

This document outlines the current state of the **Kylro** project, detailing the architecture, tech stack, and all features implemented across the monorepo so far.

## 🏗 Architecture & Tech Stack
Kylro is built as a **Turborepo** monorepo containing the following apps and packages:
- **`apps/web`**: The frontend web application built with **Next.js** (App Router).
- **`apps/api`**: The backend REST API service built with **Express (Node.js)** and TypeScript.
- **`packages/database`**: The database layer using **Drizzle ORM** with **PostgreSQL**.
- **`packages/eslint-config`** & **`packages/typescript-config`**: Shared configurations for the monorepo.

## 🚀 Features Implemented

### 1. Database & Data Models (`packages/database`)
The database schema has been fully designed and implemented with Drizzle ORM to support a comprehensive issue-tracking and workspace management system.
- **Authentication**: `user`, `account`, `session`, `magic-link-token`.
- **Workspaces**: `workspace`, `workspace-member`.
- **Projects**: `project`, `project-member`.
- **Issue Tracking**: `issue`, `comment`.

### 2. Backend API (`apps/api`)
The backend service has been structured with a modular architecture and core middlewares (error handling, validation, not found handlers). The following modules are functional:
- **Auth Module**: Handles user authentication, registration, and sessions (including magic links architecture).
- **Workspace Module**: Endpoints for creating, reading, updating, and managing workspaces, as well as handling workspace membership.
- **Project Module**: Endpoints for managing projects within workspaces and assigning project members.

### 3. Frontend Web Application (`apps/web`)
The Next.js application structure has been established with various routes and dashboards mapped to backend capabilities:
- **Landing Page** (`/`): The entry point of the application.
- **Authentication**:
  - Login Page (`/login`)
  - Signup Page (`/signup`)
- **Workspace Dashboard**:
  - Workspace Overview (`/workspace`)
- **Project Workspaces**:
  - Project Dashboard Overview (`/projects/[projectId]`)
  - Issues List (`/projects/[projectId]/issues`)
  - Kanban Board (`/projects/[projectId]/board`)
  - Project Members Management (`/projects/[projectId]/members`)
  - Activity / Audit Trail (`/projects/[projectId]/activity`)

## 🛠 Active Development Scripts
- **Development**: Running `bun dev` or `turbo run dev` starts all services concurrently:
  - Frontend (`@kylro/web`) on port `3000`.
  - Backend API (`@kylro/api`) on port `8000`.
  - Drizzle Studio (`@kylro/database`) for DB management on `https://local.drizzle.studio`.
