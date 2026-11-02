# Tenant Database Architecture

## Purpose
Each tenant operates on a dedicated MongoDB database to ensure complete isolation, legal compliance, and zero risk of cross-tenant data leakage.

## Core Tenant Domain Schemas
- **Identity & Access**: Staff profiles, roles, permissions, customer accounts.
- **Salon & Spa Operations**: Service catalog, branches, service stations, appointments, calendar bookings, packages, memberships, loyalty points.
- **Beauty Training Institute**: Courses, syllabi, batches, student admissions, fee installments, attendance records, exam schedules, graded results, certificates.
- **Commerce & Financials**: Invoices, tax rates (GST/VAT), payment receipts, customer wallets, daily cash registers, petty cash, expenses, supplier purchases.
- **Inventory & Supply**: Professional salon inventory, retail products, batches, expiry alerts, stock transfers.
- **HR & Payroll**: Staff roster schedules, shift management, commission rules, payroll calculation, leave tracking.
