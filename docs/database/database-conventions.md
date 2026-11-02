# Database Conventions & Standards

## Mongoose Model Standards
- **Naming**: Singular CamelCase for models (`Appointment`, `Student`, `Tenant`), lowercase plural for collection names (`appointments`, `students`, `tenants`).
- **Timestamps**: All schemas must enforce `{ timestamps: true }` (`createdAt`, `updatedAt`).
- **Soft Deletion**: Business entities must support soft deletion (`isDeleted: Boolean`, `deletedAt: Date`).
- **Audit Tracking**: Modifications must record `createdBy` and `updatedBy` user IDs where applicable.
- **Indexing**: Compound indexes must always order by equality fields first, range fields second.
