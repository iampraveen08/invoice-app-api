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

## Folder structure:- 
- https://docs.google.com/document/d/1tBoAAK22gQ8B1afoRNaeFSOb3jQv0XKjLf7OQ0usosI/edit?usp=sharing

## Swagger documentation:- 
- http://localhost:5000/docs 
- https://invoice-app-api-4lv6.onrender.com/docs/

## Deployment link:-
- https://invoice-app-api-4lv6.onrender.com/

## Screenshot Doc:- 
- https://docs.google.com/document/d/1YyEgySbIzwRVuO1bKvgDmeQvq3k5AEIC-qOO-1sGC5E/edit?usp=sharing

## Setup

```bash
git clone <repo>
cd invoice-app-api
cp .env.example .env
npm install
npm run dev