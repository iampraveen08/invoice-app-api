# Multi-Tenant Invoice Management System (Mini ERP API)

## Stack
Node.js, Express, MongoDB, JWT, RBAC, Multer, Nodemailer, Swagger

## Features
- Multi-tenant: all data scoped to `organization`
- JWT-based auth / RBAC (Admin, Manager, Accountant)
- Invite users & accept invites
- Clients & Invoices CRUD
- PDF upload
- Email invoices (mock/real)
- Dashboard summary per org
- Swagger docs `/docs`
- (Bonus) Cron reminders & Redis caching

## Folder structure:- https://docs.google.com/document/d/1tBoAAK22gQ8B1afoRNaeFSOb3jQv0XKjLf7OQ0usosI/edit?usp=sharing

## Postman or Swagger documentation:- https://docs.google.com/document/d/1VXwfZE7VJ6MGDf5qz_UhkcOT69zpKt9f7h044r3AQwY/edit?usp=sharing

## Video Demo:- 

## Setup

```bash
git clone <repo>
cd invoice-app-api
cp .env.example .env
npm i
npm run dev
Open Swagger: http://localhost:4000/docs

Key Flows
1) Register Org (Creates Admin)
POST /v1/auth/register-org

2) Login
POST /v1/auth/login

3) Invite User (Admin)
POST /v1/auth/invite (email + role)

4) Accept Invite
POST /v1/auth/accept-invite

5) CRUD
Clients: /v1/clients

Invoices: /v1/invoices (+ /send-email)

Dashboard: /v1/dashboard/summary